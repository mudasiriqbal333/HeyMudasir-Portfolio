'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * The timers of one chain of steps, such as a fade out and the swap under
 * it. `later` schedules a step; `clear` drops every step still pending, for
 * when a new click supersedes the chain (the reference lets its timeouts
 * stack, which can show the superseded choice for a moment); whatever is
 * still pending is cleared on unmount. A timer that has fired is forgotten,
 * so the set never grows with the clicks.
 */
export function usePendingTimers() {
  /** @type {import('react').MutableRefObject<Set<ReturnType<typeof setTimeout>>>} */
  const pending = useRef(new Set());

  useEffect(() => {
    const ids = pending.current;

    return () => ids.forEach(clearTimeout);
  }, []);

  return useMemo(
    () => ({
      /**
       * @param {() => void} callback
       * @param {number} delay milliseconds
       */
      later(callback, delay) {
        const id = setTimeout(() => {
          pending.current.delete(id);
          callback();
        }, delay);
        pending.current.add(id);
      },
      clear() {
        pending.current.forEach(clearTimeout);
        pending.current.clear();
      },
    }),
    [],
  );
}
