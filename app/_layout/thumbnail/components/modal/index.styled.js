'use client';

import { styled } from 'styled-components';

import { GROW, SHRINK } from '../follower/index.styled';

/* Reference .mouse-pos-list-image: a square clamp(10em, 27.5vw, 25em) wide
   (396px at 1440) with square corners. It grows out of the mouse position,
   which sits at 50% / 52% of the square. */
export const Frame = styled.div`
  width: clamp(10em, 27.5vw, 25em);
  aspect-ratio: 1 / 1;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  transform: translate(-50%, -52%) scale(0);
  transform-origin: 50% 52%;
  transition: transform ${SHRINK};

  &[data-active='true'] {
    transform: translate(-50%, -52%) scale(1);
    transition: transform ${GROW};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &[data-active='true'] {
      transition: none;
    }
  }
`;

/* All thumbnails stacked in one column; it slides to the hovered row's
   image (reference .float-image-wrap, Power2.easeInOut over 0.6s). */
export const Strip = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Slide = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`;
