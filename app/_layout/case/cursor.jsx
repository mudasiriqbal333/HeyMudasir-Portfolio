'use client';

import { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';

import { Cursor } from './index.styled';

const grow = { duration: 0.4, ease: [0.34, 1, 0.64, 1] };
const shrink = { duration: 0.4, ease: [0.36, 0, 0.66, 0] };

/**
 * Whole pixels, with a half rounded away from zero. This is how GSAP rounds
 * `left` and `top`, which placed the disc before, so it still lands on the
 * very same pixels.
 * @param {number} value
 */
const wholePixels = value => Math.trunc(value + (value < 0 ? -0.5 : 0.5));

/**
 * Blue "Next case" disc that trails the pointer while the next-case link is
 * hovered (reference .mouse-pos-list-btn.active-big): eased follow at 1/7 of
 * the remaining distance per frame, slightly larger while pressed.
 * @param {{active: boolean}} props
 */
export function NextCaseCursor({ active }) {
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const ref = useRef(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return undefined;

    const element = ref.current;
    const mouse = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    //? The whole pixels the disc was last put at; nothing before the first move
    /** @type {{left: number | null, top: number | null}} */
    const drawn = { left: null, top: null };
    let following = false;

    //? `left` and `top`, not a transform: framer-motion owns this element's
    //? transform (its offset and its scale).
    const tick = () => {
      const x = position.x + (mouse.x - position.x) / 7;
      const y = position.y + (mouse.y - position.y) / 7;

      //? Arrived: one more step would not move it at all, so the frame loop
      //? is dropped until the pointer moves again
      if (x === position.x && y === position.y) {
        gsap.ticker.remove(tick);
        following = false;

        return;
      }
      position.x = x;
      position.y = y;

      //? The style is only written when the disc reaches another pixel
      const left = wholePixels(x);
      const top = wholePixels(y);
      if (left !== drawn.left) {
        element.style.left = `${left}px`;
        drawn.left = left;
      }
      if (top !== drawn.top) {
        element.style.top = `${top}px`;
        drawn.top = top;
      }
    };
    const move = event => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (following) return;
      following = true;
      gsap.ticker.add(tick);
    };
    const down = event => event.pointerType === 'mouse' && setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      gsap.ticker.remove(tick);
    };
  }, []);

  const scale = active ? (pressed ? 1.2 : 1) : 0;

  return (
    <Cursor
      ref={ref}
      aria-hidden='true'
      style={{ x: '-50%', y: '-60%' }}
      initial={false}
      animate={{ scale }}
      transition={active ? grow : shrink}
    >
      <span>Next case</span>
    </Cursor>
  );
}
