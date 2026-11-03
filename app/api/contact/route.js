//? Relative imports on purpose: this route is unit-tested under `node --test`,
//? which cannot resolve the jsconfig `@/utils` alias.
import { contactOptions } from '../../_data/contact-options.js';
import {
  cleanContact,
  HONEYPOT_FIELD,
  validateContact,
} from '../../_utils/helpers/contact-validation.js';
import { createRateLimiter } from '../../_utils/helpers/rate-limit.js';

const json = (body, status = 200, headers = undefined) =>
  Response.json(body, { status, headers });

//? The form's own JSON is under 5 kB even with a full 3000-character
//? message, so anything far beyond that did not come from the form.
const MAX_BODY_CHARACTERS = 20_000;

//? A webhook or mail service that never answers must not hold the visitor
//? until the host gives up.
const WEBHOOK_TIMEOUT_MS = 8000;

//? Resend's API sends the message as an email (resend.com).
const RESEND_URL = 'https://api.resend.com/emails';

//? No domain yet, so Resend's shared sender. It only delivers to the address
//? the Resend account was opened with, which is fine here: the form only
//? mails the owner. Once a domain is verified on Resend, set
//? CONTACT_FROM_EMAIL (or change this) to a sender on it, e.g.
//? 'Portfolio contact form <contact@your-domain.com>'.
const DEFAULT_FROM = 'Portfolio contact form <onboarding@resend.dev>';

//? The address shown on the contact page, unless CONTACT_TO_EMAIL says
//? otherwise
const DEFAULT_TO = contactOptions.contactDetails
  .find(({ href }) => href.startsWith('mailto:'))
  ?.href.slice('mailto:'.length);

//? At most 5 delivered messages per address every 10 minutes.
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/** @param {Request} request */
const visitorAddress = request =>
  (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
  'unknown';

/**
 * True when a browser says the request comes from another website. The form
 * always posts from the site itself; tools such as curl send neither header
 * and are let through.
 * @param {Request} request
 */
function isFromAnotherSite(request) {
  const site = request.headers.get('sec-fetch-site');
  if (site) return site !== 'same-origin' && site !== 'none';

  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    //? Behind a proxy the app may see an internal host, so the Origin is
    //? accepted when it matches any name the request arrived under.
    const hosts = [
      request.headers.get('x-forwarded-host'),
      request.headers.get('host'),
      new URL(request.url).host,
    ];

    return !hosts.includes(new URL(origin).host);
  } catch {
    return true;
  }
}

/**
 * Delivers the message to the webhook named by CONTACT_WEBHOOK_URL (any
 * JSON-accepting endpoint: Formspree, Make, Zapier, n8n, your own API...).
 * @returns {Promise<boolean>} whether the upstream accepted it
 */
async function deliver(payload) {
  const response = await fetch(process.env.CONTACT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });

  return response.ok;
}

/** @param {string} value */
const escapeHtml = value =>
  value.replace(
    /[&<>"']/g,
    character =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );

/**
 * The email the owner receives: who wrote, how to answer them (Reply goes
 * straight to the sender) and the message itself.
 * @param {ReturnType<typeof cleanContact>} payload
 */
function emailFor({ name, email, company, service, message }) {
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Organisation', company],
    ['Looking for', service],
  ].filter(([, value]) => value);

  const details = rows
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 4px"><strong>${label}:</strong> ${escapeHtml(value)}</p>`,
    )
    .join('');
  const body = `<p style="margin:16px 0 0;white-space:pre-wrap">${escapeHtml(message)}</p>`;

  return {
    subject: `New message from ${name}`,
    text: `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${message}\n`,
    html: details + body,
  };
}

/**
 * Emails the message to the owner through Resend.
 * @param {ReturnType<typeof cleanContact>} payload
 * @returns {Promise<boolean>} whether Resend accepted it
 */
async function sendEmail(payload) {
  const response = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
      reply_to: payload.email,
      ...emailFor(payload),
    }),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });

  return response.ok;
}

/**
 * Receives the contact form. Validation mirrors the client so the messages
 * match. With RESEND_API_KEY the message is emailed to the owner; otherwise
 * it goes to CONTACT_WEBHOOK_URL. With neither it is only logged in
 * development and refused in production, so the UI never claims success
 * for a message that went nowhere.
 * @param {Request} request
 */
export async function POST(request) {
  if (isFromAnotherSite(request)) return json({ ok: false, errors: {} }, 403);

  //? Only JSON: a form on another website can post text/plain or form data
  //? without the browser asking this server first.
  const type = (request.headers.get('content-type') ?? '').toLowerCase();
  if (!type.startsWith('application/json')) {
    return json({ ok: false, errors: {} }, 415);
  }

  if (Number(request.headers.get('content-length')) > MAX_BODY_CHARACTERS) {
    return json({ ok: false, errors: {} }, 413);
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARACTERS) {
      return json({ ok: false, errors: {} }, 413);
    }

    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, errors: {} }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ ok: false, errors: {} }, 400);
  }

  //? Honeypot: humans never see this field. Pretend success so bots stop.
  if (body[HONEYPOT_FIELD]) return json({ ok: true });

  const { ok, errors } = validateContact(body);
  if (!ok) return json({ ok: false, errors }, 422);

  const allowed = limiter.take(visitorAddress(request));
  if (!allowed.ok) {
    return json({ ok: false }, 429, {
      'retry-after': String(allowed.retryAfter),
    });
  }

  const payload = cleanContact(body);

  let send = null;
  if (process.env.RESEND_API_KEY) send = sendEmail;
  else if (process.env.CONTACT_WEBHOOK_URL) send = deliver;

  if (send) {
    try {
      if (await send(payload)) return json({ ok: true });
    } catch {
      // fall through to the 502 below
    }
    return json({ ok: false }, 502);
  }

  if (process.env.NODE_ENV === 'development') {
    console.info(
      '[contact] New message (set RESEND_API_KEY or CONTACT_WEBHOOK_URL to deliver)',
      payload,
    );
    return json({ ok: true });
  }

  return json({ ok: false }, 503);
}
