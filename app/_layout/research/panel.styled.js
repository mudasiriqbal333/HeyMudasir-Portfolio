'use client';

import { styled } from 'styled-components';

import { LiveButton } from '../case/index.styled';

/* ---- the claims panel: every claim as a dot ---- */

/* Below the header's columns, as the hero sits below a case page's. */
export const PanelSection = styled.section`
  position: relative;
  margin-top: -1px;
  padding-bottom: calc(var(--section-padding) / 2);

  @media (max-width: 540px) {
    padding-bottom: calc(var(--section-padding) / 3);
  }
`;

/* The case pages' round button, lifted a little less on a phone: the header
   above has a longer line (the institution) that it would otherwise touch,
   so it sits beside the last, short one. */
export const PaperButton = styled(LiveButton)`
  @media (max-width: 720px) {
    transform: translate(-10vw, -115%);
  }
`;

/* The dark panel. --step is the delay between neighbouring dots: slow for
   the first reveal, quick once it has settled, so a change of view sweeps
   across the panel without keeping anyone waiting. */
export const Panel = styled.figure`
  --panel-green: #3fcf8e;
  --panel-yellow: #f5c542;
  --panel-red: #ff5f5f;
  --step: 14ms;

  position: relative;
  margin: 0;
  padding: clamp(1.5em, 3.5vw, 3.25em);
  color: var(--color-white);
  background: var(--color-dark);

  &[data-settled] {
    --step: 5ms;
  }
`;

export const PanelHead = styled.div`
  max-width: calc(100% - clamp(5em, 9vw, 8em));

  p {
    margin: 0 0 0.6em;
    font-size: 0.6em;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.4em, 2.2vw, 2.25em);
    font-weight: 450;
    line-height: 1.2;
  }
`;

/* The supported claims and the hallucinated ones side by side, in columns
   of one size (30 and 6 of them), so every dot is the same size. */
export const Fields = styled.div`
  display: grid;
  grid-template-columns: 30fr 6fr;
  gap: clamp(1.25em, 3vw, 2.75em);
  margin-top: clamp(1.75em, 3vw, 2.75em);

  @media (max-width: 540px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Field = styled.div`
  min-width: 0;
`;

/* The label over its count in both fields, so the two grids of dots start
   level; side by side once the fields are stacked on a phone. */
export const FieldHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  margin-bottom: 1em;
  font-size: 0.8em;
  white-space: nowrap;

  span:first-child {
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  span:last-child {
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 540px) {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 1em;
  }
`;

export const Dots = styled.div`
  --cols: 30;

  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: clamp(3px, 0.45vw, 8px);

  &[data-field='errors'] {
    --cols: 6;
  }

  @media (max-width: 540px) {
    --cols: 18;

    &[data-field='errors'] {
      --cols: 18;
    }
  }
`;

/* One claim. Hidden until the panel is revealed; then, under a detector,
   what it flags keeps a white ring and the rest step back. */
export const Dot = styled.span`
  aspect-ratio: 1;
  position: relative;
  display: block;
  cursor: pointer;
  background: var(--panel-green);
  border-radius: 50%;
  opacity: 0;
  transition:
    opacity 0.45s ease,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s ease;
  transition-delay: calc(var(--d, 0) * var(--step));
  transform: scale(0.3);

  &[data-gold='y'] {
    background: var(--panel-yellow);
  }

  &[data-gold='r'] {
    background: var(--panel-red);
  }

  [data-ready] & {
    opacity: 1;
    transform: none;
  }

  [data-ready][data-mode='detector'] & {
    opacity: 0.18;
  }

  [data-ready][data-mode='detector'] &[data-flag] {
    opacity: 1;
    box-shadow: 0 0 0 2px var(--color-white);
    transform: scale(1.12);
  }

  &[data-hovered] {
    box-shadow: 0 0 0 2px var(--color-white);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Controls = styled.figcaption`
  margin-top: clamp(1.75em, 3vw, 2.75em);
  padding-top: 1.5em;
  border-top: 1px solid var(--color-border-light);
`;

export const Views = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
`;

export const Caption = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5em 2em;
  margin-top: 1.25em;
  line-height: 1.5;

  p {
    max-width: 36em;
    margin: 0;
    opacity: 0.75;
  }

  p + p {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    opacity: 1;
  }
`;

export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em 1.5em;
  margin: 1.25em 0 0;
  padding: 0;
  font-size: 0.8em;
  list-style: none;
  opacity: 0.75;

  li {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  i {
    width: 0.75em;
    height: 0.75em;
    display: block;
    background: var(--panel-green);
    border-radius: 50%;
  }

  i[data-gold='y'] {
    background: var(--panel-yellow);
  }

  i[data-gold='r'] {
    background: var(--panel-red);
  }

  i[data-ring] {
    background: none;
    box-shadow: inset 0 0 0 2px var(--color-white);
  }
`;

/* What a claim is and what each detector said, over the dot it belongs
   to (under it near the top of the panel). */
export const Tip = styled.div`
  width: min(21em, calc(100% - 2em));
  position: absolute;
  z-index: 4;
  padding: 1.1em 1.2em 1em;
  font-size: 0.8em;
  line-height: 1.5;
  color: var(--color-dark);
  pointer-events: none;
  background: var(--color-white);
  border-radius: 0.6em;
  box-shadow: 0 1.5em 3em rgb(0 0 0 / 35%);
  transform: translate(-50%, calc(-100% - 0.9em));

  &[data-below] {
    transform: translate(-50%, 0.9em);
  }

  [data-meta] {
    margin: 0;
    font-size: 0.85em;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  [data-claim] {
    margin: 0.5em 0 0.9em;
    font-size: 1.15em;
    line-height: 1.4;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.3em 1em;
    margin: 0;
    padding-top: 0.8em;
    border-top: 1px solid var(--color-border);
  }

  dt {
    opacity: 0.55;
  }

  dd {
    display: flex;
    align-items: center;
    gap: 0.45em;
    margin: 0;
  }
`;

/* A label's colour, as a small dot before its name. */
export const Chip = styled.i`
  width: 0.7em;
  height: 0.7em;
  display: inline-block;
  background: var(--label-green);
  border-radius: 50%;

  &[data-label='y'] {
    background: var(--label-yellow);
  }

  &[data-label='r'] {
    background: var(--label-red);
  }
`;
