'use client';

import { forwardRef, useLayoutEffect, useRef, useState } from 'react';

import { gsap } from 'gsap';
import Image from 'next/image';

import { useMediaQuery } from '@/hooks';

import {
  Cursor,
  CursorLabel,
  Disc,
  LabelText,
  Preview,
  PreviewFrame,
  Slide,
  Strip,
} from './index.styled';

/**
 * Disc size relative to the row cursor (reference: .active, .active.pressed,
 * .active-big and .active-big.pressed).
 * @param {{ active: boolean; big?: boolean; pressed?: boolean }} state
 */
const discScale = ({ active, big, pressed }) => {
  if (!active) return 0;
  if (big) return pressed ? 2 : 1.66;

  return pressed ? 1.4 : 1;
};

/**
 * Where the strip stands, as a percentage of its own height, to show the
 * thumbnail at `index`. The strip is one thumbnail tall, so this is whole
 * thumbnails: a share of the full column (100/7 % with seven projects) is
 * never exact, and GSAP rounds it, which let a hairline of the next
 * thumbnail show under the frame.
 * @param {number} index
 */
const stripOffset = index => index * -100;

/**
 * Slides the strip to the thumbnail at `index`, as the reference does in
 * each row's mouseenter handler (initStickyCursorWithDelay:
 * gsap.to('.float-image-wrap', { y, duration: .6, ease: Power2.easeInOut })).
 * Call it from the row's own pointer handler: a tween started there begins
 * on the same tick as the reference's, where one started from a state
 * update would begin a frame late.
 * @param {HTMLElement | null} strip
 * @param {number} index
 */
export function slideStrip(strip, index) {
  if (!strip) return;
  gsap.to(strip, {
    yPercent: stripOffset(index),
    duration: 0.6,
    ease: 'power2.inOut',
    overwrite: 'auto',
  });
}

export const WorkPreview = forwardRef(
  /**
   * Preview image that trails the mouse over the rows. `ref` goes to the
   * fixed square that useFollowPointer moves; `stripRef` to the column of
   * thumbnails inside it, which `slideStrip` moves.
   * @param {{ items: typeof import('@/data').workOptions; active: boolean; index: number; stripRef: import('react').MutableRefObject<HTMLDivElement | null> }} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function WorkPreview({ items, active, index, stripRef }, ref) {
    const placed = useRef(false);
    //? The preview only opens from the rows, and the rows are hidden at
    //? 1024px and below (RowsSection in index.styled.js). Its box is in the
    //? page at every width, so it keeps following the pointer and opens and
    //? closes as it always did when the window is resized across that width.
    //? Only its thumbnails wait until the rows are shown for the first time,
    //? so a phone or tablet never downloads them; once fetched they stay, to
    //? be there while the box closes. The query is the exact opposite of
    //? that CSS breakpoint.
    const hasRows = useMediaQuery('not all and (max-width: 1024px)');
    const [withImages, setWithImages] = useState(false);
    if (hasRows && !withImages) setWithImages(true);

    //? Placed on the hovered thumbnail when it arrives; from then on the rows
    //? slide it with `slideStrip` as they are entered.
    useLayoutEffect(() => {
      const strip = stripRef.current;
      if (!strip || placed.current) return;
      placed.current = true;
      gsap.set(strip, { yPercent: stripOffset(index) });
    }, [index, stripRef]);

    return (
      <Preview ref={ref} data-preview aria-hidden='true'>
        <PreviewFrame data-active={active}>
          <Strip ref={stripRef}>
            {items.map(({ href, image, background }) => (
              <Slide key={href} style={{ backgroundColor: background }}>
                {/* The square crops a wide thumbnail by its height, so ask
                    for ~2.4x the 27.5vw frame to keep those sharp too */}
                {withImages ? (
                  <Image
                    src={image}
                    alt=''
                    fill
                    sizes='66vw'
                    loading='eager'
                    unoptimized={image.startsWith('data:')}
                  />
                ) : null}
              </Slide>
            ))}
          </Strip>
        </PreviewFrame>
      </Preview>
    );
  },
);

export const WorkCursor = forwardRef(
  /**
   * Blue disc that trails the mouse over the rows and tiles. `ref` goes to
   * the fixed box that useFollowPointer moves.
   * @param {{ active: boolean; big?: boolean; pressed?: boolean }} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function WorkCursor({ active, big, pressed }, ref) {
    return (
      <Cursor
        ref={ref}
        data-cursor
        data-active={active}
        data-pressed={pressed}
        aria-hidden='true'
      >
        <Disc
          data-active={active}
          style={{ '--scale': discScale({ active, big, pressed }) }}
        />
      </Cursor>
    );
  },
);

export const WorkCursorLabel = forwardRef(
  /**
   * The word centred on the disc; it trails the mouse a little more tightly.
   * @param {import('react').PropsWithChildren<{ active: boolean; big?: boolean; pressed?: boolean }>} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function WorkCursorLabel({ active, big, pressed, children }, ref) {
    return (
      <CursorLabel ref={ref} data-pressed={pressed} aria-hidden='true'>
        <LabelText
          data-active={active}
          style={{
            '--scale': discScale({ active, big, pressed }),
            '--text-scale': active ? 1 : 0,
          }}
        >
          {children}
        </LabelText>
      </CursorLabel>
    );
  },
);
