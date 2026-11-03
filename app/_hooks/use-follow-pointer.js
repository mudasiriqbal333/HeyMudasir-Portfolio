'use client';

import { useCallback, useEffect, useState } from 'react';

import { gsap } from 'gsap';

/**
 * Share of the remaining distance each follower covers per 60 fps frame
 * (reference: image 1/12, disc 1/7, label 1/6), so the preview image trails
 * furthest behind the mouse and the "View" label leads its disc slightly.
 */
const EASE = { modal: 1 / 12, cursor: 1 / 7, label: 1 / 6 };

const FRAME_MS = 1000 / 60;

/**
 * Hover preview that trails the mouse: a preview image plus a "View" disc
 * and its label. Each follower eases toward the pointer on gsap's ticker and
 * the refs are read on every frame, so the elements may mount, unmount or
 * remount at any time. Only a mouse opens the preview; touch and pen do not.
 *
 * Spread `bind(index)` on each hover target (`bind(index, true)` for the
 * larger disc without an image, as on the reference's tiles).
 *
 * @param {Object} params
 * @param {import('react').MutableRefObject<HTMLElement | null>} params.modal
 * @param {import('react').MutableRefObject<HTMLElement | null>} params.cursor
 * @param {import('react').MutableRefObject<HTMLElement | null>} params.label
 */
export function useFollowPointer({ modal, cursor, label }) {
  const [state, setState] = useState({ active: false, big: false, index: 0 });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0, seen: false };
    const followers = [
      { ref: modal, ease: EASE.modal },
      { ref: cursor, ease: EASE.cursor },
      { ref: label, ease: EASE.label },
    ].map(follower => ({
      ...follower,
      x: 0,
      y: 0,
      /** @type {HTMLElement | null} */
      element: null,
      transform: '',
    }));

    /** @param {PointerEvent} event */
    const move = event => {
      if (event.pointerType !== 'mouse') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (pointer.seen) return;
      //? Start under the mouse rather than flying in from the corner
      pointer.seen = true;
      followers.forEach(follower => {
        follower.x = pointer.x;
        follower.y = pointer.y;
      });
    };
    /** @param {PointerEvent} event */
    const down = event => event.pointerType === 'mouse' && setPressed(true);
    const up = () => setPressed(false);

    /**
     * @param {number} _time seconds since gsap started
     * @param {number} deltaTime milliseconds since the previous tick
     */
    const tick = (_time, deltaTime) => {
      const frames = deltaTime / FRAME_MS;
      followers.forEach(follower => {
        const element = follower.ref.current;
        if (!element) return;

        const step = reducedMotion.matches
          ? 1
          : 1 - (1 - follower.ease) ** frames;
        follower.x += (pointer.x - follower.x) * step;
        follower.y += (pointer.y - follower.y) * step;

        const transform = `translate3d(${follower.x.toFixed(2)}px, ${follower.y.toFixed(2)}px, 0)`;
        //? Skip the style write once settled, unless the element is new
        if (element === follower.element && transform === follower.transform)
          return;
        element.style.transform = transform;
        follower.element = element;
        follower.transform = transform;
      });
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      gsap.ticker.remove(tick);
    };
  }, [modal, cursor, label]);

  /**
   * Pointer handlers for one hover target.
   * @param {number} index preview image to show
   * @param {boolean} [big] larger disc and no preview image
   */
  const bind = useCallback(
    (index, big = false) => ({
      /** @param {import('react').PointerEvent} event */
      onPointerEnter: event => {
        if (event.pointerType !== 'mouse') return;
        setState({ active: true, big, index });
      },
      /** @param {import('react').PointerEvent} event */
      onPointerLeave: event => {
        if (event.pointerType !== 'mouse') return;
        setState(current => ({ ...current, active: false }));
      },
    }),
    [],
  );

  return { ...state, pressed, bind };
}
