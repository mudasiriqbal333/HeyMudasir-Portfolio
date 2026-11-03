'use client';

import Link from 'next/link';
import { styled } from 'styled-components';

import { Container, Stripe, Tagline } from '@/components';

/* Reference .work-tiles.work-tiles-home: replaces the rows at 1024px and
   below, two columns on tablets and one on phones. */
export const Section = styled.section`
  display: none;
  color: var(--color-dark);

  @media (max-width: 1024px) {
    display: block;
  }
`;

export const TilesContainer = styled(Container)`
  padding-inline: calc(var(--container-padding) * 0.75);

  @media (max-width: 620px) {
    padding-inline: var(--container-padding);
  }
`;

export const Tiles = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-top: var(--gap-padding);
`;

export const Tile = styled.li`
  width: 50%;
  padding: 0 calc(var(--container-padding) * 0.25) var(--section-padding);

  @media (max-width: 620px) {
    width: 100%;
    padding-inline: 0;
  }
`;

export const TileLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow: hidden;
  color: inherit;

  @media (hover: hover) and (min-width: 620.02px) {
    &:hover img {
      transform: scale(1.025);
    }
  }
`;

export const TileImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  margin-bottom: var(--gap-padding);
  background: var(--color-lightgray);

  img {
    object-fit: cover;
    transition: var(--animation-primary);
  }
`;

export const TileTitle = styled.div`
  width: 100%;
  padding-bottom: calc(var(--gap-padding) / 2);

  h4 {
    display: block;
    position: relative;
    overflow: hidden;
    font-size: calc(clamp(1.75em, 2.3vw, 2.5em) * 1.125);
    line-height: 1;
  }

  span {
    display: block;
    position: relative;
    padding: 0.1em 0;
  }

  ${Stripe} {
    margin-top: calc(var(--gap-padding) / 2);
  }

  /* A line under the title hangs in the space above the stripe, pulled up
     into the title's own bottom padding so it keeps clear of the stripe */
  ${Tagline} {
    margin-top: -0.3em;
  }

  @media (max-width: 620px) {
    padding-bottom: calc(var(--section-padding) / 6);

    ${Stripe} {
      margin-top: calc(var(--section-padding) / 6);
    }
  }
`;

/* Services on the left, year on the right (reference 70% / 30%). The year
   column grows instead of wrapping when the text is longer, e.g.
   "2023 – Present". */
export const TileMeta = styled.div`
  width: 100%;
  display: flex;

  p {
    font-size: 1em;
    line-height: 1.66;
  }

  p:first-child {
    flex: 1 1 0;
    min-width: 0;
  }

  p:last-child {
    min-width: 30%;
    flex: none;
    padding-left: 0.5em;
    text-align: right;
    white-space: nowrap;
  }
`;
