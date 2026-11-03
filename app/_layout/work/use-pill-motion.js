'use client';

import { useCallback, useState } from 'react';

/**
 * Fill states for a group of reference pills (.btn-normal) with one pressed
 * member, such as the filters or the view buttons. Spread `bind(key)` on
 * each pill: `data-hover` says which way its fill is moving for the mouse
 * (in from below, out through the top, as the reference's GSAP hover does),
 * and `data-released` marks the pill that has just lost the pressed state,
 * which keeps its dark fill while that slides away and through the mouse's
 * next visit, turning blue only once the mouse has left again (reference
 * .not-active, which is removed on mouseleave). Only a mouse moves the
 * fill; a tap must not leave it half way.
 *
 * @param {string} pressed key of the pressed pill
 */
export function usePillMotion(pressed) {
  const [hover, setHover] = useState({});
  const [released, setReleased] = useState(null);
  const [previous, setPrevious] = useState(pressed);

  //? Worked out during the render that first sees the new pressed key (not
  //? in an effect after it), so the pill that lost it drops aria-pressed and
  //? gains data-released in the same commit: its fill then leaves with the
  //? released transition from its first frame.
  if (previous !== pressed) {
    setPrevious(pressed);
    setReleased(previous);
  }

  return useCallback(
    /** @param {string} key */
    key => ({
      'data-hover': hover[key],
      'data-released': released === key || undefined,
      /** @param {import('react').PointerEvent} event */
      onPointerEnter: event => {
        if (event.pointerType !== 'mouse') return;
        setHover(current => ({ ...current, [key]: 'in' }));
      },
      /** @param {import('react').PointerEvent} event */
      onPointerLeave: event => {
        if (event.pointerType !== 'mouse') return;
        setHover(current => ({ ...current, [key]: 'out' }));
        setReleased(current => (current === key ? null : current));
      },
    }),
    [hover, released],
  );
}
