'use client';

import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import { FixedOverlay } from '@/components';
import { cn } from '@/utils';

import { OffcanvasBackdrop } from './back-drop';
import { OffcanvasFooter } from './footer';
import classes from './index.module.css';
import { OffcanvasLinks } from './links';
import { slideLeft } from './variants';

const MotionComponent = motion(FixedOverlay);

/**
 * The slide-in panel on its full-screen, see-through overlay.
 * @param {Object} props
 * @param {() => void} props.onClose Called by a click outside the panel.
 * @param {() => void} props.onNavigate Called when a page link is chosen.
 */
export function OffcanvasBody({ onClose, onNavigate }) {
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const panelRef = useRef(null);
  const [scrolls, setScrolls] = useState(false);

  //? Is the screen too short for the panel (a phone held sideways)? Only
  //? then is the panel marked data-lenis-prevent, which hands its wheel and
  //? touch back to the browser so it scrolls on its own. When everything
  //? fits, the stopped Lenis keeps swallowing them, so nothing leaks through
  //? to the page behind.
  useEffect(() => {
    const measure = () => {
      const { scrollHeight, clientHeight } = panelRef.current;
      setScrolls(scrollHeight > clientHeight);
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, []);

  /** @type {import('react').MouseEventHandler<HTMLDivElement>} */
  const handleClick = event => {
    if (!panelRef.current.contains(event.target)) onClose();
  };

  //? inset-0 repeats FixedOverlay's own `inset: 0` as four plain offsets (the
  //? build writes Tailwind's that way). Safari before 14.1 does not know
  //? `inset`, and the panel takes its height from this overlay.
  return (
    <MotionComponent
      id='offcanvas-menu'
      className={cn('inset-0', classes.overlay)}
      variants={slideLeft}
      initial='initial'
      animate='enter'
      exit='exit'
      onClick={handleClick}
    >
      <OffcanvasBackdrop />

      {/* h-full, not h-screen: the overlay is the visible screen, while 100vh
          on a phone also counts the part under the browser's bars */}
      <div
        ref={panelRef}
        className={cn(
          'absolute right-0 top-0 h-full bg-foreground text-background',
          classes.panel,
        )}
        data-lenis-prevent={scrolls ? '' : undefined}
      >
        <div
          className={cn(
            'flex min-h-full flex-col justify-between p-24',
            classes.inner,
          )}
        >
          <OffcanvasLinks onNavigate={onNavigate} />
          <OffcanvasFooter />
        </div>
      </div>
    </MotionComponent>
  );
}
