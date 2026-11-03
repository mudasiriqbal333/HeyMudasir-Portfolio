'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { workFilters, workOptions } from '@/data';
import {
  getLenis,
  useFollowPointer,
  useMediaQuery,
  useOnceInReveal,
} from '@/hooks';
import {
  countWork,
  cubicBezier,
  filterWork,
  parseViewCookie,
  viewCookie,
} from '@/utils';

import { WorkArchive } from './archive';
import { WorkFilters } from './filters';
import { WorkHeader } from './header';
import { ListWrap, Page } from './index.styled';
import {
  slideStrip,
  WorkCursor,
  WorkCursorLabel,
  WorkPreview,
} from './preview';
import { WorkRows } from './rows';
import { WorkTiles } from './tiles';
import { usePendingTimers } from './use-pending-timers';

//? Reference timing (index-new.js initVisualFilter): the lists fade out,
//? change under cover at 300ms while the page scrolls back to the top over
//? 700ms, and the fade-in state is dropped at 700ms so they rise into place.
const SWAP_AT = 300;
const SETTLE_AT = 700;
const SCROLL_SECONDS = 0.7;
const scrollEase = cubicBezier(0.7, 0, 0.35, 1);

const counts = countWork(
  workOptions,
  workFilters.map(({ key }) => key),
);

/**
 * Work page: the title, the filters and view buttons, the rows and the
 * tiles, the archive pill, and the hover preview that follows the mouse.
 */
export function Work() {
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const pageRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const previewRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const cursorRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const labelRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const stripRef = useRef(null);
  //? Whether this page has Lenis stopped while a filter's items fade out,
  //? before the scroll to the top takes over the hold.
  const held = useRef(false);

  //? `filter` is the pressed pill and `view` the pressed view button;
  //? `shown` and `shownView` are what the lists show, which follow them once
  //? the old items have faded out.
  const [filter, setFilter] = useState('all');
  const [shown, setShown] = useState('all');
  const [view, setView] = useState('rows');
  const [shownView, setShownView] = useState('rows');
  const [itemFade, setItemFade] = useState(null);
  const [viewFade, setViewFade] = useState(null);
  const [mounted, setMounted] = useState(false);

  //? Each chain of steps keeps its own timers, so a new filter click drops
  //? only the pending filter swap, and a view click only the pending view
  //? swap.
  const filterTimers = usePendingTimers();
  const viewTimers = usePendingTimers();

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { active, big, index, pressed, bind } = useFollowPointer({
    modal: previewRef,
    cursor: cursorRef,
    label: labelRef,
  });

  useOnceInReveal(pageRef);

  //? The followers are fixed to the viewport, so they live in <body>, out of
  //? reach of any transformed or clipped ancestor. The remembered view is
  //? read here, after hydration, so the server and the client agree on the
  //? first render. Leaving the page lets go of any hold on Lenis.
  useEffect(() => {
    setMounted(true);
    const saved = parseViewCookie(document.cookie);
    if (saved) {
      setView(saved);
      setShownView(saved);
    }

    return () => {
      if (held.current) getLenis()?.start();
    };
  }, []);

  //? Reference: scroll.stop() at the click, scroll.scrollTo('top', {
  //? duration: 700, easing: [0.7, 0, 0.35, 1] }) and scroll.start() once it
  //? has landed, so the wheel cannot take the page elsewhere while the lists
  //? change. Lenis's `lock` holds the wheel off for the scroll itself; `hold`
  //? covers the wait before it, unless something else (the menu) already has
  //? Lenis stopped. With reduced motion the page jumps there instead.
  const hold = useCallback(() => {
    const lenis = getLenis();
    if (!lenis || lenis.isStopped) return;
    lenis.stop();
    held.current = true;
  }, []);

  const scrollToTop = useCallback(() => {
    const lenis = getLenis();

    if (!lenis) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

      return;
    }

    if (held.current) {
      held.current = false;
      lenis.start();
    }

    if (reduceMotion) {
      lenis.scrollTo(0, { immediate: true });

      return;
    }

    lenis.scrollTo(0, {
      duration: SCROLL_SECONDS,
      easing: scrollEase,
      lock: true,
    });
  }, [reduceMotion]);

  const changeFilter = useCallback(
    key => {
      if (key === filter) return;
      setFilter(key);
      filterTimers.clear();

      if (reduceMotion) {
        setShown(key);
        scrollToTop();

        return;
      }

      hold();
      setItemFade('out');
      filterTimers.later(() => {
        setShown(key);
        setItemFade('in');
        scrollToTop();
      }, SWAP_AT);
      filterTimers.later(() => setItemFade(null), SETTLE_AT);
    },
    [filter, reduceMotion, filterTimers, hold, scrollToTop],
  );

  //? The button flips at the click (reference: .active moves at once); only
  //? the lists wait for the fade.
  const changeView = useCallback(
    next => {
      if (next === view) return;
      document.cookie = viewCookie(next);
      setView(next);
      viewTimers.clear();

      if (reduceMotion) {
        setShownView(next);
        scrollToTop();

        return;
      }

      setViewFade('out');
      scrollToTop();
      viewTimers.later(() => {
        setShownView(next);
        setViewFade('in');
      }, SWAP_AT);
      viewTimers.later(() => setViewFade(null), SETTLE_AT);
    },
    [view, reduceMotion, viewTimers, scrollToTop],
  );

  const visible = useMemo(
    () => new Set(filterWork(workOptions, shown).map(({ href }) => href)),
    [shown],
  );

  //? The preview slides to the entered row's thumbnail from the row's own
  //? pointer handler, as on the reference; there is no strip to slide while
  //? motion is to be reduced.
  const enterRow = useCallback(
    index => slideStrip(stripRef.current, index),
    [],
  );

  return (
    <Page ref={pageRef}>
      <WorkHeader />
      <WorkFilters
        filter={filter}
        counts={counts}
        onFilter={changeFilter}
        view={view}
        onView={changeView}
      />

      <ListWrap data-once-in>
        <WorkRows
          items={workOptions}
          visible={visible}
          open={shownView === 'rows'}
          viewFade={viewFade}
          bind={bind}
          onEnter={enterRow}
        />
        <WorkTiles
          items={workOptions}
          visible={visible}
          fade={itemFade}
          open={shownView === 'columns'}
          viewFade={viewFade}
          bind={bind}
        />
      </ListWrap>

      <WorkArchive />

      {/* No preview chasing the mouse when motion is to be reduced */}
      {mounted && !reduceMotion
        ? createPortal(
            <>
              <WorkPreview
                ref={previewRef}
                stripRef={stripRef}
                items={workOptions}
                active={active && !big}
                index={index}
              />
              <WorkCursor
                ref={cursorRef}
                active={active}
                big={big}
                pressed={pressed}
              />
              <WorkCursorLabel
                ref={labelRef}
                active={active}
                big={big}
                pressed={pressed}
              >
                View
              </WorkCursorLabel>
            </>,
            document.body,
          )
        : null}
    </Page>
  );
}
