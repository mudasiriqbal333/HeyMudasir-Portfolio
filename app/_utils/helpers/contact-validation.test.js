import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  cleanContact,
  contactErrors,
  contactLimits,
  HONEYPOT_FIELD,
  validateContact,
} from './contact-validation.js';

const valid = {
  name: 'John Doe',
  email: 'john@doe.com',
  company: 'John & Doe',
  service: 'Web Design',
  message: 'Hello, can you help me with a website?',
};

test('accepts a complete valid submission', () => {
  const result = validateContact(valid);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, {});
});

test('company and service are optional', () => {
  const result = validateContact({ ...valid, company: '', service: '' });
  assert.equal(result.ok, true);
});

test('accepts a two-letter name', () => {
  assert.equal(validateContact({ ...valid, name: 'Li' }).ok, true);
  assert.equal(validateContact({ ...valid, name: ' Jo ' }).ok, true);
});

test('rejects a name shorter than 2 characters', () => {
  const result = validateContact({ ...valid, name: 'J' });
  assert.equal(result.ok, false);
  assert.equal(result.errors.name, 'Please enter a valid name');
});

test('rejects a whitespace-only name', () => {
  const result = validateContact({ ...valid, name: '     ' });
  assert.equal(result.errors.name, contactErrors.name);
});

test('rejects an invalid email address', () => {
  const result = validateContact({ ...valid, email: 'john-at-doe' });
  assert.equal(result.ok, false);
  assert.equal(result.errors.email, 'Please enter a valid email address');
});

test('rejects a message shorter than 3 characters', () => {
  const result = validateContact({ ...valid, message: 'Hi' });
  assert.equal(
    result.errors.message,
    'Please enter a text between 3 and 3000 characters',
  );
});

test('rejects a message longer than 3000 characters', () => {
  const result = validateContact({ ...valid, message: 'a'.repeat(3001) });
  assert.equal(result.errors.message, contactErrors.message);
});

test('accepts a message of exactly 3000 characters', () => {
  const result = validateContact({ ...valid, message: 'a'.repeat(3000) });
  assert.equal(result.ok, true);
});

test('reports every failing field at once', () => {
  const result = validateContact({ name: '', email: '', message: '' });
  assert.deepEqual(Object.keys(result.errors).sort(), [
    'email',
    'message',
    'name',
  ]);
});

test('treats missing fields as empty strings', () => {
  const result = validateContact({});
  assert.equal(result.ok, false);
  assert.equal(result.errors.name, contactErrors.name);
});

test('exposes the honeypot field name shared by form and route', () => {
  assert.equal(typeof HONEYPOT_FIELD, 'string');
});

test('the honeypot is not a field an autofill profile holds', () => {
  //? If a browser or password manager filled it for a real visitor, their
  //? message would be dropped while the page says "Thank you".
  const autofilled = [
    'name',
    'email',
    'tel',
    'phone',
    'url',
    'website',
    'company',
    'organization',
    'address',
    'title',
    'nickname',
  ];
  assert.ok(!autofilled.includes(HONEYPOT_FIELD.toLowerCase()));
});

test('rejects values that are not text', () => {
  for (const bad of [{ a: 1 }, ['x', 'y', 'z'], 12345, true]) {
    assert.equal(
      validateContact({ ...valid, name: bad }).errors.name,
      contactErrors.name,
    );
    assert.equal(
      validateContact({ ...valid, email: bad }).errors.email,
      contactErrors.email,
    );
    assert.equal(
      validateContact({ ...valid, message: bad }).errors.message,
      contactErrors.message,
    );
    assert.equal(
      validateContact({ ...valid, company: bad }).errors.company,
      contactErrors.company,
    );
    assert.equal(
      validateContact({ ...valid, service: bad }).errors.service,
      contactErrors.service,
    );
  }
});

test('caps the length of every field', () => {
  const over = field => 'a'.repeat(contactLimits[field] + 1);
  const at = field => 'a'.repeat(contactLimits[field]);

  assert.equal(
    validateContact({ ...valid, name: over('name') }).errors.name,
    contactErrors.name,
  );
  assert.equal(validateContact({ ...valid, name: at('name') }).ok, true);

  const longEmail = `${'a'.repeat(contactLimits.email)}@doe.com`;
  assert.equal(
    validateContact({ ...valid, email: longEmail }).errors.email,
    contactErrors.email,
  );

  assert.equal(
    validateContact({ ...valid, company: over('company') }).errors.company,
    contactErrors.company,
  );
  assert.equal(validateContact({ ...valid, company: at('company') }).ok, true);

  assert.equal(
    validateContact({ ...valid, service: over('service') }).errors.service,
    contactErrors.service,
  );
  assert.equal(validateContact({ ...valid, service: at('service') }).ok, true);
});

test('cleanContact keeps the five fields, trimmed, and nothing else', () => {
  const cleaned = cleanContact({
    name: '  John Doe ',
    email: ' john@doe.com ',
    message: '\n Hello there \n',
    [HONEYPOT_FIELD]: 'spam',
    extra: 'dropped',
  });

  assert.deepEqual(cleaned, {
    name: 'John Doe',
    email: 'john@doe.com',
    company: '',
    service: '',
    message: 'Hello there',
  });
});

test('treats a null payload as empty', () => {
  const result = validateContact(null);
  assert.equal(result.ok, false);
  assert.equal(result.errors.name, contactErrors.name);
});
