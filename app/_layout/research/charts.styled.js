'use client';

import { styled } from 'styled-components';

/* Every chart draws itself the first time it comes into view: the figure
   gets data-in, and each part moves from its resting state, --i being its
   place in the order. --label is the width of the row names and --room the
   space kept right of the scale for the values. */
export const Chart = styled.figure`
  --label: 9.5em;
  --room: 6.5em;

  margin: 0;

  figcaption {
    max-width: 40em;
    margin-top: 1.75em;
    font-size: 0.8em;
    line-height: 1.5;
    opacity: 0.55;
  }
`;

export const ChartLegend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em 1.4em;
  margin: 0 0 1.75em;
  padding: 0;
  font-size: 0.8em;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  i {
    width: 0.8em;
    height: 0.8em;
    display: block;
    background: var(--c);
    border-radius: 0.2em;
  }

  i[data-dot] {
    border-radius: 50%;
  }
`;

/* ---- bars ---- */

export const BarRows = styled.div`
  display: grid;
  gap: 1.25em;
`;

export const BarRow = styled.div`
  display: grid;
  grid-template-columns: var(--label) minmax(0, 1fr);
  gap: 1em;
  align-items: center;

  @media (max-width: 540px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.55em;
  }
`;

export const RowLabel = styled.div`
  font-size: 0.9em;
  line-height: 1.3;

  [data-key],
  [data-sub] {
    display: block;
    font-size: 0.75em;
    opacity: 0.5;
  }

  [data-key] {
    letter-spacing: 0.05em;
  }

  [data-sub] {
    margin-top: 0.2em;
  }
`;

/* The bars' track: a gridline at every quarter of the scale and one at its
   end, all under the bars and their values, with the room on the right left
   clear for the values. */
export const Track = styled.div`
  display: grid;
  gap: 5px;
  padding: 0.2em var(--room) 0.2em 0;
  background-image: linear-gradient(
      to right,
      var(--color-border) 1px,
      transparent 1px
    ),
    linear-gradient(to left, var(--color-border) 1px, transparent 1px);
  background-repeat: repeat, no-repeat;
  background-clip: content-box;
  background-origin: content-box;
  background-size:
    25% 100%,
    100% 100%;
`;

export const Bar = styled.div`
  --v: 0;

  height: 0.9em;
  position: relative;

  &::before {
    width: calc(var(--v) * 100%);
    min-width: 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    content: '';
    background: var(--c, var(--color-dark));
    border-radius: 0 0.2em 0.2em 0;
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 70ms);
    transform: scaleX(0);
    transform-origin: left;
  }

  [data-in] &::before {
    transform: none;
  }

  span {
    position: absolute;
    top: 50%;
    left: calc(var(--v) * 100% + 0.6em);
    font-size: 0.75em;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.5s ease;
    transition-delay: calc(var(--i, 0) * 70ms + 450ms);
    transform: translateY(-50%);
  }

  [data-in] & span {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    span {
      transition: none;
    }
  }
`;

/* The scale under a chart's rows, in step with their tracks */
export const Axis = styled.div`
  display: grid;
  grid-template-columns: var(--label) minmax(0, 1fr);
  gap: 1em;
  margin-top: 0.75em;

  > div {
    display: flex;
    justify-content: space-between;
    padding-right: var(--room);
  }

  span {
    width: 0;
    display: flex;
    justify-content: center;
    font-size: 0.7em;
    white-space: nowrap;
    opacity: 0.5;
  }

  @media (max-width: 540px) {
    grid-template-columns: minmax(0, 1fr);

    > div:first-child {
      display: none;
    }
  }
`;

/* ---- the span detector's threshold sweep ---- */

/* One column per threshold, under the dashed line every column should
   reach: one flag per hallucinated claim. */
export const Sweep = styled.div`
  height: 11em;
  position: relative;
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 0.75em;
  margin-top: 2.5em;
  border-bottom: 1px solid var(--color-dark);

  &::before {
    height: 0;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    content: '';
    border-top: 1px dashed var(--label-red);
    transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform: scaleX(0);
    transform-origin: left;
  }

  [data-in] &::before {
    transform: none;
  }

  [data-target] {
    position: absolute;
    bottom: calc(100% + 0.7em);
    left: 0;
    font-size: 0.75em;
    color: var(--label-red);
    opacity: 0;
    transition: opacity 0.5s ease 0.5s;
  }

  [data-in] & [data-target] {
    opacity: 1;
  }

  [data-col] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4em;
  }

  [data-col] span {
    font-size: 0.8em;
    opacity: 0;
    transition: opacity 0.5s ease;
    transition-delay: calc(var(--i, 0) * 60ms + 800ms);
  }

  [data-col] i {
    width: min(100%, 2.5em);
    height: calc(var(--v) * 100%);
    display: block;
    background: var(--color-dark);
    border-radius: 0.2em 0.2em 0 0;
    transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 60ms + 500ms);
    transform: scaleY(0);
    transform-origin: bottom;
  }

  [data-col][data-used] i {
    background: var(--color-blue);
  }

  [data-in] & [data-col] span {
    opacity: 1;
  }

  [data-in] & [data-col] i {
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    [data-target],
    [data-col] span,
    [data-col] i {
      transition: none;
    }
  }
`;

export const SweepAxis = styled.div`
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 0.75em;
  margin-top: 0.6em;

  span {
    font-size: 0.7em;
    line-height: 1.3;
    text-align: center;
    opacity: 0.5;
  }

  span[data-used] {
    color: var(--color-blue);
    opacity: 1;
  }

  small {
    display: block;
    font-size: 0.9em;
  }
`;

/* ---- Venn diagrams ---- */

export const Venns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gap-padding);

  @media (max-width: 540px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Venn = styled.div`
  text-align: center;

  h4 {
    margin: 0 0 1em;
    font-size: 0.8em;
    font-weight: inherit;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.55;
  }

  svg {
    width: 100%;
    max-width: 21em;
    height: auto;
    display: block;
    margin: 0 auto;
    overflow: visible;
  }

  circle {
    fill: var(--c);
    fill-opacity: 0.12;
    stroke: var(--c);
    stroke-width: 1.5;
    transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 160ms);
    transform: scale(0);
    transform-box: fill-box;
    transform-origin: center;
  }

  text {
    font-size: 16px;
    font-weight: 450;
    fill: currentcolor;
    text-anchor: middle;
    dominant-baseline: central;
    opacity: 0;
    transition: opacity 0.5s ease 0.8s;
  }

  text[data-name] {
    font-size: 12px;
    font-weight: inherit;
    fill: var(--c);
  }

  text[data-zero] {
    fill-opacity: 0.35;
  }

  p {
    margin: 1em 0 0;
    font-size: 0.8em;
    opacity: 0.55;
  }

  [data-in] & circle {
    transform: none;
  }

  [data-in] & text {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    circle,
    text {
      transition: none;
    }
  }
`;

/* ---- dumbbells: one value, then another ---- */

export const Dumbbell = styled.div`
  --from: 0;
  --to: 0;

  height: 1.8em;
  position: relative;
  margin-right: var(--room);
  background-image: linear-gradient(
    to right,
    var(--color-border) 1px,
    transparent 1px
  );
  background-size: 25% 100%;
  box-shadow: 1px 0 0 var(--color-border);

  [data-line] {
    width: calc((var(--to) - var(--from)) * 100%);
    height: 2px;
    position: absolute;
    top: 50%;
    left: calc(var(--from) * 100%);
    background: var(--color-blue);
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 90ms + 200ms);
    transform: translateY(-50%) scaleX(0);
    transform-origin: left;
  }

  [data-dot] {
    width: 0.95em;
    height: 0.95em;
    position: absolute;
    top: 50%;
    left: calc(var(--from) * 100%);
    background: var(--color-gray);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  [data-dot='to'] {
    z-index: 1;
    background: var(--color-blue);
    transition: left 1s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 90ms + 200ms);
  }

  [data-value] {
    position: absolute;
    top: 50%;
    font-size: 0.75em;
    white-space: nowrap;
    transform: translateY(-50%);
  }

  [data-value='from'] {
    right: calc((1 - var(--from)) * 100% + 1.1em);
    opacity: 0.55;
  }

  [data-value='to'] {
    left: calc(var(--to) * 100% + 1.1em);
    color: var(--color-blue);
    opacity: 0;
    transition: opacity 0.5s ease;
    transition-delay: calc(var(--i, 0) * 90ms + 900ms);
  }

  [data-in] & [data-line] {
    transform: translateY(-50%);
  }

  [data-in] & [data-dot='to'] {
    left: calc(var(--to) * 100%);
  }

  [data-in] & [data-value='to'] {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-line],
    [data-dot='to'],
    [data-value='to'] {
      transition: none;
    }
  }
`;

/* ---- the error taxonomy ---- */

export const Kinds = styled.div`
  display: grid;
  gap: 1.6em;
`;

export const Kind = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 13em) minmax(0, 1fr) 6.5em;
  gap: 0.6em 1.25em;
  align-items: center;

  h4 {
    margin: 0;
    font-size: 0.95em;
    font-weight: 450;
    line-height: 1.3;
  }

  p {
    margin: 0.2em 0 0;
    font-size: 0.75em;
    line-height: 1.4;
    opacity: 0.55;
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr) 6.5em;

    > div:first-child {
      grid-column: 1 / -1;
    }
  }
`;

/* Red and yellow claims of one kind, the most common kind filling the
   track */
export const Stack = styled.div`
  width: calc(var(--total) / var(--most) * 100%);
  height: 1.7em;
  display: flex;
  overflow: hidden;
  border-radius: 0.25em;
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--i, 0) * 80ms);
  transform: scaleX(0);
  transform-origin: left;

  [data-in] & {
    transform: none;
  }

  span {
    display: grid;
    flex: var(--n) 0 0;
    place-items: center;
    font-size: 0.7em;
    color: var(--color-white);
    background: var(--label-red);
  }

  span[data-label='y'] {
    color: var(--color-dark);
    background: var(--label-yellow);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* How many of a kind any system caught, over a bar of the share */
export const Caught = styled.div`
  font-size: 0.75em;
  line-height: 1.3;
  white-space: nowrap;

  i {
    height: 3px;
    display: block;
    margin-top: 0.5em;
    overflow: hidden;
    background: var(--color-lightgray);
    border-radius: 2px;
  }

  i::before {
    width: calc(var(--share) * 100%);
    height: 100%;
    display: block;
    content: '';
    background: var(--color-blue);
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 80ms + 400ms);
    transform: scaleX(0);
    transform-origin: left;
  }

  [data-in] & i::before {
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    i::before {
      transition: none;
    }
  }
`;

/* ---- number cards ---- */

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1em;
  margin-top: 2.25em;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Stat = styled.div`
  padding: 1.3em 1.25em 1.25em;
  background: var(--color-lightgray);
  border-radius: 0.6em;

  h4 {
    margin: 0;
    font-size: 0.7em;
    font-weight: inherit;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.55;
  }

  [data-figure] {
    margin: 0.45em 0 0;
    font-size: clamp(1.75em, 2.4vw, 2.4em);
    font-weight: 450;
    line-height: 1.1;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  [data-figure] small {
    margin-left: 0.1em;
    font-size: 0.55em;
    opacity: 0.45;
  }

  p:not([data-figure]) {
    margin: 0.6em 0 0;
    font-size: 0.8em;
    line-height: 1.5;
    opacity: 0.65;
  }
`;

/* ---- the cascade against a judge on every claim ---- */

export const CascadeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;

  /* Every cell at the table's own size, so the gaps between the columns
     match; the text inside carries its size. */
  th,
  td {
    padding: 1.1em 0;
    text-align: left;
    vertical-align: baseline;
  }

  th:not(:first-child),
  td:not(:first-child) {
    padding-left: 1.25em;
  }

  thead th {
    padding-top: 0;
    font-size: 0.7em;
    font-weight: inherit;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.55;
  }

  thead th:not(:first-child) {
    padding-left: calc(1.25em / 0.7);
  }

  tbody tr {
    border-top: 1px solid var(--color-border);
  }

  tbody tr:last-child {
    border-bottom: 1px solid var(--color-border);
  }

  tbody th {
    width: 38%;
    font-weight: inherit;
  }

  tbody th span {
    display: block;
    margin-top: 0.3em;
    font-size: 0.75em;
    opacity: 0.55;
  }

  tbody td span {
    font-size: clamp(1.35em, 2vw, 2em);
    font-weight: 450;
    line-height: 1.1;
    white-space: nowrap;
  }

  td[data-from] {
    opacity: 0.4;
  }

  td[data-to] {
    opacity: 0;
    transition:
      opacity 0.6s ease,
      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 140ms + 300ms);
    transform: translateX(-0.5em);
  }

  td[data-tone='gain'] {
    color: var(--color-blue);
  }

  td[data-tone='loss'] {
    color: var(--label-red);
  }

  [data-in] & td[data-to] {
    opacity: 1;
    transform: none;
  }

  @media (max-width: 540px) {
    tbody th {
      width: 34%;
      font-size: 0.85em;
    }

    tbody td span {
      font-size: 1.2em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    td[data-to] {
      transition: none;
    }
  }
`;

/* ---- one result: its words on the left, its chart on the right ---- */

export const Result = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: calc(var(--gap-padding) * 1.5);
  padding: calc(var(--section-padding) / 2) 0;
  border-top: 1px solid var(--color-border);

  &:last-child {
    padding-bottom: 0;
  }

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.25em;
  }
`;

export const ResultText = styled.div`
  [data-no] {
    margin: 0;
    font-size: 0.8em;
    letter-spacing: 0.05em;
    opacity: 0.5;
  }

  h3 {
    max-width: 14em;
    margin: 0.6em 0 0;
    font-size: clamp(1.55em, 2.3vw, 2.5em);
    font-weight: 450;
    line-height: 1.2;
    text-wrap: balance;
  }

  p:not([data-no]) {
    max-width: 30em;
    margin: 1.25em 0 0;
    line-height: 1.66;
  }
`;
