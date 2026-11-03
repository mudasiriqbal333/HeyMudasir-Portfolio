'use client';

import { useEffect } from 'react';

import Lenis from '@studio-freight/lenis';

/** @type {import('@studio-freight/lenis').default | null} */
let instance = null;

/** The running Lenis instance, or null when smooth scrolling is not mounted. */
export const getLenis = () => instance;

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis();
    instance = lenis;

    let frame = 0;
    const raf = time => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);
}
