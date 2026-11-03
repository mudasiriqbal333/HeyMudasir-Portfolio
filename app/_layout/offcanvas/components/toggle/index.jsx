'use client';

import { useEffect, useRef, useState } from 'react';

import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotionConfig,
  useScroll,
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

import { MagneticButton } from '@/components';
import { cn } from '@/utils';

import classes from './index.module.css';

//? Pops in once the page has scrolled 30% of a viewport, with an overshoot.
const popIn = { duration: 0.4, ease: [0.34, 1.5, 0.64, 1] };
const popOut = { duration: 0.4, ease: [0.36, 0, 0.66, 0] };

/**
 * The round menu button, and the box that holds the open menu.
 *
 * The panel (`children`) is rendered inside the same wrapper as the button,
 * and while the menu is open that wrapper is the dialog. Screen readers hide
 * everything outside an `aria-modal` dialog, so this is what keeps the close
 * button reachable for them.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.handleToggle
 * @param {import('react').ReactNode} [props.children] The panel, while it is on screen.
 */
export function OffcanvasToggle({ isOpen, handleToggle, children }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const wrapperRef = useRef(null);

  const visible = scrolled || isOpen;
  //? The pop is on the button itself, not on the wrapper: a scaled wrapper
  //? would scale the panel inside it too. Nothing else may drive this value,
  //? hence the empty `whileHover` below (MagneticButton's own grows to 1.1).
  const scale = useMotionValue(visible ? 1 : 0);
  //? The MotionProvider's "reduce motion" setting only reaches animations
  //? written as motion props. The pop below is started by hand, so it asks.
  const reducedMotion = useReducedMotionConfig();

  useMotionValueEvent(scrollY, 'change', latest => {
    setScrolled(latest > window.innerHeight * 0.3);
  });

  //? With reduced motion the button appears and vanishes at once, as every
  //? other transform under the MotionProvider does.
  useEffect(() => {
    const target = visible ? 1 : 0;
    if (reducedMotion) {
      scale.set(target);
      return undefined;
    }

    const controls = animate(scale, target, visible ? popIn : popOut);

    return () => controls.stop();
  }, [scale, visible, reducedMotion]);

  //? A hidden button must not keep the keyboard focus (the page has scrolled
  //? back to its top, or a menu link has led to a new page).
  useEffect(() => {
    const button = wrapperRef.current?.querySelector(':scope > button');
    if (!visible && button && document.activeElement === button) button.blur();
  }, [visible]);

  //? Reference: the 1px ring fades in as the dark footer scrolls into view.
  useEffect(() => {
    const footer = document.querySelector('[data-footer-wrap]');
    const button = wrapperRef.current?.querySelector(':scope > button');
    if (!footer || !button) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        button,
        { boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0)' },
        {
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: '50% 100%',
            end: '100% 120%',
            scrub: 0,
          },
        },
      );
    });

    return () => context.revert();
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      className={classes.wrapper}
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen ? true : undefined}
      aria-label={isOpen ? 'Menu' : undefined}
    >
      {children}
      <MagneticButton
        id='offcanvas-toggle'
        variant='ghost'
        strength={50}
        whileHover={{}}
        style={{ scale }}
        className={cn(classes.button, isOpen && classes.buttonActive)}
        aria-expanded={isOpen}
        aria-controls='offcanvas-menu'
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-hidden={!visible}
        tabIndex={visible ? undefined : -1}
        onClick={handleToggle}
      >
        <span
          className={cn([classes.burger], [isOpen && classes.burgerActive])}
        />
      </MagneticButton>
    </div>
  );
}
