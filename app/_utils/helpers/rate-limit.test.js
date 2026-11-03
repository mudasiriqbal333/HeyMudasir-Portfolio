import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createRateLimiter } from './rate-limit.js';

test('allows up to the limit inside the window, then refuses', () => {
  let now = 0;
  const limiter = createRateLimiter({
    limit: 3,
    windowMs: 1000,
    now: () => now,
  });

  assert.equal(limiter.take('a').ok, true);
  assert.equal(limiter.take('a').ok, true);
  assert.equal(limiter.take('a').ok, true);

  const refused = limiter.take('a');
  assert.equal(refused.ok, false);
  assert.equal(refused.retryAfter, 1);
});

test('counts each key on its own', () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });

  assert.equal(limiter.take('a').ok, true);
  assert.equal(limiter.take('b').ok, true);
  assert.equal(limiter.take('a').ok, false);
});

test('lets requests through again once the window has passed', () => {
  let now = 0;
  const limiter = createRateLimiter({
    limit: 2,
    windowMs: 1000,
    now: () => now,
  });

  limiter.take('a');
  now = 600;
  limiter.take('a');
  assert.equal(limiter.take('a').ok, false);

  //? The first hit is now older than the window; the second still counts.
  now = 1001;
  assert.equal(limiter.take('a').ok, true);
  assert.equal(limiter.take('a').ok, false);
});

test('reports how many whole seconds to wait', () => {
  let now = 0;
  const limiter = createRateLimiter({
    limit: 1,
    windowMs: 90_000,
    now: () => now,
  });

  limiter.take('a');
  now = 30_500;
  assert.equal(limiter.take('a').retryAfter, 60);
});

test('forgets keys whose hits have all expired, and never grows past its cap', () => {
  let now = 0;
  const limiter = createRateLimiter({
    limit: 1,
    windowMs: 1000,
    maxKeys: 3,
    now: () => now,
  });

  limiter.take('a');
  limiter.take('b');
  limiter.take('c');
  assert.equal(limiter.size(), 3);

  //? A fourth key while the first three are still inside the window: the
  //? oldest is dropped so memory stays bounded.
  limiter.take('d');
  assert.equal(limiter.size(), 3);

  now = 5000;
  limiter.take('e');
  assert.equal(limiter.size(), 1);
});
