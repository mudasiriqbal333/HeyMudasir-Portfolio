'use client';

import { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { caseOptions, thumbnailOptions } from '@/data';
import { useFollowPointer } from '@/hooks';

import {
  ThumbnailAction,
  ThumbnailCursorCircle,
  ThumbnailCursorLabel,
  ThumbnailList,
  ThumbnailModal,
  ThumbnailTiles,
} from './components';

//? As on the reference: the four most recent cases as rows, the first two as
//? tiles at 1024px and below; "More projects" leads to all of them.
const rows = thumbnailOptions.slice(0, 4);
const tiles = thumbnailOptions.slice(0, 2);

/** Home page "Recent projects": rows, tiles, "More projects" and the hover preview. */
export function Thumbnail() {
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const modal = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const cursor = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const label = useRef(null);
  const [mounted, setMounted] = useState(false);

  const { active, big, index, pressed, bind } = useFollowPointer({
    modal,
    cursor,
    label,
  });

  //? The followers are fixed to the viewport, so they live in <body>, out of
  //? reach of any transformed or clipped ancestor.
  useEffect(() => setMounted(true), []);

  return (
    <>
      <ThumbnailList items={rows} bind={bind} />
      <ThumbnailTiles items={tiles} bind={bind} />
      <ThumbnailAction count={caseOptions.length} />
      {mounted
        ? createPortal(
            <>
              <ThumbnailModal
                ref={modal}
                items={rows}
                active={active && !big}
                index={index}
              />
              <ThumbnailCursorCircle
                ref={cursor}
                active={active}
                big={big}
                pressed={pressed}
              />
              <ThumbnailCursorLabel
                ref={label}
                active={active}
                big={big}
                pressed={pressed}
              >
                View
              </ThumbnailCursorLabel>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
