import assert from 'node:assert/strict';
import { test } from 'node:test';

import { sitemapRoutes } from './site-urls.js';

const origin = 'https://example.com';

//? Research page switched off (see app/research/page.jsx): with it back on,
//? this is five routes and the lengths below are one higher.
test('lists the four static routes when there are no cases', () => {
  const urls = sitemapRoutes(origin).map(entry => entry.url);

  assert.deepEqual(urls, [
    'https://example.com/',
    'https://example.com/work',
    // 'https://example.com/research',
    'https://example.com/about',
    'https://example.com/contact',
  ]);
});

test('adds one URL per case, derived from its slug', () => {
  const urls = sitemapRoutes(origin, [
    { slug: 'my-friend' },
    { slug: 'jarvis' },
  ]).map(entry => entry.url);

  assert.ok(urls.includes('https://example.com/work/my-friend'));
  assert.ok(urls.includes('https://example.com/work/jarvis'));
  assert.equal(urls.length, 6);
});

test('never lists the contact success page', () => {
  const urls = sitemapRoutes(origin, [{ slug: 'success' }]).map(
    entry => entry.url,
  );

  assert.ok(!urls.some(url => url.endsWith('/contact/success')));
});

test('strips trailing slashes from the origin', () => {
  const [home] = sitemapRoutes('https://example.com//');

  assert.equal(home.url, 'https://example.com/');
});

test('skips empty, blank and missing slugs', () => {
  const urls = sitemapRoutes(origin, [
    { slug: '' },
    { slug: '   ' },
    {},
    { slug: 'jarvis' },
  ]).map(entry => entry.url);

  assert.equal(urls.length, 5);
  assert.ok(urls.includes('https://example.com/work/jarvis'));
});

test('does not repeat a URL when a slug is duplicated', () => {
  const urls = sitemapRoutes(origin, [
    { slug: 'jarvis' },
    { slug: 'jarvis' },
  ]).map(entry => entry.url);

  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls.length, 5);
});

test('stamps every entry with the given date and a priority', () => {
  const lastModified = new Date('2026-01-02T03:04:05.000Z');
  const entries = sitemapRoutes(origin, [{ slug: 'jarvis' }], lastModified);

  for (const entry of entries) {
    assert.equal(entry.lastModified, lastModified);
    assert.ok(entry.priority > 0 && entry.priority <= 1);
    assert.equal(typeof entry.changeFrequency, 'string');
  }
});
