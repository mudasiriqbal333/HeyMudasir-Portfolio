'use client';

import { useEffect, useRef, useState } from 'react';

import { wrapOffset } from '@/utils';

//? Seconds for one picture and its gap to pass a point. The speed follows the
//? picture's width, so the row feels the same on a phone and on a monitor.
const SECONDS_PER_PICTURE = 12;
//? A finger has no cursor to take out of the row, so after a swipe the row
//? starts again by itself.
const TOUCH_RESUME_MS = 1500;
//? A press only becomes a drag once it has moved this far.
const DRAG_THRESHOLD = 4;

/**
 * Motion for the row of screenshots on a case page.
 *
 * The row drifts from right to left on a loop while it is on screen. Resting
 * the cursor on it changes nothing. The first sideways scroll, or a drag,
 * with the cursor inside stops the drift and the row follows the hand
 * instead; it stays that way until the cursor leaves, then drifts on from
 * where it was left. Scrolling up and down is never touched, so the page
 * still scrolls with the cursor over the row. With a keyboard the row holds
 * still while it has focus and the arrow keys step through it. Under reduced
 * motion it does not drift at all, but can still be moved by hand.
 *
 * The track must hold `copies` sets of the `count` pictures; the hook measures
 * one set and draws the track at the offset wrapped into that length, so the
 * loop has no seam.
 *
 * @param {number} count pictures in one set
 */
export function useStripMotion(count) {
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const viewportRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const trackRef = useRef(null);
  const [copies, setCopies] = useState(2);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = {
      //? How far the row has moved left, in px; never wrapped, so stepping and
      //? dragging are plain sums
      x: 0,
      sequence: 0,
      step: 0,
      placed: false,
      /** @type {'auto' | 'user'} */
      mode: 'auto',
      keyboard: false,
      /** @type {number | null} */
      glide: null,
      /** @type {{id: number, startX: number, startOffset: number, moved: boolean} | null} */
      drag: null,
      frame: 0,
      last: 0,
      resume: 0,
    };

    const draw = () => {
      if (!state.sequence) return;
      track.style.transform = `translate3d(${-wrapOffset(state.x, state.sequence)}px, 0, 0)`;
    };

    const measure = () => {
      const items = track.children;
      if (items.length <= count) return;

      const sequence = items[count].offsetLeft - items[0].offsetLeft;
      if (!(sequence > 0)) return;

      const previous = state.sequence;
      state.sequence = sequence;
      state.step = sequence / count;
      setCopies(Math.max(2, Math.ceil(viewport.clientWidth / sequence) + 1));

      if (!state.placed) {
        //? Start with the first picture centred, where a lone screenshot sits
        state.x = -(viewport.clientWidth - items[0].offsetWidth) / 2;
        state.placed = true;
      } else if (previous) {
        //? A resize keeps the same picture in view
        state.x *= sequence / previous;
        if (state.glide !== null) state.glide *= sequence / previous;
      }
      draw();
    };

    const tick = time => {
      const elapsed = Math.min((time - state.last) / 1000, 0.05);
      state.last = time;

      if (state.glide !== null) {
        const left = state.glide - state.x;
        if (reduceMotion.matches || Math.abs(left) < 0.5) {
          state.x = state.glide;
          state.glide = null;
        } else {
          state.x += left * Math.min(1, elapsed * 9);
        }
        draw();
      } else if (state.mode === 'auto' && !reduceMotion.matches) {
        state.x += (state.step / SECONDS_PER_PICTURE) * elapsed;
        draw();
      }

      state.frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (state.frame) return;
      state.last = performance.now();
      state.frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
    };

    /** The hand has the row: the drift stops. */
    const takeOver = () => {
      clearTimeout(state.resume);
      state.mode = 'user';
    };

    /** The hand has let go: the drift carries on from here. */
    const release = () => {
      if (state.keyboard || state.drag) return;
      state.mode = 'auto';
    };

    /** @param {WheelEvent} event */
    const onWheel = event => {
      const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      //? Shift + wheel is the mouse's way to scroll sideways
      const delta = sideways ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (!delta) return;

      //? Ours: no page scroll, no swipe-back in the browser, and the page's
      //? smooth scrolling does not get to nudge the page with it
      event.preventDefault();
      event.stopPropagation();
      takeOver();
      state.glide = null;

      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? viewport.clientWidth
            : 1;
      state.x += delta * unit;
      draw();
    };

    /** @param {PointerEvent} event */
    const onPointerDown = event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      clearTimeout(state.resume);
      state.drag = {
        id: event.pointerId,
        startX: event.clientX,
        startOffset: state.x,
        moved: false,
      };
    };

    /** @param {PointerEvent} event */
    const onPointerMove = event => {
      const { drag } = state;
      if (!drag || drag.id !== event.pointerId) return;

      if (!drag.moved) {
        if (Math.abs(event.clientX - drag.startX) < DRAG_THRESHOLD) return;
        //? Anchor the drag here, so the row does not jump by the threshold
        //? or by what it drifted since the press
        drag.moved = true;
        drag.startX = event.clientX;
        drag.startOffset = state.x;
        takeOver();
        state.glide = null;
        viewport.setPointerCapture?.(event.pointerId);
        setDragging(true);
        return;
      }

      state.x = drag.startOffset - (event.clientX - drag.startX);
      draw();
    };

    /** @param {PointerEvent} event */
    const onPointerEnd = event => {
      const { drag } = state;
      if (!drag || drag.id !== event.pointerId) return;

      state.drag = null;
      setDragging(false);
      if (drag.moved && event.pointerType !== 'mouse') {
        state.resume = window.setTimeout(release, TOUCH_RESUME_MS);
      }
    };

    /** @param {PointerEvent} event */
    const onPointerLeave = event => {
      if (event.pointerType === 'mouse') release();
    };

    /** @param {KeyboardEvent} event */
    const onKeyDown = event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      takeOver();
      const from = state.glide ?? state.x;
      state.glide =
        from + (event.key === 'ArrowRight' ? state.step : -state.step);
    };

    const onFocus = () => {
      if (!viewport.matches(':focus-visible')) return;
      state.keyboard = true;
      takeOver();
    };

    const onBlur = () => {
      state.keyboard = false;
      release();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);

    //? Only runs while on screen; scrolled away, the hand has let go too
    const viewObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else {
        stop();
        release();
      }
    });
    viewObserver.observe(viewport);

    measure();
    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerEnd);
    viewport.addEventListener('pointercancel', onPointerEnd);
    viewport.addEventListener('pointerleave', onPointerLeave);
    viewport.addEventListener('keydown', onKeyDown);
    viewport.addEventListener('focus', onFocus);
    viewport.addEventListener('blur', onBlur);

    return () => {
      stop();
      clearTimeout(state.resume);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerEnd);
      viewport.removeEventListener('pointercancel', onPointerEnd);
      viewport.removeEventListener('pointerleave', onPointerLeave);
      viewport.removeEventListener('keydown', onKeyDown);
      viewport.removeEventListener('focus', onFocus);
      viewport.removeEventListener('blur', onBlur);
    };
  }, [count]);

  return { viewportRef, trackRef, copies, dragging };
}
