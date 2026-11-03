'use client';

import { useCallback, useEffect, useRef } from 'react';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { getLenis } from '@/hooks';
import { useOffcanvas } from '@/providers';

import { OffcanvasBody, OffcanvasToggle } from './components';

//? Keys that scroll a page
const SCROLL_KEYS = new Set([
  ' ',
  'ArrowDown',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
]);

//? Where Tab stops while the menu is open, in order: the page links, the
//? socials, then the round close button.
const menuStops = () =>
  Array.from(
    document.querySelectorAll('#offcanvas-menu a[href], #offcanvas-toggle'),
  );

export function Offcanvas() {
  const { isOpen, close, toggle } = useOffcanvas();
  const pathname = usePathname();
  //? True once a page link in the menu was chosen
  const linkChosen = useRef(false);

  useEffect(() => {
    close();
  }, [pathname, close]);

  const handleNavigate = useCallback(() => {
    linkChosen.current = true;
    close();
  }, [close]);

  //? While the menu is open: the page behind is held still, Escape closes,
  //? and Tab stays inside the menu. Closing puts everything back.
  useEffect(() => {
    if (!isOpen) return undefined;

    const opener = document.activeElement;
    linkChosen.current = false;

    //? Reference: scroll.stop() on open, scroll.start() on close. A stopped
    //? Lenis swallows the wheel and touch; the scrollbar stays, so nothing
    //? shifts. Lenis is only started again if it was this menu that stopped it.
    const lenis = getLenis();
    const held = Boolean(lenis) && !lenis.isStopped;
    lenis?.stop();

    /** @param {KeyboardEvent} event */
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        close();
        return;
      }

      //? Option+Tab is held too: it is how Safari reaches links. Ctrl+Tab
      //? and Cmd+Tab belong to the browser and the system.
      if (event.key === 'Tab' && !event.ctrlKey && !event.metaKey) {
        const stops = menuStops();
        if (stops.length === 0) return;

        const last = stops.length - 1;
        const index = stops.indexOf(document.activeElement);
        const next = event.shiftKey
          ? index <= 0
            ? last
            : index - 1
          : index === last
            ? 0
            : index + 1;
        event.preventDefault();
        stops[next].focus();
        return;
      }

      //? Lenis does not see the keyboard. Scroll keys are let through only
      //? from inside a panel that scrolls on its own (data-lenis-prevent);
      //? Space on a button is a press, not a scroll.
      if (!SCROLL_KEYS.has(event.key) || !(event.target instanceof Element)) {
        return;
      }
      const pressesButton =
        event.key === ' ' && event.target instanceof HTMLButtonElement;
      if (!pressesButton && !event.target.closest('[data-lenis-prevent]')) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const frame = requestAnimationFrame(() => {
      //? The links are still sliding in; do not scroll the panel after them
      menuStops()[0]?.focus({ preventScroll: true });
    });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(frame);
      if (held) getLenis()?.start();

      //? Focus goes back to the button that opened the menu, unless a link
      //? was chosen: then the page changes (or jumps to its top) and that
      //? button is gone or hidden.
      if (
        !linkChosen.current &&
        opener instanceof HTMLElement &&
        opener.isConnected
      ) {
        opener.focus();
      }
    };
  }, [isOpen, close]);

  return (
    <OffcanvasToggle isOpen={isOpen} handleToggle={toggle}>
      <AnimatePresence mode='wait'>
        {isOpen ? (
          <OffcanvasBody onClose={close} onNavigate={handleNavigate} />
        ) : null}
      </AnimatePresence>
    </OffcanvasToggle>
  );
}
