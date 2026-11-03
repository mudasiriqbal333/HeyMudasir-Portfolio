import assert from 'node:assert/strict';
import { test } from 'node:test';

import { cubicBezier } from './cubic-bezier.js';

//? The reference scrolls the page with Locomotive's [0.7, 0, 0.35, 1].
const reference = cubicBezier(0.7, 0, 0.35, 1);

/**
 * The same curve found the slow way: walk t in tiny steps until x passes
 * the progress asked for, and read y there.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function bruteForce(x1, y1, x2, y2) {
  const point = (t, p1, p2) =>
    3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3;

  return progress => {
    for (let t = 0; t <= 1; t += 1e-5) {
      if (point(t, x1, x2) >= progress) return point(t, y1, y2);
    }

    return 1;
  };
}

test('starts at 0 and ends at 1, and clamps outside that range', () => {
  assert.equal(reference(0), 0);
  assert.equal(reference(1), 1);
  assert.equal(reference(-0.5), 0);
  assert.equal(reference(1.5), 1);
});

test('a bezier on the diagonal is linear', () => {
  const linear = cubicBezier(0.25, 0.25, 0.75, 0.75);
  assert.equal(linear(0.3), 0.3);
  assert.equal(linear(0.81), 0.81);
});

test('a symmetric ease-in-out passes through the middle', () => {
  const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
  assert.ok(Math.abs(easeInOut(0.5) - 0.5) < 1e-6);
});

test("matches the curve found the slow way, within a pixel's worth", () => {
  const slow = bruteForce(0.7, 0, 0.35, 1);
  for (let progress = 0.05; progress < 1; progress += 0.05) {
    assert.ok(
      Math.abs(reference(progress) - slow(progress)) < 1e-3,
      `at ${progress.toFixed(2)}`,
    );
  }
});

test('eases in slowly and out quickly, as the reference does', () => {
  assert.ok(reference(0.2) < 0.2);
  assert.ok(reference(0.8) > 0.8);
});

test('never runs backwards', () => {
  let previous = 0;
  for (let step = 1; step <= 100; step += 1) {
    const value = reference(step / 100);
    assert.ok(value >= previous, `at ${step / 100}`);
    previous = value;
  }
});

test('copes with a curve that is flat at the start', () => {
  const flat = cubicBezier(0, 0, 1, 1);
  assert.ok(Math.abs(flat(0.5) - 0.5) < 1e-6);
  assert.ok(flat(0.1) > 0 && flat(0.1) < 1);
});
