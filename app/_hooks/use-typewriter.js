'use client';

import { useEffect, useRef } from 'react';

import { animate } from 'framer-motion';

import { typewriterDelay, typewriterDuration } from '@/utils';

import { REVEAL_DELAY } from './use-once-in-reveal';

//? The page reveal starts after REVEAL_DELAY, takes a second and staggers the
//? rows behind that, so the block waits until the layout has settled before it
//? measures anything or touches a property.
const REVEAL_GATE = REVEAL_DELAY + 1.25;

//? If the block is nearer the top of the screen than this when the gate lifts,
//? the visitor can already read it, so there is nothing to type in.
const BELOW_FOLD = 0.9;

/**
 * Drives the case description's reveal: `--typed` counts the words of the lead
 * that are in, and `--progress` runs 0 -> 1 across the whole block, which is
 * what the lines underneath come in on.
 *
 * Nothing is added to or removed from the DOM and no layout property is
 * touched: every word is there from the first render and the CSS only wipes
 * and fades, so the block holds its final size throughout and a screen reader
 * always has the whole text.
 *
 * The run starts the first time the block is scrolled into view, holds while
 * the block is off screen and picks up where it left off, and happens once.
 * A block already on screen when the page reveal finishes is left at rest --
 * typing text somebody is already reading would only take it away from them.
 * With reduced motion the hook does nothing at all and the CSS shows the lot.
 *
 * @param {number} count how many words of lead there are to type
 * @returns {import('react').MutableRefObject<HTMLElement>} ref for the block
 */
export function useTypewriter(count) {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const mountedAt = performance.now();
    /** @type {import('framer-motion').AnimationPlaybackControls | undefined} */
    let controls;
    /** @type {IntersectionObserver | undefined} */
    let observer;
    let done = false;

    const write = progress => {
      element.style.setProperty('--progress', `${progress}`);
      element.style.setProperty('--typed', `${progress * count}`);
    };

    const arm = () => {
      if (
        element.getBoundingClientRect().top <
        window.innerHeight * BELOW_FOLD
      ) {
        return;
      }

      write(0);

      observer = new IntersectionObserver(
        entries => {
          const visible = entries[entries.length - 1].isIntersecting;

          if (done) return;

          if (!controls) {
            if (!visible) return;

            controls = animate(0, 1, {
              duration: typewriterDuration(count),
              ease: 'linear',
              onUpdate: write,
              onComplete: () => {
                done = true;
                observer?.disconnect();
              },
            });

            return;
          }

          //? Scrolled past mid-run: hold rather than spend the animation on an
          //? empty room, and carry on from there when it comes back.
          if (visible) controls.play();
          else controls.pause();
        },
        { threshold: 0.15 },
      );

      observer.observe(element);
    };

    const gate = window.setTimeout(
      arm,
      typewriterDelay((performance.now() - mountedAt) / 1000, REVEAL_GATE) *
        1000,
    );

    return () => {
      window.clearTimeout(gate);
      observer?.disconnect();
      controls?.stop();
      element.style.removeProperty('--typed');
      element.style.removeProperty('--progress');
    };
  }, [count]);

  return ref;
}
