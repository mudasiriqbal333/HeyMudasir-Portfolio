'use client';

import { useRef } from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { useMagnetic } from '@/hooks';
import { cn } from '@/utils';

import { MagneticItem } from './index.styled';
import { magneticVariance } from './index.variance';

const MotionLink = motion(Link);

/**
 * Magnetic control. Renders a <button>, or a link when `href` is given
 * (next/link for internal routes, <a> otherwise).
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' | 'destructive' | 'secondary' | 'ghost' | 'outline'; size?: 'default' | 'md' | 'lg' | 'xl'; nowrap?: boolean; strength?: number; textStrength?: number; href?: string }} props
 */
export function MagneticButton({
  children,
  className,
  variant,
  size,
  nowrap = false,
  strength = 25,
  textStrength,
  href,
  ...props
}) {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const elementRef = useRef(null);
  const {
    position: { x, y },
    textPosition,
    transition,
    handleMagneticMove,
    handleMagneticOut,
  } = useMagnetic(elementRef, strength, textStrength);

  const Component = href
    ? href.startsWith('/')
      ? MotionLink
      : motion.a
    : motion.button;

  return (
    <Component
      ref={elementRef}
      href={href}
      className={cn(magneticVariance({ variant, size, className }))}
      animate={{ x, y }}
      transition={transition}
      onPointerMove={handleMagneticMove}
      onPointerOut={handleMagneticOut}
      whileHover={{ scale: 1.1 }}
      {...props}
    >
      <MagneticItem
        $nowrap={nowrap}
        animate={textPosition}
        transition={transition}
      >
        {children}
      </MagneticItem>
    </Component>
  );
}
