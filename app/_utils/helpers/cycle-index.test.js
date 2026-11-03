import assert from 'node:assert/strict';
import { test } from 'node:test';

import { cycleIndex } from './cycle-index.js';

test('moves forward by one', () => {
  assert.equal(cycleIndex(0, 1, 3), 1);
});

test('wraps from the last item to the first', () => {
  assert.equal(cycleIndex(2, 1, 3), 0);
});

test('wraps from the first item to the last', () => {
  assert.equal(cycleIndex(0, -1, 3), 2);
});

test('stays at 0 for a single item', () => {
  assert.equal(cycleIndex(0, 1, 1), 0);
  assert.equal(cycleIndex(0, -1, 1), 0);
});

test('returns 0 for an empty list instead of NaN', () => {
  assert.equal(cycleIndex(0, 1, 0), 0);
});
