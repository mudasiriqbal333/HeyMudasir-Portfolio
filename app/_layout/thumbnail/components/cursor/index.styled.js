'use client';

import { css, styled } from 'styled-components';

import { GROW, SHRINK } from '../follower/index.styled';

/* Both pieces read --scale (0 hidden, 1 over a row, 1.66 over a tile, larger
   while pressed) and --size, the reference's clamp(3.75em, 5.5vw, 5em). */
const shape = css`
  --size: clamp(3.75em, 5.5vw, 5em);

  position: absolute;
  top: 0;
  left: 0;
  transition: transform ${SHRINK};

  &[data-active='true'] {
    transition: transform ${GROW};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &[data-active='true'] {
      transition: none;
    }
  }
`;

/* Reference .mouse-pos-list-btn: blue disc whose centre sits 10% of its
   size above the mouse. */
export const Disc = styled.div`
  ${shape}

  width: var(--size);
  height: var(--size);
  background: var(--color-blue);
  border-radius: 50%;
  transform: translate(-50%, -60%) scale(var(--scale));
  transform-origin: 50% 60%;
`;

/* Reference .mouse-pos-list-span: the "View" text, centred on the disc and
   growing from nothing; it keeps its 1em size when the disc is larger. */
export const Label = styled.div`
  ${shape}

  font-size: 1em;
  line-height: 1.66;
  color: var(--color-white);
  white-space: nowrap;
  transform: translate(-50%, -50%)
    translateY(calc(var(--size) * -0.1 * var(--scale))) scale(var(--text-scale));
`;
