/**
 * A CSS `cubic-bezier(x1, y1, x2, y2)` timing function as a plain function
 * of progress 0..1, for scripted motion (such as scrolling the page) that
 * should ease the way the reference's Locomotive Scroll does.
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {(progress: number) => number}
 */
export function cubicBezier(x1, y1, x2, y2) {
  //? The cubic through 0, p1, p2 and 1 on one axis, as a polynomial in t.
  const axis = (p1, p2) => {
    const c = 3 * p1;
    const b = 3 * (p2 - p1) - c;
    const a = 1 - c - b;

    return {
      at: t => ((a * t + b) * t + c) * t,
      slope: t => (3 * a * t + 2 * b) * t + c,
    };
  };
  const x = axis(x1, x2);
  const y = axis(y1, y2);

  /** The curve parameter at which x reaches `target`. */
  const solve = target => {
    let t = target;

    //? Newton–Raphson first; it converges in a few steps nearly everywhere
    for (let step = 0; step < 8; step += 1) {
      const error = x.at(t) - target;
      if (Math.abs(error) < 1e-7) return t;
      const slope = x.slope(t);
      if (Math.abs(slope) < 1e-6) break;
      t = Math.min(1, Math.max(0, t - error / slope));
    }

    //? Bisection for the flat stretches Newton cannot handle
    let low = 0;
    let high = 1;
    t = target;
    while (high - low > 1e-7) {
      if (x.at(t) < target) low = t;
      else high = t;
      t = (low + high) / 2;
    }

    return t;
  };

  return progress => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    if (x1 === y1 && x2 === y2) return progress;

    return y.at(solve(progress));
  };
}
