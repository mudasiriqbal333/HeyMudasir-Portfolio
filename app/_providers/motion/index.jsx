'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Honours the OS "reduce motion" setting for every framer-motion transition.
 * @param {import('react').PropsWithChildren<unknown>} props
 */
export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>;
}
