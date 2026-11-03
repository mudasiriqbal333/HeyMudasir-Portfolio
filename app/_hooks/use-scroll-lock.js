'use client';

import { useEffect } from 'react';

import { getLenis } from './use-lenis';

/**
 * Freezes the page while `locked` is true, like the reference's `scroll.stop()`
 * during the loader and the open menu. Stops Lenis and pins the document, so
 * the wheel, touch and keyboard all stay put; the scroll position is kept.
 * @param {boolean} locked
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    getLenis()?.stop();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previousPadding = document.body.style.paddingRight;

    root.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      getLenis()?.start();
    };
  }, [locked]);
}
