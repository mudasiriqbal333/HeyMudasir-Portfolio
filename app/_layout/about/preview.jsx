'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { gsap } from 'gsap';
import Image from 'next/image';
import { createPortal } from 'react-dom';

import { useFollowPointer, useMediaQuery } from '@/hooks';

import { PreviewBox, PreviewSlide } from './index.styled';
import { PreviewFrame, Strip } from '../work/index.styled';
import { WorkCursor, WorkCursorLabel } from '../work/preview';

/** Where the strip stands, in whole slides, to show slide `index`. */
const offset = index => index * -100;

/**
 * The column of pictures inside the box that trails the mouse, one per row,
 * slid to the hovered row's picture.
 * @typedef {{ key: string; image?: string; background?: string; kind: 'logo' | 'certificate' }} Slide
 */
const RowPreview = forwardRef(
  /**
   * @param {{ slides: Slide[]; shape: 'square' | 'wide'; active: boolean; index: number; stripRef: import('react').MutableRefObject<HTMLDivElement | null> }} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function RowPreview({ slides, shape, active, index, stripRef }, ref) {
    const placed = useRef(false);
    //? Only a mouse opens the preview, so a phone never fetches its pictures
    const canHover = useMediaQuery('(hover: hover) and (min-width: 541px)');
    const [withImages, setWithImages] = useState(false);
    if (canHover && !withImages) setWithImages(true);

    useLayoutEffect(() => {
      const strip = stripRef.current;
      if (!strip || placed.current) return;
      placed.current = true;
      gsap.set(strip, { yPercent: offset(index) });
    }, [index, stripRef]);

    return (
      <PreviewBox ref={ref} data-shape={shape} aria-hidden='true'>
        <PreviewFrame data-active={active}>
          <Strip ref={stripRef}>
            {slides.map(({ key, image, background, kind }) => (
              <PreviewSlide
                key={key}
                data-kind={kind}
                style={background ? { background } : undefined}
              >
                {withImages && image ? (
                  <Image
                    src={image}
                    alt=''
                    fill
                    sizes='28vw'
                    unoptimized={image.endsWith('.svg')}
                  />
                ) : null}
              </PreviewSlide>
            ))}
          </Strip>
        </PreviewFrame>
      </PreviewBox>
    );
  },
);

/**
 * The Work list's hover preview for any list of rows: a picture that trails
 * the mouse and slides to the hovered row's picture, under the blue disc and
 * its word. A row without a picture gets the bigger disc alone, as the
 * reference's tiles do. Nothing follows the mouse when motion is reduced.
 * @param {Slide[]} slides one per row, in row order; keep the array stable
 * @param {'square' | 'wide'} shape
 */
export function useRowPreview(slides, shape) {
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const previewRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const cursorRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const labelRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const stripRef = useRef(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [mounted, setMounted] = useState(false);
  const { active, big, index, pressed, bind } = useFollowPointer({
    modal: previewRef,
    cursor: cursorRef,
    label: labelRef,
  });

  //? The followers are fixed to the viewport, so they live in <body>
  useEffect(() => setMounted(true), []);

  /**
   * Handlers for row `row`. The strip slides from the row's own handler, as
   * on the Work list, so the tween starts on the same tick as the hover.
   * @param {number} row
   */
  const rowProps = useCallback(
    row => {
      const pointer = bind(row, !slides[row]?.image);

      return {
        ...pointer,
        /** @param {import('react').PointerEvent} event */
        onPointerEnter: event => {
          pointer.onPointerEnter(event);
          if (event.pointerType !== 'mouse' || !stripRef.current) return;
          gsap.to(stripRef.current, {
            yPercent: offset(row),
            duration: 0.6,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
        },
      };
    },
    [bind, slides],
  );

  /** @param {string} label the word on the disc */
  const followers = label =>
    mounted && !reduceMotion
      ? createPortal(
          <>
            <RowPreview
              ref={previewRef}
              stripRef={stripRef}
              slides={slides}
              shape={shape}
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
              {label}
            </WorkCursorLabel>
          </>,
          document.body,
        )
      : null;

  return { index, rowProps, followers };
}
