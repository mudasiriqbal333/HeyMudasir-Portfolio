import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

import { POST } from './route.js';
import { HONEYPOT_FIELD } from '../../_utils/helpers/contact-validation.js';

const WEBHOOK = 'https://hooks.example.com/contact';
const originalFetch = globalThis.fetch;
let upstream;

beforeEach(() => {
  upstream = { calls: [], status: 200 };
  process.env.CONTACT_WEBHOOK_URL = WEBHOOK;
  globalThis.fetch = async (url, init) => {
    upstream.calls.push({ url, init });
    return new Response('', { status: upstream.status });
  };
});

afterEach(() => {
  delete process.env.CONTACT_WEBHOOK_URL;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  globalThis.fetch = originalFetch;
});

//? Every test posts from its own address so the per-address limit of one
//? test never leaks into the next.
let visitor = 0;

const post = (body, headers = {}) => {
  visitor += 1;

  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': `203.0.113.${visitor}`,
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
};

const valid = {
  name: 'John Doe',
  email: 'john@doe.com',
  company: 'John & Doe',
  service: 'Web Design',
  message: 'Hello, can you help me with a website?',
};

test('forwards a valid submission to the webhook and returns ok', async () => {
  const res = await post(valid);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(upstream.calls.length, 1);
  assert.equal(upstream.calls[0].url, WEBHOOK);
  const forwarded = JSON.parse(upstream.calls[0].init.body);
  assert.equal(forwarded.email, 'john@doe.com');
  assert.equal(forwarded.message, valid.message);
});

test('rejects an invalid submission with 422 and does not forward it', async () => {
  const res = await post({ ...valid, name: 'J', email: 'nope' });
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.equal(body.errors.name, 'Please enter a valid name');
  assert.equal(body.errors.email, 'Please enter a valid email address');
  assert.equal(upstream.calls.length, 0);
});

test('silently accepts honeypot submissions without forwarding', async () => {
  const res = await post({ ...valid, name: '', [HONEYPOT_FIELD]: 'spam' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(upstream.calls.length, 0);
});

test('rejects a malformed JSON body with 400', async () => {
  const res = await post('{not json');
  assert.equal(res.status, 400);
  assert.equal((await res.json()).ok, false);
});

test('rejects a null JSON body with 400 instead of crashing', async () => {
  const res = await post('null');
  assert.equal(res.status, 400);
  assert.equal((await res.json()).ok, false);
});

test('answers 503 when no delivery is configured outside development', async () => {
  delete process.env.CONTACT_WEBHOOK_URL;
  const res = await post(valid);
  assert.equal(res.status, 503);
  assert.equal((await res.json()).ok, false);
  assert.equal(upstream.calls.length, 0);
});

test('answers 502 when the webhook rejects the message', async () => {
  upstream.status = 500;
  const res = await post(valid);
  assert.equal(res.status, 502);
  assert.equal((await res.json()).ok, false);
});

test('forwards only the five fields, trimmed', async () => {
  const res = await post({
    ...valid,
    name: '  John Doe  ',
    message: '  Hello, can you help me with a website?  ',
    [HONEYPOT_FIELD]: '',
    injected: 'not forwarded',
  });
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(upstream.calls[0].init.body), {
    name: 'John Doe',
    email: 'john@doe.com',
    company: 'John & Doe',
    service: 'Web Design',
    message: 'Hello, can you help me with a website?',
  });
});

test('rejects values that are not text with 422 and forwards nothing', async () => {
  const res = await post({ ...valid, company: { nested: ['x'] } });
  assert.equal(res.status, 422);
  assert.equal(upstream.calls.length, 0);
});

test('rejects an over-long optional field with 422', async () => {
  const res = await post({ ...valid, company: 'c'.repeat(5000) });
  assert.equal(res.status, 422);
  assert.equal(typeof (await res.json()).errors.company, 'string');
  assert.equal(upstream.calls.length, 0);
});

test('refuses a body that is not sent as JSON', async () => {
  //? text/plain is what a form on another website can post without the
  //? browser asking this server first.
  const res = await post(JSON.stringify(valid), {
    'content-type': 'text/plain',
  });
  assert.equal(res.status, 415);
  assert.equal(upstream.calls.length, 0);
});

test('refuses a request made from another website', async () => {
  const crossSite = await post(valid, { 'sec-fetch-site': 'cross-site' });
  assert.equal(crossSite.status, 403);

  const otherOrigin = await post(valid, { origin: 'https://evil.example' });
  assert.equal(otherOrigin.status, 403);

  assert.equal(upstream.calls.length, 0);
});

test('accepts a request from the site itself', async () => {
  const res = await post(valid, {
    origin: 'http://localhost',
    'sec-fetch-site': 'same-origin',
  });
  assert.equal(res.status, 200);
  assert.equal(upstream.calls.length, 1);
});

test('refuses an oversized body with 413 before reading it as JSON', async () => {
  const res = await post({ ...valid, message: 'm'.repeat(30_000) });
  assert.equal(res.status, 413);
  assert.equal(upstream.calls.length, 0);
});

test('gives the webhook call a time limit', async () => {
  await post(valid);
  assert.ok(upstream.calls[0].init.signal instanceof AbortSignal);
});

test('answers 502 when the webhook does not answer in time', async () => {
  globalThis.fetch = async () => {
    throw new DOMException('The operation timed out.', 'TimeoutError');
  };
  const res = await post(valid);
  assert.equal(res.status, 502);
});

test('limits how many messages one address can send', async () => {
  const from = { 'x-forwarded-for': '198.51.100.7' };
  const statuses = [];
  for (let i = 0; i < 6; i += 1) {
    statuses.push((await post(valid, from)).status);
  }

  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
  assert.equal(upstream.calls.length, 5);

  const refused = await post(valid, from);
  assert.ok(Number(refused.headers.get('retry-after')) > 0);

  //? Someone else is not affected.
  assert.equal((await post(valid)).status, 200);
});

test('emails the message through Resend when it has a key', async () => {
  delete process.env.CONTACT_WEBHOOK_URL;
  process.env.RESEND_API_KEY = 're_test_key';
  const res = await post({ ...valid, message: 'Hi <b>there</b> & bye' });

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(upstream.calls.length, 1);
  const { url, init } = upstream.calls[0];
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(init.headers.authorization, 'Bearer re_test_key');
  const email = JSON.parse(init.body);
  //? To the address on the contact page, answerable straight to the sender
  assert.deepEqual(email.to, ['mudasiriqbalmcs@gmail.com']);
  assert.equal(email.reply_to, 'john@doe.com');
  assert.equal(email.subject, 'New message from John Doe');
  assert.match(email.text, /Organisation: John & Doe/);
  assert.match(email.text, /Hi <b>there<\/b> & bye/);
  //? What the visitor typed is never read as HTML
  assert.match(email.html, /Hi &lt;b&gt;there&lt;\/b&gt; &amp; bye/);
  assert.doesNotMatch(email.html, /<b>there/);
});

test('emails rather than calling the webhook when both are set', async () => {
  process.env.RESEND_API_KEY = 're_test_key';
  const res = await post(valid);

  assert.equal(res.status, 200);
  assert.equal(upstream.calls.length, 1);
  assert.equal(upstream.calls[0].url, 'https://api.resend.com/emails');
});

test('sends to CONTACT_TO_EMAIL when it is set', async () => {
  process.env.RESEND_API_KEY = 're_test_key';
  process.env.CONTACT_TO_EMAIL = 'inbox@example.com';
  await post(valid);

  assert.deepEqual(JSON.parse(upstream.calls[0].init.body).to, [
    'inbox@example.com',
  ]);
});

test('answers 502 when Resend refuses the email', async () => {
  process.env.RESEND_API_KEY = 're_test_key';
  upstream.status = 403;
  const res = await post(valid);

  assert.equal(res.status, 502);
});
