'use client';

import { useEffect, useRef } from 'react';

import { useScroll, useTransform } from 'framer-motion';

/**
 * Locomotive-style parallax: the element moves by `speed` times the distance
 * between its centre and the viewport centre, in px (reference
 * data-scroll-speed="-3" = 0.3). Reads sizes from refs so the transformer
 * never goes stale.
 * @param {import('react').MutableRefObject<HTMLElement>} ref element that travels through the viewport
 * @param {number} speed fraction; positive drifts down while scrolling down
 */
export function useSpeedParallax(ref, speed) {
  const travel = useRef(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const update = () => {
      travel.current = window.innerHeight + (ref.current?.offsetHeight ?? 0);
    };
    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, [ref]);

  return useTransform(scrollYProgress, p => (p - 0.5) * travel.current * speed);
}
