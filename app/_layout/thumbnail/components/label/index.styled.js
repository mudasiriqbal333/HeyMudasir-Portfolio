'use client';

import { styled } from 'styled-components';

/* Reference .grid-sub-title: small uppercase h5 lined up with the titles. */
export const SubTitle = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: var(--gap-padding);

  > div {
    width: 70%;
    padding-left: var(--container-padding);
  }

  h5 {
    font-size: 0.6em;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }
`;
