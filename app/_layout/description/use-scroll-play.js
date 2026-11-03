'use client';

import { useEffect, useState } from 'react';

/**
 * Reference ScrollTrigger with toggleActions 'play none none reset': turns
 * true once the element's top rises past the viewport bottom (moved down by
 * `bottomMargin`), stays true while it scrolls on and out at the top, and
 * turns false only when it drops back below that line, so it replays on the
 * next pass down.
 * @param {import('react').MutableRefObject<HTMLElement>} ref
 * @param {string} [bottomMargin] px or % of the viewport height, e.g. '10%'
 *   for the reference start "0% 110%"
 */
export function useScrollPlay(ref, bottomMargin = '0px') {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPlayed(true);
        //? Out of view with its top still below the viewport top: it dropped
        //? back below the line (scrolled up), not off the top
        else if (entry.boundingClientRect.top > 0) setPlayed(false);
      },
      { rootMargin: `0px 0px ${bottomMargin} 0px` },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, bottomMargin]);

  return played;
}
