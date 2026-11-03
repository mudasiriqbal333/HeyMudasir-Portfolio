'use client';

import { useEffect } from 'react';

import gsap from 'gsap';

import { PRELOADER_DURATION } from '@/config/preloader.config';

//? The preloader unmounts after PRELOADER_DURATION and its curved exit takes
//? ~1s; the rows start rising half a second into that exit, as on the
//? reference, which measures its scroll triggers while they are still shifted.
export const REVEAL_DELAY = PRELOADER_DURATION / 1000 + 0.5;

/**
 * Reference "once-in" reveal: every `[data-once-in]` element inside `scope`
 * rises from 50vh (10vh on small screens) into place after the preloader.
 * Runs `setup` inside the same GSAP context right after the reveal is
 * scheduled, so scroll triggers created there measure the shifted layout.
 * @param {import('react').MutableRefObject<HTMLElement>} scope
 * @param {(() => void) | undefined} [setup]
 */
export function useOnceInReveal(scope, setup) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const isSmall = window.matchMedia('(max-width: 540px)').matches;
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-once-in]',
        { y: isSmall ? '10vh' : '50vh' },
        {
          y: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.05,
          delay: REVEAL_DELAY,
          clearProps: 'transform',
        },
      );
      setup?.();
    }, scope);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);
}
