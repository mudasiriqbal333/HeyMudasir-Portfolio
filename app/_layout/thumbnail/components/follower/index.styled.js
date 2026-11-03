'use client';

import { styled } from 'styled-components';

/* Reference easings for the hover preview and cursor: a quick ease-out while
   growing (.active) and an ease-in while shrinking back to nothing. */
export const GROW = '0.4s cubic-bezier(0.34, 1, 0.64, 1)';
export const SHRINK = '0.4s cubic-bezier(0.36, 0, 0.66, 0)';

/* A zero-size fixed point that useFollowPointer moves to the mouse with a
   transform; its children are drawn around it. Hidden on phones, like the
   reference's .mouse-pos-list-image / -btn / -span. */
export const Follower = styled.div`
  width: 0;
  height: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ $layer }) => $layer};
  pointer-events: none;
  user-select: none;
  will-change: transform;

  @media (max-width: 540px) {
    display: none;
  }
`;
