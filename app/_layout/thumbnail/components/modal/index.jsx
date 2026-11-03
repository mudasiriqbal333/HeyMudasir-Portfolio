'use client';

import { forwardRef, useState } from 'react';

import Image from 'next/image';

import { useMediaQuery } from '@/hooks';

import { Frame, Slide, Strip } from './index.styled';
import { Follower } from '../follower/index.styled';

export const ThumbnailModal = forwardRef(
  /**
   * Preview image that trails the mouse over the rows. `ref` goes to the
   * fixed point that useFollowPointer moves.
   * @param {{ items: typeof import('@/data').thumbnailOptions; active: boolean; index: number }} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function ThumbnailModal({ items, active, index }, ref) {
    //? The preview only opens from the rows, and the rows are hidden at
    //? 1024px and below (list/index.styled.js). Its box is in the page at
    //? every width, so it keeps following the pointer and opens and closes
    //? as it always did when the window is resized across that width. Only
    //? its thumbnails wait until the rows are shown for the first time, so a
    //? phone or tablet never downloads them; once fetched they stay, to be
    //? there while the box closes. The query is the exact opposite of that
    //? CSS breakpoint.
    const hasRows = useMediaQuery('not all and (max-width: 1024px)');
    const [withImages, setWithImages] = useState(false);
    if (hasRows && !withImages) setWithImages(true);

    return (
      <Follower ref={ref} $layer={25} aria-hidden='true'>
        <Frame data-active={active}>
          <Strip
            style={{
              transform: `translateY(${(index * -100) / items.length}%)`,
            }}
          >
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
        </Frame>
      </Follower>
    );
  },
);
