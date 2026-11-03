'use client';

import { motion } from 'framer-motion';
import { css, keyframes, styled } from 'styled-components';

import { Row, Stripe } from '@/components';

/* ---- shared ---- */

export const Page = styled.main`
  color: var(--color-dark);
  background: var(--color-white);
`;

const dot1 = keyframes`
  0%, 20% { opacity: 0; }
  30%, 90% { opacity: 1; }
`;
const dot2 = keyframes`
  0%, 35% { opacity: 0; }
  45%, 90% { opacity: 1; }
`;
const dot3 = keyframes`
  0%, 50% { opacity: 0; }
  60%, 90% { opacity: 1; }
`;

/* Reference: .animate-dot, three dots appearing one after another */
export const Dots = styled.span`
  span {
    opacity: 0;
    animation: ${dot1} 2s linear infinite;
  }

  span:nth-child(2) {
    animation-name: ${dot2};
  }

  span:nth-child(3) {
    animation-name: ${dot3};
  }

  @media (prefers-reduced-motion: reduce) {
    span {
      opacity: 1;
      animation: none;
    }
  }
`;

/* ---- header ---- */

export const Header = styled.header`
  padding-top: calc(var(--section-padding) * 1.33);
  padding-bottom: calc(var(--section-padding) * 0.66);
  background: var(--color-white);

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) * 1.95);
    padding-bottom: calc(var(--section-padding) * 0.75);
  }
`;

export const Title = styled.h1`
  font-size: calc(clamp(3.25em, 7vw, 8em) * 0.875);
  line-height: 1.065;

  > span {
    display: block;
  }

  @media (max-width: 720px) {
    > span {
      display: inline;
    }
  }
`;

/* ---- line + CV button ---- */

export const CvLine = styled.section`
  position: relative;
  z-index: 5;
  overflow: visible;
`;

/* The round "Download CV" button sits on the line where the reference has
   its globe (.digital-ball): centred on the line, half a button in from the
   right. */
export const CvButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-50%, -50%);

  @media (max-width: 1000px) {
    transform: translate(-20%, -50%);
  }
`;

/* ---- intro (about-image) ---- */

export const Intro = styled.section`
  position: relative;
  padding-top: calc(var(--section-padding) * 0.75);
  background: var(--color-white);

  @media (max-width: 840px) {
    padding-top: calc(var(--section-padding) * 0.85);
  }
`;

export const BottomLightgray = styled.div`
  width: 100%;
  height: 60vw;
  position: absolute;
  bottom: 0;
  left: 0;
  display: none;
  background: var(--color-lightgray);

  @media (max-width: 840px) {
    display: block;
  }
`;

export const IntroText = styled.div`
  width: 35%;
  position: relative;
  padding-right: calc(var(--container-padding) / 2);
  padding-left: var(--container-padding);

  p {
    display: block;
    margin: -0.33em 0 1em;
    line-height: 1.66;
    will-change: transform;
  }

  p:last-child {
    margin-bottom: 0;
  }

  p + p > span {
    display: block;
    padding-top: 0.5em;
    opacity: 0.5;
  }

  @media (max-width: 840px) {
    width: 100%;
    margin-left: var(--container-padding);
    padding: calc(var(--section-padding) / 4) var(--container-padding) 0 0;
  }

  @media (max-width: 540px) {
    margin-left: 0;
    padding-right: 0;
  }
`;

export const IntroArrow = styled.div`
  width: clamp(0.9em, 1.1vw, 1.1em);
  position: absolute;
  left: 0;
  transform: rotate(-45deg);
  will-change: transform;

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 840px) {
    top: calc(var(--section-padding) / -4);
    transform: rotate(0deg) translateY(-50%);
  }
`;

export const IntroImageCol = styled.div`
  width: 65%;
  position: relative;

  @media (max-width: 840px) {
    width: 100%;
    padding-top: calc(var(--section-padding) / 1.15);
  }

  @media (max-width: 540px) {
    padding-top: calc(var(--section-padding) * 0.5);
  }
`;

/* Reference: .single-about-image, a box taller than wide holding an
   oversized photo (1:1.35 there; shorter here by the owner's choice). */
/* PHOTO HEIGHT: each padding-top below is the photo frame's height as a
   share of its width (80% = four fifths as tall as wide). Lower it for a
   shorter photo, raise it for a taller one. Desktop (80%), then tablets at
   840px and below (85%), then phones at 540px and below (100%, square). */
export const Portrait = styled.div`
  width: 100%;
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--color-lightgray);

  &::before {
    display: block;
    padding-top: 80%;
    content: '';
  }

  @media (max-width: 840px) {
    &::before {
      padding-top: 85%;
    }
  }

  @media (max-width: 540px) {
    &::before {
      padding-top: 100%;
    }
  }
`;

/* The photo fills its frame. While it drifts with the scroll (desktop, see
   intro.jsx) it is taller than the frame by the whole distance it travels,
   a fifth of the screen plus the frame on each side, so no edge of the
   frame is ever left empty, whatever the frame's or the screen's height. */
export const PortraitImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;

  &[data-parallax] {
    height: calc(100% + (100vh + 100%) * 0.2);
    top: calc((100vh + 100%) * -0.1);
  }
`;

/* ---- services ---- */

export const Services = styled.section`
  margin-top: -1px;
  padding-top: calc(var(--section-padding) * 0.75);
  padding-bottom: var(--section-padding);
  background: var(--color-lightgray);

  @media (max-width: 720px) {
    padding-top: var(--section-padding);
  }
`;

export const ServicesHeadingRow = styled(Row)`
  padding-bottom: calc(var(--section-padding) / 2);
`;

export const ServicesHeading = styled.h2`
  font-size: calc(clamp(3.25em, 5vw, 4.5em) * 0.75);
  line-height: 1.065;
`;

export const ServicesRow = styled(Row)`
  width: calc(100% + var(--container-padding) / 1.5);
  margin-left: calc(var(--container-padding) / -1.5);

  @media (max-width: 720px) {
    width: 100%;
    margin-left: 0;
  }
`;

export const Service = styled.div`
  width: 33.333%;
  position: relative;
  padding-left: calc(var(--container-padding) / 1.5);

  [data-number] {
    margin: 0;
    padding-bottom: 2em;
    font-size: 0.8em;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  ${Stripe} {
    margin-bottom: 2em;
  }

  h3 {
    margin: 0;
    font-size: clamp(1.55em, 2.3vw, 2.5em);
    line-height: 1.45;
  }

  h3 svg {
    width: 1em;
    display: inline-block;
    margin-right: 0.25em;
    vertical-align: middle;
    transform: translate(0, -0.05em);
  }

  p:last-child {
    padding-top: 2em;
    line-height: 1.66;
  }

  @media (max-width: 720px) {
    width: 100%;
    padding-bottom: calc(var(--section-padding) * 0.5);
    padding-left: 0;

    &:last-child {
      padding-bottom: 0;
    }

    [data-number] {
      display: none;
    }

    ${Stripe} {
      margin-bottom: calc(var(--section-padding) * 0.5);
    }

    p:last-child {
      padding-top: calc(var(--gap-padding) * 0.5);
    }
  }
`;

/* ---- experience and certificates: rows in the Work list's style ---- */

/* --columns sets the rows' columns, so the labels above them line up:
   company, role, location and years; or certificate, issuer and year. */
export const ListSection = styled.section`
  --columns: 38fr 28fr 18fr 16fr;

  position: relative;
  margin-top: -1px;
  padding-top: calc(var(--section-padding) * 0.75);
  padding-bottom: calc(var(--section-padding) * 0.5);
  background: var(--color-lightgray);

  &[data-list='certificates'] {
    --columns: 52fr 34fr 14fr;

    padding-bottom: var(--section-padding);
    background: var(--color-white);
  }

  @media (max-width: 1024px) {
    --columns: 40fr 36fr 24fr;
  }

  @media (max-width: 720px) {
    padding-top: var(--section-padding);
  }
`;

/* The Work rows' grid, cells inset from the line ends by the container's
   padding, less on the right, where the toggle or arrow sits. The last
   column keeps to one line and runs out to the left, as the Work list's
   years do. A cell marked data-wide-only (the location) waits for room. */
const rowColumns = css`
  display: grid;
  grid-template-columns: var(--columns);
  column-gap: 1em;
  align-items: center;

  [data-col] {
    min-width: 0;
  }

  [data-col]:first-child {
    padding-left: var(--container-padding);
  }

  [data-col]:last-of-type {
    display: flex;
    justify-content: flex-end;
    padding-right: calc(var(--container-padding) * 0.6);
    white-space: nowrap;
  }

  @media (max-width: 1024px) {
    [data-wide-only] {
      display: none;
    }
  }
`;

export const ListLabels = styled.div`
  ${rowColumns}

  padding-bottom: var(--gap-padding);

  span {
    font-size: 0.6em;
    font-weight: 450;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  > ${Stripe} {
    margin: 0;
  }
`;

/* An <h3> holding the row's button, the accordion pattern */
export const RowHeading = styled.h3`
  margin: 0;
  font-size: 1em;
  font-weight: inherit;
`;

const rowBase = css`
  ${rowColumns}

  width: 100%;
  position: relative;
  padding: 2em 0;
  font: inherit;
  color: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: 0;
  transition: var(--animation-fast);

  [data-title] {
    display: block;
    padding: 0.1em 0;
    font-size: var(--title-size, clamp(1.55em, 2.3vw, 2.5em));
    font-weight: 450;
    line-height: 1.05;
    transition: var(--animation-fast);
  }

  [data-col]:not(:first-child) {
    padding-top: 0.25em;
    font-weight: 450;
    line-height: 1.45;
    transition: var(--animation-fast);
  }

  @media (hover: hover) {
    &:hover {
      opacity: 0.33;
    }

    &:hover [data-title] {
      transform: translateX(calc(var(--container-padding) * -0.1));
    }

    &:hover [data-col]:not(:first-child) {
      transform: translateX(calc(var(--container-padding) * 0.1));
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-blue);
    outline-offset: -2px;
  }

  /* Phones: the title on its own line, the rest under it, the toggle or
     arrow to the right */
  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 0.35em;
    padding: 1.6em 2.5em 1.6em 0;

    [data-col]:first-child {
      grid-column: 1 / -1;
      padding-left: 0;
    }

    [data-col]:last-of-type {
      padding-right: 0;
    }

    [data-col]:not(:first-child) {
      padding-top: 0;
      font-size: 0.9em;
      opacity: 0.6;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    [data-title],
    [data-col] {
      transition: none;
    }
  }
`;

export const RowButton = styled.button`
  ${rowBase}
`;

export const CertLink = styled.a`
  --title-size: clamp(1.2em, 1.65vw, 1.75em);

  ${rowBase}
`;

/* A plus that turns into a cross while the row is open */
export const Toggle = styled.i`
  width: 0.9em;
  height: 0.9em;
  position: absolute;
  top: 50%;
  right: calc(var(--container-padding) * 0.3);
  transform: translateY(-50%);
  transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);

  &::before,
  &::after {
    height: 1.5px;
    position: absolute;
    top: calc(50% - 0.75px);
    right: 0;
    left: 0;
    content: '';
    background: currentcolor;
  }

  &::after {
    transform: rotate(90deg);
  }

  [aria-expanded='true'] > & {
    transform: translateY(-50%) rotate(45deg);
  }

  @media (max-width: 720px) {
    right: 0.4em;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* The arrow of a link that opens elsewhere, where the toggle would be */
export const RowArrow = styled.i`
  width: 0.75em;
  position: absolute;
  top: 50%;
  right: calc(var(--container-padding) * 0.3);
  transform: translateY(-50%) rotate(-90deg);

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 720px) {
    right: 0.4em;
  }
`;

/* The opened row: the company's logo under its name, what was done there
   under the other columns */
export const Details = styled.div`
  display: grid;
  grid-template-columns: var(--columns);
  column-gap: 1em;
  padding-bottom: 2.75em;

  > :first-child {
    padding-left: var(--container-padding);
  }

  > :last-child {
    grid-column: 2 / -1;
    padding-right: var(--container-padding);
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 1.5em;
    padding-bottom: 2em;

    > :first-child {
      padding-left: 0;
    }

    > :last-child {
      grid-column: 1;
      padding-right: 0;
    }
  }
`;

export const LogoTile = styled.div`
  width: min(100%, 14em);
  position: relative;
  overflow: hidden;
  background: var(--logo-background, var(--color-white));
  border-radius: 0.6em;

  &::before {
    display: block;
    padding-top: 56.25%;
    content: '';
  }

  img {
    padding: 1.4em 1.8em;
    object-fit: contain;
  }

  @media (max-width: 720px) {
    width: 11em;
  }
`;

export const DetailsText = styled.div`
  max-width: 44em;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    padding: 0.8em 0;
    line-height: 1.66;
  }

  li:first-child {
    padding-top: 0;
  }

  li + li {
    border-top: 1px solid var(--color-border);
  }
`;

export const Projects = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6em;
  margin-top: 1.4em;

  > span {
    margin-right: 0.5em;
    font-size: 0.6em;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  a {
    height: 2.6em;
    display: inline-flex;
    align-items: center;
    padding: 0 1.2em;
    font-size: 0.85em;
    color: inherit;
    text-decoration: none;
    border: 1px solid var(--color-border);
    border-radius: 1.3em;
    transition: var(--animation-fast);
  }

  a:hover,
  a:focus-visible {
    color: var(--color-white);
    background: var(--color-dark);
    border-color: var(--color-dark);
  }
`;

/* ---- degrees ---- */

export const Degrees = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gap-padding) calc(var(--gap-padding) * 1.5);
  padding-bottom: calc(var(--section-padding) * 0.6);

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
    gap: calc(var(--section-padding) * 0.4);
  }
`;

export const Degree = styled.div`
  [data-label] {
    margin: 0;
    padding-bottom: 2em;
    font-size: 0.8em;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  ${Stripe} {
    margin-bottom: 2em;
  }

  h3 {
    margin: 0;
    font-size: clamp(1.55em, 2.3vw, 2.5em);
    line-height: 1.3;
  }

  p:not([data-label]) {
    margin: 0.6em 0 0;
    line-height: 1.66;
  }

  a {
    display: inline-block;
    margin-top: 1em;
    line-height: 1.5;
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.25em;
  }

  a:hover {
    color: var(--color-blue);
  }
`;

/* ---- the picture that follows the mouse over the rows ---- */

/* As the Work list's preview: square for the logos, 4:3 for certificates */
export const PreviewBox = styled.div`
  width: clamp(10em, 22vw, 20em);
  aspect-ratio: 1 / 1;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 25;
  translate: -50% -52%;
  pointer-events: none;
  user-select: none;
  will-change: transform;

  &[data-shape='wide'] {
    width: clamp(12em, 28vw, 26em);
    aspect-ratio: 4 / 3;
  }

  @media (max-width: 540px) {
    display: none;
  }
`;

export const PreviewSlide = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: var(--color-lightgray);

  img {
    padding: 18%;
    object-fit: contain;
  }

  &[data-kind='certificate'] img {
    padding: 7%;
  }
`;

/* ---- feature (about-awwwards) ---- */

export const Feature = styled.section`
  padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);
  background: var(--color-white);

  ${Row} {
    align-items: center;
  }

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) / 1.5);
  }
`;

export const FeatureImageCol = styled.div`
  width: 50%;
  position: relative;
  padding-right: calc(var(--container-padding) / 2);

  @media (max-width: 720px) {
    width: 100%;
    order: 2;
    padding-right: 0;
  }
`;

export const FeatureTextCol = styled.div`
  width: 50%;
  position: relative;
  padding-bottom: 3em;
  padding-left: calc(var(--container-padding) / 2);

  h2 {
    margin-bottom: 0.66em;
    font-size: calc(clamp(3.25em, 5vw, 4.5em) * 0.75);
    line-height: 1.065;
  }

  h2 > span {
    display: block;
  }

  p {
    line-height: 1.66;
  }

  @media (max-width: 720px) {
    width: 100%;
    order: 1;
    padding-bottom: calc(var(--section-padding) / 2);
    padding-left: 0;
  }
`;

/* Reference: .single-image (4:5 box, top gradient). Unlike the reference the
   photo does not move with the scroll: it is cropped from the top only, so
   the bottom of the picture always shows. */
export const FeatureImage = styled.div`
  width: 100%;
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--color-lightgray);

  &::before {
    display: block;
    padding-top: 125%;
    content: '';
  }

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background: linear-gradient(
      to bottom,
      hsl(220deg 13% 5% / 7.5%) 0%,
      hsl(220deg 13% 5% / 0%) 50%
    );
  }
`;

/* The second About photo fills its frame and stands on the frame's bottom
   edge, centred: when the photo is taller than the frame, only its top is
   trimmed, never its bottom or sides. */
export const FeatureImageInner = styled.img`
  width: 100%;
  max-width: none;
  height: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
  object-position: center bottom;
`;

/* Reference: .awwwards-badge, rotated -90deg by scroll */
export const Badge = styled.div`
  width: 6em;
  position: relative;
  margin-bottom: calc(var(--section-padding) / 4);
  color: var(--color-gray);
  border-radius: 50%;

  &::before {
    display: block;
    padding-top: 100%;
    content: '';
  }

  svg {
    position: absolute;
  }

  svg:first-of-type {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  svg:last-of-type {
    width: 40%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const BadgeRing = styled.svg`
  will-change: transform;
`;
