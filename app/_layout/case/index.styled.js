'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { createGlobalStyle, css, styled } from 'styled-components';

import { Container, Row, Stripe, Tagline } from '@/components';

/* ---- page + header (reference .case-header) ---- */

export const Page = styled.main`
  color: var(--color-dark);
  background: var(--color-white);
`;

export const Header = styled.header`
  padding-top: calc(var(--section-padding) * 1.33);
  padding-bottom: 0;

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) * 1.95);
  }
`;

export const Title = styled.h1`
  font-size: clamp(3.25em, 7vw, 8em);
  line-height: 1.065;
`;

/* The project's optional line under the title ("Powered by BMW"), a size up
   from the list rows, where the title it sits under is far smaller. */
export const TitleTagline = styled(Tagline)`
  margin-top: 1.1em;
  font-size: 0.8em;
`;

/* ---- intro (reference .case-intro) ---- */

export const Intro = styled.section`
  margin-top: -1px;
  padding-top: calc(var(--section-padding) / 1.75);
  padding-bottom: calc(var(--section-padding) / 1.25);

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) / 2.5);
  }
`;

/* Small uppercase label over a stripe: the intro columns and the description
   below them share it, so the two rows read as one piece of the page. */
const columnHeading = css`
  h2 {
    font-size: 0.6em;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  ${Stripe} {
    margin: 1.75em 0 1.5em;
  }

  @media (max-width: 720px) {
    ${Stripe} {
      margin: 4.5vw 0 3vw;
    }
  }
`;

export const IntroCol = styled.div`
  width: calc(33.333% - var(--gap-padding));
  margin-right: calc(var(--gap-padding) * 1.5);

  ${columnHeading}

  &:last-child {
    margin-right: 0;
  }

  p {
    line-height: 1.66;
  }

  &[data-inline='true'] p {
    display: inline-block;
    margin-right: 0.25em;
  }

  @media (max-width: 720px) {
    width: 100%;
    margin: 0 0 8vw;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

/* ---- hero image + live button (reference .case-intro-image) ---- */

/* \$tight: a description follows, so the hero leaves half the usual space
   under the picture instead of a whole section's worth. */
export const Hero = styled.section`
  position: relative;
  margin-top: -1px;
  padding-bottom: ${({ $tight }) =>
    $tight ? 'calc(var(--section-padding) / 2)' : 'var(--section-padding)'};

  @media (max-width: 720px) {
    padding-bottom: 0;
  }
`;

export const HeroContainer = styled(Container)`
  @media (max-width: 720px) {
    padding-inline: 0;
  }
`;

const mediaFill = css`
  width: 100%;
  max-width: none;
  height: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
`;

/**
 * The hero box. Until the image reports its size it keeps the reference's
 * banner shape; once `$ratio` (natural width / height) is known the box takes
 * the picture's own shape, so nothing is ever cropped. A very tall picture is
 * capped at 82vh and centred instead of running off the screen.
 */
export const HeroFigure = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  background: rgb(100 100 100 / 10%);

  &::before {
    display: block;
    padding-top: 60%;
    content: '';
  }

  @media (max-width: 1000px) {
    &::before {
      padding-top: 80%;
    }
  }

  @media (max-width: 720px) {
    &::before {
      padding-top: 100%;
    }
  }

  ${({ $ratio }) =>
    $ratio
      ? css`
          aspect-ratio: ${$ratio};
          max-width: min(100%, calc(82vh * ${$ratio}));
          margin-inline: auto;

          &::before {
            display: none;
          }

          @media (max-width: 1000px) {
            &::before {
              display: none;
            }
          }

          @media (max-width: 720px) {
            &::before {
              display: none;
            }
          }
        `
      : null}

  /* A portrait hero is a phone screen: on the white page a white screen would
     lose its edges, so it gets a phone screen's rounded corners and a
     hairline, and no grey behind it */
  ${({ $ratio }) =>
    $ratio && $ratio < 1
      ? css`
          background: none;
          border-radius: 1.25em;
          box-shadow: 0 0 0 1px rgb(0 0 0 / 9%);
        `
      : null}
`;

export const HeroImage = styled(motion.img)`
  ${mediaFill}

  ${({ $fitted }) =>
    $fitted
      ? css`
          height: 100%;
          top: 0;
          object-fit: contain;
        `
      : css`
          height: 120%;
          top: -10%;
        `}
`;

export const HeroLogo = styled.img`
  ${mediaFill}

  object-fit: contain;
  pointer-events: none;
`;

export const LiveButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  transform: translate(-50%, -50%);

  @media (max-width: 720px) {
    transform: translate(-10vw, -130%);
  }
`;

/* ---- description (the owner's words about the project) ---- */

/**
 * `--typed` (words of the lead that are in) and `--progress` (0 -> 1 across
 * the block) are counted up by useTypewriter on the section itself; every
 * rule below reads them. They are declared here so that with no JavaScript,
 * or on a case the hook never reached, the block is simply at rest.
 *
 * Registering them keeps the per-frame substitution typed, so a write costs
 * one numeric re-resolve rather than a re-parse on every word.
 */
export const TypedProperties = createGlobalStyle`
  @property --typed {
    syntax: '<number>';
    inherits: true;
    initial-value: 99999;
  }

  @property --progress {
    syntax: '<number>';
    inherits: true;
    initial-value: 1;
  }

  /* Registered as a length so the column can set the measure once, in its own
     em, and the lead inherits it in pixels instead of re-reading it against
     its own much larger font size. Without @property the lead simply falls
     back to the full column, which is where it was before. */
  @property --measure {
    syntax: '<length>';
    inherits: true;
    initial-value: 1000px;
  }
`;

/* A line that rises in while the lead is still being typed. `--start` (set
   per line, from staggerStarts) says when it begins; the 0.18 below is how
   long it takes to arrive and is REVEAL_FADE in app/_utils/helpers/typewriter.js
   -- the two are the same number and want changing together. Nothing here
   affects layout, so the block is its final size from the first paint. */
const revealed = css`
  --u: clamp(0, calc((var(--progress) - var(--start, 0)) / 0.18), 1);

  opacity: var(--u);
  transform: translateY(calc((1 - var(--u)) * 0.6em));
`;

/* The gap above is the hero's own bottom padding (half a section when a
   description follows), which is why there is no padding-top here except on
   small screens, where the hero has none and this adds the same half. The gap
   below matches the intro row's, and keeps the copy off the coloured block
   that follows. A case without a description renders none of this and the
   hero and the first block meet exactly as before.

   No `data-once-in`: the media blocks below carry none either, so the section
   stays where it is while the page reveal lifts the rows above it. */
export const Description = styled.section`
  --typed: 99999;
  --progress: 1;

  position: relative;
  margin-top: -1px;
  padding-bottom: calc(var(--section-padding) / 1.25);

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) / 2);
  }

  [data-reveal] {
    ${revealed}
  }

  /* Beats the hook's inline values, for a preference changed mid-run. */
  @media (prefers-reduced-motion: reduce) {
    --typed: 99999 !important;
    --progress: 1 !important;
  }
`;

/* Two of the intro row's three columns, to the pixel: two column widths plus
   the gutter between them, and the same gutter again before the aside. */
export const DescriptionCol = styled.div`
  /* ~75 characters a line for the body, ~39 for the lead: the column alone
     would run to 91, where the eye starts losing its place. The lead and the
     paragraphs share it, so the copy has one right edge at every width. */
  --measure: 32em;

  width: calc(66.666% - var(--gap-padding) / 2);
  margin-right: calc(var(--gap-padding) * 1.5);

  ${columnHeading}

  /* The body paragraphs only: the lead has its own size and spacing. */
  p[data-reveal] {
    max-width: var(--measure);
    margin-top: 1.4em;
    line-height: 1.66;
  }

  /* Stacks where the intro row stacks, so the two grids never disagree. */
  @media (max-width: 720px) {
    width: 100%;
    margin-right: 0;
  }
`;

/* The third intro column, carrying what was built. The hairline between
   items is the Stripe again at item scale. */
export const DescriptionAside = styled.div`
  width: calc(33.333% - var(--gap-padding));

  ${columnHeading}

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    padding: 0.9em 0;
    line-height: 1.66;
  }

  li:first-child {
    padding-top: 0;
  }

  li + li {
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 720px) {
    width: 100%;
    margin-top: 8vw;
  }
`;

/**
 * The lead: the one sentence that is actually typed. Each word is an
 * inline-block wrapper (which carries the caret) around the ink, which is
 * wiped in from the left -- so letters emerge mid-glyph, as they do under a
 * cursor, rather than popping in whole.
 *
 * The spaces between words are plain text outside the spans, so the sentence
 * is one string to find-in-page, to a screen reader and to anyone copying it.
 * Only `clip-path` changes, so lines break exactly where the plain text would
 * and the block never moves.
 */
export const Lead = styled.p`
  max-width: var(--measure);
  margin: 0;
  font-size: clamp(1.55em, 2.3vw, 2.5em);
  line-height: 1.45;

  /* Both stay inline: an inline-block is its own box, and Chrome then hands
     a screen reader one node per word instead of the whole sentence. */
  > span {
    --f: clamp(0, calc(var(--typed) - var(--j, 0)), 1);

    position: relative;
  }

  > span > span {
    clip-path: inset(-0.25em calc((1 - var(--f)) * 100%) -0.25em 0);
  }

  /* The caret rides the wipe: on only while its own word is the one coming
     in, so it runs along the line and is gone once the text is at rest. */
  > span::after {
    width: 0.06em;
    height: 1.05em;
    position: absolute;
    top: 0.2em;
    left: calc(var(--f) * 100%);
    content: '';
    background: var(--color-blue);
    opacity: min(
      clamp(0, calc((var(--typed) - var(--j, 0)) * 24), 1),
      clamp(0, calc((var(--j, 0) + 1 - var(--typed)) * 24), 1)
    );
  }
`;

/* ---- blocks (reference .single-block variants) ---- */

export const Block = styled.section`
  position: relative;
  margin-top: -1px;
  padding-top: var(--section-padding);
  padding-bottom: 0;
  background: var(--block-bg, var(--color-white));

  /* The last block above the footer: some room, so the footer's curve does
     not meet the pictures. As much as the phones leave on the other cases:
     half a section on desktop, where their parallax lifts the lowest phone,
     a whole one below 1024px, where there is no parallax. */
  &[data-last] {
    padding-bottom: calc(var(--section-padding) / 2);

    @media (max-width: 1023px) {
      padding-bottom: var(--section-padding);
    }
  }

  &[data-padding-bottom='true'] {
    padding-bottom: var(--section-padding);
  }
`;

/* styled-components 6.1 does not know the fetchPriority attribute yet and
   warns in development when a styled tag is given it. Every prop is passed on
   exactly as before; this only keeps that warning out of the console. */
export const MediaImage = styled.img.withConfig({
  shouldForwardProp: () => true,
})`
  ${mediaFill}
`;

export const MediaVideo = styled.video`
  ${mediaFill}

  ${({ $contain }) =>
    $contain &&
    css`
      object-fit: contain;
      background: #000;
    `}
`;

/* Previous / next arrows over a laptop screen that holds several media */
export const GalleryButton = styled.button`
  width: 2.75em;
  height: 2.75em;
  position: absolute;
  top: 50%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  cursor: pointer;
  background: rgb(28 29 32 / 70%);
  border: 0;
  border-radius: 50%;
  transition: background-color 0.3s cubic-bezier(0.7, 0, 0.3, 1);
  transform: translateY(-50%);

  &[data-side='previous'] {
    left: 2%;
  }

  &[data-side='next'] {
    right: 2%;
  }

  &:hover,
  &:focus-visible {
    background: var(--color-blue);
  }

  svg {
    width: 38%;
    height: auto;
  }

  @media (max-width: 540px) {
    width: 2.25em;
    height: 2.25em;
  }

  /* On the self-sliding laptop the screen is the control, so its two arrows
     are hidden from the mouse and shown only to a keyboard that tabs to them */
  &[data-quiet] {
    opacity: 0;
    pointer-events: none;
  }

  &[data-quiet]:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const GalleryCount = styled.p`
  position: absolute;
  top: 3%;
  right: 3%;
  z-index: 3;
  padding: 0.2em 0.7em;
  font-size: 0.7em;
  line-height: 1.6;
  color: var(--color-white);
  pointer-events: none;
  background: rgb(28 29 32 / 70%);
  border-radius: 1em;
`;

/* Laptop: the frame box is 56.8% tall; the screen sits at 79.5% x 45.3% */
export const DeviceRow = styled(Row)`
  padding-inline: calc(var(--container-padding) / 2);

  @media (max-width: 540px) {
    padding-inline: 0;
  }
`;

export const Device = styled.div`
  width: 100%;
  position: relative;
`;

export const DeviceFrame = styled.div`
  width: 100%;
  position: relative;
  background: var(--device-frame, none) center / cover no-repeat;

  &::before {
    display: block;
    padding-top: 56.8%;
    content: '';
  }

  /* CSS-drawn MacBook stand-in until a frame image is provided */
  &[data-drawn='true']::after {
    width: 100%;
    height: 7%;
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    background: linear-gradient(#b9bec3, #8f959b);
    border-radius: 0 0 1.5% 1.5% / 0 0 50% 50%;
  }

  &[data-drawn='true'] .lid {
    width: 80.3%;
    height: 93%;
    position: absolute;
    top: 0;
    left: 9.85%;
    background: #1a1c1f;
    border-radius: 1.5% / 2.6%;
    box-shadow: inset 0 0 0 2px #2b2e33;
  }
`;

/* The screen is black and a picture on it is always shown whole: one that is
   not 16:10 gets black bars instead of losing its edges. */
export const DeviceScreen = styled.div`
  width: 79.5%;
  position: absolute;
  top: 45.3%;
  left: 50%;
  overflow: hidden;
  background: #000;
  transform: translate(-50%, -50%);

  &::before {
    display: block;
    padding-top: 62.5%;
    content: '';
  }

  img {
    object-fit: contain;
  }
`;

/* Laptop gallery that slides by itself: one strip, a screen wide per picture
   plus a copy of the first at the end, moved a screen at a time (--slide is
   the position showing). */
export const SliderViewport = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: pointer;
`;

export const SliderStrip = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
  transform: translateX(calc(var(--slide, 0) * -100%));
  will-change: transform;

  /* The jump from the copy of the first picture back to the real one */
  &[data-instant] {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* The other way to change picture: all of them stacked, the one showing
   opaque, cross-fading as it changes. */
export const FadeSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.7s ease;

  &[data-current] {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Slide = styled.div`
  height: 100%;
  position: relative;
  flex: 0 0 100%;
`;

/* A phone in place of the laptop, for an app that only runs on phones (a
   device block with device: 'phone'). Drawn like the laptop: the same dark
   body and edge. --phone-width sets its size, about 80% of the screen's
   height at most; the screen takes the shape of the pictures
   (--screen-ratio, width / height, a 19.5:9 phone until it is known) and is
   filled by each, under a camera island at the top. */
export const PhoneRow = styled(Row)`
  justify-content: center;
`;

export const PhoneDevice = styled.div`
  --phone-width: min(24vw, 38vh, 26em);
  --bezel: calc(var(--phone-width) * 0.032);

  width: var(--phone-width);
  position: relative;
  padding: var(--bezel);
  background: #1a1c1f;
  border-radius: calc(var(--phone-width) * 0.165);
  box-shadow: inset 0 0 0 2px #2b2e33;

  @media (max-width: 1000px) {
    --phone-width: min(40vw, 38vh);
  }

  @media (max-width: 540px) {
    --phone-width: min(62vw, 38vh);
  }
`;

export const PhoneDeviceScreen = styled.div`
  width: 100%;
  aspect-ratio: var(--screen-ratio, 0.4618);
  position: relative;
  background: #000;
  border-radius: calc(var(--phone-width) * 0.133);

  /* The screen's rounded corners clip the pictures */
  > div,
  ${SliderViewport} {
    border-radius: inherit;
  }

  img,
  video {
    object-fit: cover;
  }

  /* The counter sits under the phone, clear of the app's own header */
  ${GalleryCount} {
    top: calc(100% + var(--bezel) + 1.2em);
    right: 50%;
    transform: translateX(50%);
  }
`;

/* A single picture or video, or one with arrows, is clipped here */
export const PhoneDeviceClip = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

/* Inside a phone's status bar: 1.2% to 4.9% of the screen's height */
export const PhoneIsland = styled.div`
  width: calc(var(--phone-width) * 0.27);
  height: calc(var(--phone-width) * 0.075);
  position: absolute;
  top: calc(var(--bezel) + var(--phone-width) * 0.024);
  left: 50%;
  z-index: 4;
  background: #000;
  border-radius: calc(var(--phone-width) * 0.05);
  transform: translateX(-50%);
  pointer-events: none;
`;

/* Plain screenshot (reference .device-nodevice) */
export const PlainRow = styled(Row)`
  padding-inline: var(--container-padding);

  @media (max-width: 540px) {
    padding-inline: 0;
  }
`;

export const PlainScreen = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  background: rgb(100 100 100 / 10%);
  border-radius: 0.3em;

  &::before {
    display: block;
    padding-top: 62.5%;
    content: '';
  }

  /* A screenshot keeps its own shape rather than being cropped to 16:10, so
     a tall page or a wide map is shown whole. Give the media a width and
     height and the box is reserved before the image arrives. */
  &[data-natural='true'] {
    &::before {
      display: none;
    }

    img,
    video {
      height: auto;
      position: relative;
      display: block;
    }
  }
`;

/* Screenshots after the laptop: one row that drifts right to left on a loop
   (useStripMotion moves the track). Each picture keeps its own shape at a
   share of the width a lone screenshot has, so the row is as tall as its
   tallest picture and the shorter ones sit centred in it. There is no
   scrollbar: a sideways scroll or a drag moves the row, and up-and-down
   touches still scroll the page. */
export const StripViewport = styled.div`
  /* STRIP SIZE. --strip-scale is how wide a picture is next to a lone
     screenshot (1 = the same width, 0.72 = about three quarters). No picture
     may be taller than --strip-tallest times that width: a taller one is
     scaled down, shape kept, until it fits. Raise either for a bigger row. */
  --strip-scale: 0.72;
  --strip-tallest: 0.66;

  width: 100%;
  position: relative;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;

  &[data-dragging] {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 2px solid var(--color-blue);
    outline-offset: -2px;
  }
`;

export const StripTrack = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--gap-padding);
  will-change: transform;

  /* The row itself is what gets dragged, not a picture out of it */
  img {
    pointer-events: none;
    user-select: none;
  }
`;

export const StripItem = styled.div`
  --shot-width: calc(
    (min(100%, 100em) - var(--container-padding) * 4) * var(--strip-scale)
  );

  /* --ratio (width / height) comes from the picture; without it there is no
     height limit */
  flex: 0 0
    min(
      var(--shot-width),
      calc(var(--shot-width) * var(--strip-tallest) * var(--ratio, 10))
    );

  /* Phones keep the full column: any narrower and the screens are unreadable */
  @media (max-width: 540px) {
    --shot-width: calc(100% - var(--container-padding) * 2);
  }
`;

/* Full width (reference .block-fullwidth) */
export const FullwidthBlock = styled.section`
  position: relative;
  margin-top: -1px;
  overflow: hidden;
  background: rgb(100 100 100 / 10%);

  &::before {
    display: block;
    padding-top: 66%;
    content: '';
  }

  @media (max-width: 540px) {
    &::before {
      padding-top: 100%;
    }
  }
`;

export const FullwidthMedia = styled(motion.div)`
  width: 100%;
  height: 120%;
  position: absolute;
  top: -10%;
  left: 0;
`;

export const Tint = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--color-dark-dark);
`;

/* Phones (reference .block-mobile-devices) */
export const MobilesBlock = styled.section`
  position: relative;
  margin-top: -1px;
  padding: 0;
  overflow: hidden;
  background: var(--block-bg, var(--color-white));
`;

export const MobilesRow = styled(Row)`
  padding: 0 var(--container-padding);

  &[data-amount='2'] {
    padding: 0 calc(var(--container-padding) * 1.5);
  }

  @media (max-width: 540px) {
    padding: 0;

    &[data-amount='2'] {
      padding: 0 var(--container-padding);
    }
  }
`;

export const MobileCol = styled.div`
  width: 33.333%;
  display: flex;
  justify-content: center;
  padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);

  [data-amount='2'] & {
    width: 50%;
  }

  [data-amount='1'] & {
    width: 100%;
  }
`;

export const Phone = styled(motion.div)`
  width: 68%;
  position: relative;

  [data-amount='2'] & {
    width: 55%;
  }

  [data-amount='1'] & {
    width: 30%;
  }

  @media (max-width: 540px) {
    width: 76%;

    [data-amount='2'] & {
      width: 80%;
    }

    [data-amount='1'] & {
      width: 60%;
    }
  }
`;

export const PhoneScreen = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 0.3em;

  /* The screenshot sets the height, as in the reference's frameless phones */
  img,
  video {
    width: 100%;
    height: auto;
    position: relative;
    display: block;
  }
`;

/* ---- case footer (reference .footer-case-wrap) ---- */

export const NextCase = styled(Link)`
  position: relative;
  display: block;
  padding-bottom: calc(var(--section-padding) / 1.25);
  color: var(--color-white);
  text-align: center;
  text-decoration: none;

  p {
    margin-bottom: calc(var(--section-padding) / 4);
    line-height: 1.66;
  }

  h2 {
    font-size: clamp(3.25em, 7vw, 8em);
    line-height: 1.065;
    transition: var(--animation-primary);
  }

  @media (hover: hover) {
    &:hover h2 {
      opacity: 0.25;
    }

    &:hover img {
      transform: translateY(0);
    }
  }

  @media (max-width: 720px) {
    padding-bottom: 13em;

    &:hover h2 {
      opacity: 1;
    }
  }
`;

export const Tile = styled.div`
  width: calc(clamp(10em, 27.5vw, 25em) * 0.9);
  position: absolute;
  bottom: 0;
  left: 50%;
  z-index: 2;
  overflow: hidden;
  transform: translateX(-50%);

  &::before {
    display: block;
    padding-bottom: 50%;
    content: '';
  }

  .tile-motion {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    width: 100%;
    max-width: none;
    display: block;
    aspect-ratio: 100 / 85;
    object-fit: cover;
    transition: var(--animation-primary);
    transform: translateY(30%);
  }

  @media (max-width: 1000px) {
    width: 40vw;

    img {
      transform: translateY(20%);
    }
  }

  @media (max-width: 720px) {
    width: 50vw;

    img {
      transform: translateY(0);
    }
  }

  @media (max-width: 540px) {
    width: 70vw;

    &::before {
      padding-bottom: 60%;
    }
  }
`;

export const StripeRow = styled(Row)`
  padding-bottom: calc(var(--section-padding) * 0.475);

  @media (max-width: 720px) {
    padding-bottom: var(--section-padding);
  }
`;

export const ButtonRow = styled(Row)`
  justify-content: center;

  a {
    margin-right: 0.5em;
  }

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

  @media (max-width: 720px) {
    padding-bottom: calc(var(--section-padding) / 5);

    a {
      width: 100%;
      margin: 0 0 0.75em;
    }
  }
`;

/* Reference .footer-case-wrap .bottom-footer: shorter top padding */
export const CaseBottom = styled.div`
  > div {
    padding-top: calc(var(--section-padding) / 1.9);
  }
`;

/* ---- "Next case" cursor (reference .mouse-pos-list-btn) ---- */

export const Cursor = styled(motion.div)`
  width: calc(clamp(3.75em, 5.5vw, 5em) * 1.66);
  height: calc(clamp(3.75em, 5.5vw, 5em) * 1.66);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  color: var(--color-white);
  text-align: center;
  pointer-events: none;
  background: var(--color-blue);
  border-radius: 50%;

  span {
    font-size: 1em;
    line-height: 1.6;
  }

  @media (hover: none), (max-width: 540px) {
    display: none;
  }
`;
