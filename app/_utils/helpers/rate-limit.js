/**
 * A small sliding-window limiter: at most `limit` hits per key inside
 * `windowMs`. It lives in the memory of one server process, so on a host that
 * runs several copies each copy counts on its own. That is enough to slow a
 * script down; it is not a wall (a firewall rule on the host is).
 *
 * @param {Object} options
 * @param {number} options.limit hits allowed per key inside the window
 * @param {number} options.windowMs length of the window
 * @param {number} [options.maxKeys] keys remembered at once, so memory stays bounded
 * @param {() => number} [options.now] clock, replaceable in tests
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5000,
  now = Date.now,
}) {
  /** @type {Map<string, number[]>} times of the hits still inside the window, per key */
  const hits = new Map();

  /** @param {number} time */
  const forgetExpired = time => {
    for (const [key, times] of hits) {
      const fresh = times.filter(hit => time - hit < windowMs);

      if (fresh.length) hits.set(key, fresh);
      else hits.delete(key);
    }
  };

  return {
    /**
     * Counts one hit for the key if it is still under the limit.
     * @param {string} key
     * @returns {{ok: boolean, retryAfter: number}} retryAfter in whole seconds
     */
    take(key) {
      const time = now();
      forgetExpired(time);

      const times = hits.get(key) ?? [];
      if (times.length >= limit) {
        const wait = Math.ceil((times[0] + windowMs - time) / 1000);

        return { ok: false, retryAfter: Math.max(1, wait) };
      }

      //? Re-insert so the Map keeps the most recently seen key last and the
      //? first key is always the one to drop when the cap is reached.
      hits.delete(key);
      hits.set(key, [...times, time]);
      while (hits.size > maxKeys) hits.delete(hits.keys().next().value);

      return { ok: true, retryAfter: 0 };
    },
    size: () => hits.size,
  };
}
