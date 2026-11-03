'use client';

import { css, styled } from 'styled-components';

import { Row, Stripe } from '@/components';

/* ---- the page and its sections ---- */

/* The research colours. The three labels as they read on white (a touch
   darker than on the dark claims panel) and one colour per judge family, as
   in the dissertation's figures: blue, orange and teal. */
export const Page = styled.main`
  --label-green: #23a065;
  --label-yellow: #e0a810;
  --label-red: #e5484d;
  --judge-llama: var(--color-blue);
  --judge-qwen: #ee8434;
  --judge-gemma: #1f9e98;

  color: var(--color-dark);
  background: var(--color-white);
`;

/* A full section, white or light grey (data-tone="gray"). */
export const Section = styled.section`
  position: relative;
  margin-top: -1px;
  padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);
  background: var(--color-white);

  &[data-tone='gray'] {
    background: var(--color-lightgray);
  }
`;

/* Small uppercase label over a stripe, as over the case pages' columns. */
export const Label = styled.div`
  h2,
  h3 {
    margin: 0;
    font-size: 0.6em;
    font-weight: inherit;
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

/* A section's big heading, the size of the About page's "I can help you". */
export const Heading = styled.h2`
  max-width: 14em;
  margin: 0;
  font-size: calc(clamp(3.25em, 5vw, 4.5em) * 0.75);
  font-weight: 450;
  line-height: 1.065;
  text-wrap: balance;
`;

/* The paragraph under a heading. */
export const Intro = styled.p`
  max-width: 32em;
  margin: 1.5em 0 0;
  line-height: 1.66;
`;

/* Heading on the left and its paragraph on the right, from 1000px up. */
export const HeadingRow = styled(Row)`
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5em var(--gap-padding);
  padding-bottom: calc(var(--section-padding) / 2);

  ${Intro} {
    margin: 0;
  }

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

/* ---- header ---- */

export const Header = styled.header`
  padding-top: calc(var(--section-padding) * 1.33);
  padding-bottom: 0;

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) * 1.95);
  }
`;

export const Title = styled.h1`
  max-width: 11em;
  margin: 0;
  font-size: calc(clamp(3.25em, 7vw, 8em) * 0.875);
  font-weight: 450;
  line-height: 1.065;
  text-wrap: balance;
`;

export const Subtitle = styled.p`
  max-width: 22em;
  margin: 0.9em 0 0;
  font-size: clamp(1.25em, 2vw, 2em);
  line-height: 1.3;
  color: var(--color-gray);
`;

/* ---- numbers ---- */

export const Numbers = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--gap-padding);

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: calc(var(--gap-padding) * 1.5);
  }

  @media (max-width: 540px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const NumberItem = styled.div`
  ${Stripe} {
    margin-bottom: 1.6em;
  }

  p {
    max-width: 17em;
    margin: 1em 0 0;
    line-height: 1.66;
  }
`;

/* The figure itself: the counted part large, what follows it a size down. */
export const Figure = styled.div`
  font-size: clamp(3.25em, 5.5vw, 6em);
  font-weight: 450;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  span {
    font-size: 0.5em;
    letter-spacing: 0;
    opacity: 0.45;
  }
`;

/* ---- research questions ---- */

export const Questions = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Question = styled.li`
  display: grid;
  grid-template-columns: 6em minmax(0, 1fr) minmax(0, 1fr);
  gap: 1em var(--gap-padding);
  padding: 2.25em 0;
  border-top: 1px solid var(--color-border);

  &:last-child {
    border-bottom: 1px solid var(--color-border);
  }

  [data-no] {
    margin: 0.35em 0 0;
    font-size: 0.8em;
    letter-spacing: 0.05em;
    opacity: 0.5;
  }

  h3 {
    margin: 0;
    font-size: clamp(1.35em, 1.9vw, 2em);
    font-weight: 450;
    line-height: 1.3;
  }

  p:last-child {
    margin: 0;
    line-height: 1.66;
  }

  @media (max-width: 1000px) {
    grid-template-columns: 4em minmax(0, 1fr);

    p:last-child {
      grid-column: 2;
    }
  }

  @media (max-width: 540px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 1.75em 0;

    p:last-child {
      grid-column: 1;
    }
  }
`;

/* ---- implications, limitations and next steps ---- */

export const Implications = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--gap-padding) * 1.75) calc(var(--gap-padding) * 1.5);

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Implication = styled.div`
  [data-no] {
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
    font-weight: 450;
    line-height: 1.3;
  }

  p:last-child {
    max-width: 28em;
    margin: 0;
    padding-top: 1.25em;
    line-height: 1.66;
  }

  @media (max-width: 720px) {
    [data-no] {
      padding-bottom: 1.25em;
    }

    ${Stripe} {
      margin-bottom: 1.25em;
    }
  }
`;

const list = css`
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
`;

export const Lists = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--gap-padding) * 1.5);
  padding-top: var(--section-padding);

  > div {
    ${list}
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
    gap: calc(var(--gap-padding) * 1.75);
  }
`;

/* ---- the paper ---- */

export const PaperRow = styled(Row)`
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--gap-padding) * 1.5);

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PaperText = styled.div`
  max-width: 36em;

  p {
    margin: 1.5em 0 0;
    line-height: 1.66;
  }

  [data-meta] {
    margin-top: 1em;
    font-size: 0.8em;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }
`;
