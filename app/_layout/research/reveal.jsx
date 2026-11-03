'use client';

import { useEffect, useState } from 'react';

import { animate, motion } from 'framer-motion';

//? The site's easing for things that settle: quick out, long soft landing.
export const SETTLE = [0.16, 1, 0.3, 1];

/**
 * Props that make a motion element rise into place the first time it comes
 * into view. Reduced motion is handled by the site's MotionConfig: the
 * content is simply there.
 * @param {number} [delay] seconds
 */
export const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: '1.25em' },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: 1, ease: SETTLE, delay },
});

/**
 * A block that rises into place the first time it comes into view.
 * @param {{delay?: number, children: import('react').ReactNode} & object} props
 */
export function Reveal({ delay = 0, children, ...props }) {
  return (
    <motion.div {...revealProps(delay)} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * A number that counts up from 0 once `run` turns true. The page is served
 * with the final number, so it reads right without JavaScript and is set
 * back to 0 only below the fold, before anyone can see it.
 * @param {{value: number, decimals?: number, run: boolean}} props
 */
export function CountUp({ value, decimals = 0, run }) {
  const [shown, setShown] = useState(value);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    setReduce(reduced);
    if (!reduced) setShown(0);
  }, []);

  useEffect(() => {
    if (!run || reduce) return undefined;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: SETTLE,
      onUpdate: setShown,
    });

    return () => controls.stop();
  }, [run, reduce, value]);

  return shown.toFixed(decimals);
}
