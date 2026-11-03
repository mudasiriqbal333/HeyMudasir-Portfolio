'use client';

import Link from 'next/link';
import { styled } from 'styled-components';

import { Tagline } from '@/components';

/* Reference .work-grid.large-work-grid: rows above 1024px; the tiles take
   over below that. */
export const Section = styled.section`
  position: relative;
  color: var(--color-dark);

  @media (max-width: 1024px) {
    display: none;
  }
`;

/* The whole row is the link. Hovering it greys the row out and pulls the
   title and the services apart by a tenth of the container padding, worked
   out at each element's own font size (-18.9px / +11.52px at 1440). */
export const RowLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: calc(var(--section-padding) / 3.5) 0 calc(var(--section-padding) / 3);
  color: inherit;
  transition: var(--animation-fast);

  h4,
  p,
  ${Tagline} {
    transition: var(--animation-fast);
  }

  @media (hover: hover) {
    &:hover {
      opacity: 0.33;
    }

    &:hover h4,
    &:hover ${Tagline} {
      transform: translateX(calc(var(--container-padding) * -0.1));
    }

    &:hover p {
      transform: translateX(calc(var(--container-padding) * 0.1));
    }
  }
`;

export const TitleCol = styled.div`
  width: 70%;
  padding-left: var(--container-padding);

  h4 {
    display: block;
    position: relative;
    overflow: hidden;
    font-size: calc(clamp(3.25em, 7vw, 8em) * 0.75);
    line-height: 1;
  }

  span {
    display: block;
    position: relative;
    padding: 0.1em 0;
  }
`;

export const ServicesCol = styled.div`
  width: 30%;
  padding-top: 1em;
  padding-right: calc(var(--container-padding) * 0.5);
  padding-left: var(--gap-padding);

  p {
    font-size: 1em;
    line-height: 1.66;
  }
`;
