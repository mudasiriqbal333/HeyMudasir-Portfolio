'use client';

import { useRef } from 'react';

import { motion } from 'framer-motion';

import { useMagnetic } from '@/hooks';

import { LinkAnchor } from './index.styled';

/**
 * Text link with a subtle magnetic pull (reference strength 20/10) and an
 * underline that grows from the centre on hover.
 * @param {import('react').PropsWithChildren<{href: string, external?: boolean}>} props
 */
export function MagneticLink({ href, external = false, children }) {
  /** @type {import('react').MutableRefObject<HTMLAnchorElement>} */
  const elementRef = useRef(null);
  const {
    position: { x, y },
    textPosition,
    transition,
    handleMagneticMove,
    handleMagneticOut,
  } = useMagnetic(elementRef, 20);

  return (
    <LinkAnchor
      ref={elementRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      animate={{ x, y }}
      transition={transition}
      onPointerMove={handleMagneticMove}
      onPointerOut={handleMagneticOut}
    >
      <motion.span animate={textPosition} transition={transition}>
        {children}
      </motion.span>
    </LinkAnchor>
  );
}
