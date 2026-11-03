'use client';

import Link from 'next/link';
import { css, keyframes, styled } from 'styled-components';

import { Container, Stripe, Tagline } from '@/components';

/* Reference easings: a quick ease-out while something grows, an ease-in
   while it shrinks away. The home page's hover preview declares the same two
   values in thumbnail/components/follower; change both together. */
const GROW = '0.4s cubic-bezier(0.34, 1, 0.64, 1)';
const SHRINK = '0.4s cubic-bezier(0.36, 0, 0.66, 0)';

/* The reference's GSAP Power2.easeInOut (gsap-core: Power2 is Cubic) over
   0.6s, as a CSS curve, for the pill fill (index-new.js
   initMagneticButtons). */
const SLIDE = '0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';

/* The page is weight 450 and dark on white, as on the reference. */
export const Page = styled.div`
  position: relative;
  font-weight: 450;
  color: var(--color-dark);
`;

/* ---- header (reference header.section.default-header.work-header) ---- */

export const Header = styled.header`
  padding-top: calc(var(--section-padding) * 1.33);
  padding-bottom: calc(var(--section-padding) * 0.66);

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) * 1.95);
    padding-bottom: calc(var(--section-padding) * 0.75);
  }
`;

/* Two lines, each its own block until 720px, where they run on. */
export const Title = styled.h1`
  font-size: calc(clamp(3.25em, 7vw, 8em) * 0.875);
  font-weight: 450;
  line-height: 1.065;
  color: var(--color-dark);

  > span {
    display: block;
  }

  @media (max-width: 720px) {
    > span {
      display: inline;
    }
  }
`;

/* ---- filters (reference section.work-filters) ---- */

/* Starts a quarter of a section padding up inside the header. */
export const Filters = styled.section`
  position: relative;
  margin-top: calc(var(--section-padding) * -0.25);
  padding-bottom: calc(var(--section-padding) / 2);
`;

export const FilterRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-inline: calc(var(--container-padding) * 0.96);

  @media (max-width: 540px) {
    padding: 0;
  }
`;

const fillIn = keyframes`
  from {
    transform: translateY(76%);
  }

  to {
    transform: translateY(0);
  }
`;

const fillOut = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-76%);
  }
`;

/* Reference button hover (index-new.js initMagneticButtons): the blue fill
   comes up from under the pill over 600ms and leaves through its top; the
   pressed pill keeps its fill. usePillMotion sets data-hover. */
const fillMotion = css`
  /* The pressed pill already holds its fill, so the mouse moves nothing on
     it (reference .btn-normal.active keeps its fill in place) */
  > [data-hover='in']:not([aria-pressed='true'])::before {
    animation: ${fillIn} ${SLIDE} forwards;
  }

  > [data-hover='out']:not([aria-pressed='true'])::before {
    animation: ${fillOut} ${SLIDE} forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    > [data-hover]::before {
      animation: none;
    }
  }
`;

/* Reference .btn margins: each pill half an em from the next and half a
   gap padding above the next line, which the last one does without. */
const pillRow = css`
  display: flex;

  > * {
    margin-bottom: calc(var(--gap-padding) / 2);
  }

  > :last-child {
    margin-bottom: 0;
  }

  ${fillMotion}
`;

/* The filter pills, which shrink with the screen: .89em at 460px, .83em at
   390px and .8em at 380px. */
export const ToggleRow = styled.div`
  ${pillRow}

  > * {
    margin-right: 0.5em;
  }

  @media (max-width: 460px) {
    font-size: 0.89em;
  }

  @media (max-width: 390px) {
    font-size: 0.83em;
  }

  @media (max-width: 380px) {
    font-size: 0.8em;
  }
`;

/* The rows / columns buttons; the tiles are the only view at 1024px and
   below, so they go. */
export const GridRow = styled.div`
  ${pillRow}

  > * {
    margin-left: 0.5em;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

/* Reference .count-nr: the number after a label, small, faded and lifted,
   taking no width of its own so the pill stays the label's width. */
export const Count = styled.sup`
  width: 0;
  position: absolute;
  top: 0;
  margin-left: 0.25em;
  font-size: 0.7em;
  line-height: 1.6;
  vertical-align: baseline;
  opacity: 0.6;
  transform: translate(20%, -15%);
`;

/* ---- the two views (reference .grid-fade) ---- */

/* Both views rise in together after the preloader (reference
   .section-wrap-work.once-in). */
export const ListWrap = styled.div`
  position: relative;
`;

/* A view that is not chosen takes no height, and is out of the tab order
   and the accessibility tree too, not only out of sight. Swapping views
   fades both out (0.25s, dropping 5em) and the chosen one back in over 0.3s
   while it rises for a second. */
const gridFade = css`
  height: 0;
  overflow: hidden;
  padding: 0;
  transform: translateY(0);
  transition:
    opacity 0.3s ease-in 0.4s,
    transform 1s cubic-bezier(0.16, 1, 0.3, 1);

  &[data-visible='false'] {
    visibility: hidden;
  }

  &[data-visible='true'] {
    height: auto;
  }

  &[data-fade='out'] {
    opacity: 0;
    transform: translateY(5em);
    transition:
      opacity 0.25s ease-out,
      transform 0s linear 0.3s;
  }

  &[data-fade='in'] {
    opacity: 1;
    transform: translateY(5em);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* Filtering the tiles: every tile fades out (0.25s, dropping 5em), then
   the ones that stay fade back in over 0.3s while they rise for a second.
   (The reference adds the same classes to its rows, but only styles them on
   .work-tiles li, so the rows never fade: they only fold.) */
const itemFade = css`
  transform: translateY(0);
  transition:
    opacity 0.3s ease-in 0.4s,
    transform 1s cubic-bezier(0.16, 1, 0.3, 1);

  &[data-fade='out'] {
    opacity: 0;
    transform: translateY(5em);
    transition:
      opacity 0.25s ease-out,
      transform 0s linear 0.3s;
  }

  &[data-fade='in'] {
    opacity: 1;
    transform: translateY(5em);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* ---- rows (reference section.work-grid.small-work-grid) ---- */

export const RowsSection = styled.section`
  position: relative;
  ${gridFade}

  @media (max-width: 1024px) {
    display: none;
  }
`;

/* Reference .grid-sub-title: CLIENT / LOCATION / SERVICES / YEAR over the
   rows, a gap padding above the first stripe. */
export const Labels = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: var(--gap-padding);

  h5 {
    width: 100%;
    font-size: 0.6em;
    font-weight: 450;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }
`;

/* The four columns the labels and every row share: 44 / 20 / 22 / 14 per
   cent, the first indented and the last outdented by the container padding
   so the text lines up with the medium container above. */
export const Cell = styled.div`
  position: relative;

  &[data-col='1'] {
    width: 44%;
    padding-left: var(--container-padding);
  }

  &[data-col='2'] {
    width: 20%;
  }

  &[data-col='3'] {
    width: 22%;
  }

  &[data-col='4'] {
    width: 14%;
    padding-right: var(--container-padding);
    text-align: right;
  }
`;

export const Rows = styled.ul`
  padding-bottom: calc(var(--section-padding) * 0.5);
`;

/* Reference .small-work-grid .work-items li: a row the filter drops folds
   to nothing over 0.7s (--animation-smooth) and the ones that stay open to
   one title plus 4.4em, so filtering never leaves a gap. The rows that
   stay keep their opacity throughout: only the tiles fade. */
export const WorkRow = styled.li`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.7s cubic-bezier(0.7, 0, 0.3, 1);

  &[data-visible='true'] {
    max-height: calc(clamp(1.75em, 2.3vw, 2.5em) + 4.4em);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* The whole row is the link, 2em of padding above and below. A mouse over
   it greys the row to a third and pulls the title and the details apart by
   a tenth of the container padding, worked out at each one's own size. */
export const RowLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 2em 0;
  color: inherit;
  text-decoration: none;
  transition: var(--animation-fast);

  h4 {
    position: relative;
    display: block;
    overflow: hidden;
    font-size: clamp(1.55em, 2.3vw, 2.5em);
    font-weight: 450;
    line-height: 1;
    color: var(--color-dark);
    transition: var(--animation-fast);
  }

  h4 span {
    position: relative;
    display: block;
    padding: 0.1em 0;
  }

  p {
    font-size: 1em;
    font-weight: 450;
    line-height: 1.66;
    color: var(--color-dark);
    transition: var(--animation-fast);
  }

  ${Cell}:not(:first-child) {
    padding-top: 0.25em;
  }

  /* A line under the title hangs in the row's bottom padding and slides
     with the title on hover */
  ${Tagline} {
    transition: var(--animation-fast);
  }

  /* A year longer than the column ("2023 – Present") keeps its right edge
     on the YEAR label and runs out to the left instead of wrapping. */
  ${Cell}[data-col='4'] {
    display: flex;
    justify-content: flex-end;
  }

  ${Cell}[data-col='4'] p {
    white-space: nowrap;
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

  /* The hover state still applies, but at once */
  @media (prefers-reduced-motion: reduce) {
    transition: none;

    h4,
    p,
    ${Tagline} {
      transition: none;
    }
  }
`;

/* ---- tiles (reference section.work-tiles) ---- */

/* The only view at 1024px and below, whichever view is chosen; the
   "columns" view above that. */
export const TilesSection = styled.section`
  position: relative;
  ${gridFade}

  @media (max-width: 1024px) {
    &[data-visible] {
      height: auto;
      visibility: visible;
    }
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
  position: relative;
  padding-top: var(--gap-padding);
`;

/* Half the row each, one whole row at 620px and below; a tile the filter
   drops takes no space. */
export const Tile = styled.li`
  width: 0;
  height: 0;
  position: relative;
  overflow: hidden;
  ${itemFade}

  &[data-visible='true'] {
    width: 50%;
    height: auto;
  }

  @media (max-width: 620px) {
    &[data-visible='true'] {
      width: 100%;
    }
  }
`;

/* Reference .single-tile-wrap: a quarter of the container padding each
   side and a section padding under the tile. */
export const TileWrap = styled.div`
  width: 100%;
  padding: 0 calc(var(--container-padding) * 0.25) var(--section-padding);

  @media (max-width: 620px) {
    padding-inline: 0;
  }
`;

export const TileLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow: hidden;
  color: inherit;
  text-decoration: none;

  @media (hover: hover) and (min-width: 620.02px) {
    &:hover img {
      transform: scale(1.025);
    }
  }
`;

export const TileFigure = styled.div`
  width: 100%;
  padding-bottom: var(--gap-padding);
`;

/* A square on the case colour, the thumbnail covering it. */
export const TileImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  background: var(--color-lightgray);

  img {
    object-fit: cover;
    transition: var(--animation-primary);
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
  }
`;

/* The title over a stripe; it grows an eighth at 1024px and below, where
   the tiles stand in for the rows. */
export const TileTitle = styled.div`
  width: 100%;
  padding-bottom: calc(var(--gap-padding) / 2);

  h4 {
    position: relative;
    display: block;
    overflow: hidden;
    font-size: clamp(1.55em, 2.3vw, 2.5em);
    font-weight: 450;
    line-height: 1;
    color: var(--color-dark);
  }

  h4 span {
    position: relative;
    display: block;
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

  @media (max-width: 1024px) {
    h4 {
      font-size: calc(clamp(1.75em, 2.3vw, 2.5em) * 1.125);
    }
  }

  @media (max-width: 620px) {
    padding-bottom: calc(var(--section-padding) / 6);

    ${Stripe} {
      margin-top: calc(var(--section-padding) / 6);
    }
  }
`;

/* Services on the left, the year on the right, 70% / 30% of the tile as on
   the reference at every width. A year longer than its column ("2023 –
   Present" on a phone) keeps its right edge on the tile's and runs out to
   the left over the services' free end rather than wrap, as the rows' year
   cell does, so neither box leaves where the reference has it. */
export const TileMeta = styled.div`
  width: 100%;
  display: flex;

  p {
    font-size: 1em;
    font-weight: 450;
    line-height: 1.66;
    color: var(--color-dark);
  }

  p:first-child {
    width: 70%;
  }

  p:last-child {
    width: 30%;
    display: flex;
    justify-content: flex-end;
    text-align: right;
  }

  p:last-child span {
    flex: none;
    white-space: nowrap;
  }
`;

/* ---- archive pill (reference section.center-grid-btn-archive) ---- */

export const ArchiveSection = styled.section`
  padding-top: 0;
  padding-bottom: calc(var(--section-padding) * 0.75);
`;

export const ArchiveRow = styled.div`
  display: flex;
  justify-content: center;
  ${fillMotion}
`;

/* ---- hover preview (reference .mouse-pos-list-image) ---- */

/* A square clamp(10em, 27.5vw, 25em) wide (396px at 1440), fixed to the
   viewport and moved to the mouse by useFollowPointer; the mouse sits at
   50% / 52% of it. Hidden on phones. */
export const Preview = styled.div`
  width: clamp(10em, 27.5vw, 25em);
  aspect-ratio: 1 / 1;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 25;
  translate: -50% -52%;
  pointer-events: none;
  user-select: none;
  will-change: transform;

  @media (max-width: 540px) {
    display: none;
  }
`;

/* Grows out of the mouse position over a row and shrinks away after it. */
export const PreviewFrame = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  transform: scale(0);
  transform-origin: 50% 52%;
  transition: transform ${SHRINK};

  &[data-active='true'] {
    transform: scale(1);
    transition: transform ${GROW};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* Every thumbnail in one column; WorkPreview tweens it to the hovered
   row's over 0.6s with GSAP (reference .float-image-wrap, Power2.easeInOut),
   so it has no transition of its own. The box is one thumbnail tall and the
   others hang below it, seen only through the frame, so -100% is exactly
   one thumbnail. */
export const Strip = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
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

/* ---- "View" cursor (reference .mouse-pos-list-btn / -span) ---- */

const follower = css`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 26;
  pointer-events: none;
  user-select: none;
  will-change: transform;

  @media (max-width: 540px) {
    display: none;
  }
`;

/* The blue disc, clamp(3.75em, 5.5vw, 5em) across (79px at 1440), its
   centre a tenth of its size above the mouse. --scale is 0 hidden, 1 over
   a row, 1.66 over a tile, and 1.4x / 2x those while the mouse is pressed,
   when the reference sizes it from clamp(3.75em, 5.5vw, 8em) instead (so it
   keeps growing past 5em on wide screens): the box the disc scales within
   grows to that at the same pace. */
export const Cursor = styled.div`
  --size: clamp(3.75em, 5.5vw, 5em);

  width: var(--size);
  height: var(--size);
  translate: -50% -60%;
  transition:
    width ${SHRINK},
    height ${SHRINK};
  ${follower}

  &[data-active='true'] {
    transition:
      width ${GROW},
      height ${GROW};
  }

  &[data-pressed='true'] {
    --size: clamp(3.75em, 5.5vw, 8em);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Disc = styled.div`
  width: 100%;
  height: 100%;
  background: var(--color-blue);
  border-radius: 50%;
  transform: scale(var(--scale));
  transform-origin: 50% 60%;
  transition: transform ${SHRINK};

  &[data-active='true'] {
    transition: transform ${GROW};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* The word centred on the disc, trailing the mouse a little more tightly;
   it keeps its 1em size when the disc is larger. --size is the disc's, so
   the word stays on its centre while the mouse is pressed too. */
export const CursorLabel = styled.div`
  --size: clamp(3.75em, 5.5vw, 5em);

  translate: -50% -50%;
  font-size: 1em;
  line-height: 1.66;
  color: var(--color-white);
  white-space: nowrap;
  ${follower}

  &[data-pressed='true'] {
    --size: clamp(3.75em, 5.5vw, 8em);
  }
`;

export const LabelText = styled.span`
  display: block;
  transform: translateY(calc(var(--size) * -0.1 * var(--scale)))
    scale(var(--text-scale));
  transition: transform ${SHRINK};

  &[data-active='true'] {
    transition: transform ${GROW};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
