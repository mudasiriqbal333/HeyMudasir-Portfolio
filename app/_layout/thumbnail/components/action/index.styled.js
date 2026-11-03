'use client';

import { styled } from 'styled-components';

/* Reference .center-grid-btn.center-grid-btn-home: half a section padding
   above the pill (none under the tiles, whose last tile already ends in a
   full one) and a section padding less 2.5vw below it. */
export const Section = styled.section`
  padding-top: calc(var(--section-padding) / 2);
  padding-bottom: calc(var(--section-padding) - 2.5vw);
  color: var(--color-dark);

  @media (max-width: 1024px) {
    padding-top: 0;
  }
`;

/* Centres the pill and sets the case count after its label (reference
   .count-nr): small, faded and lifted, taking no width of its own. */
export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;

  sup {
    width: 0;
    position: absolute;
    top: 0;
    margin-left: 0.25em;
    font-size: 0.7em;
    line-height: 1.6;
    vertical-align: baseline;
    opacity: 0.6;
    transform: translate(20%, -15%);
  }
`;
