'use client';

import { forwardRef } from 'react';

import { Disc, Label } from './index.styled';
import { Follower } from '../follower/index.styled';

/**
 * Disc size relative to the row cursor (reference: .active, .active.pressed,
 * .active-big and .active-big.pressed at 1440px).
 * @param {{ active: boolean; big?: boolean; pressed?: boolean }} state
 */
const discScale = ({ active, big, pressed }) => {
  if (!active) return 0;
  if (big) return pressed ? 2 : 1.66;
  return pressed ? 1.4 : 1;
};

export const ThumbnailCursorCircle = forwardRef(
  /**
   * Blue disc that trails the mouse over the rows and tiles. `ref` goes to
   * the fixed point that useFollowPointer moves.
   * @param {{ active: boolean; big?: boolean; pressed?: boolean }} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function ThumbnailCursorCircle({ active, big, pressed }, ref) {
    return (
      <Follower ref={ref} $layer={26} aria-hidden='true'>
        <Disc
          data-active={active}
          style={{ '--scale': discScale({ active, big, pressed }) }}
        />
      </Follower>
    );
  },
);

export const ThumbnailCursorLabel = forwardRef(
  /**
   * Text centred on the disc; it trails the mouse a little more tightly.
   * @param {import('react').PropsWithChildren<{ active: boolean; big?: boolean; pressed?: boolean }>} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function ThumbnailCursorLabel({ active, big, pressed, children }, ref) {
    return (
      <Follower ref={ref} $layer={26} aria-hidden='true'>
        <Label
          data-active={active}
          style={{
            '--scale': discScale({ active, big, pressed }),
            '--text-scale': active ? 1 : 0,
          }}
        >
          {children}
        </Label>
      </Follower>
    );
  },
);
