'use client';

import { styled } from 'styled-components';

/* ---- the pipeline (the dissertation's figure 1) ---- */

/* Three stages, each a row: its letter and name, then its steps joined by
   arrows. Steps rise in one after another and each arrow draws itself once
   the stage comes into view (data-in), --i being the step's place. */
export const Pipeline = styled.div`
  display: grid;
  gap: clamp(1.25em, 2.5vw, 2em);
`;

export const Stage = styled.div`
  display: grid;
  grid-template-columns: 13em minmax(0, 1fr);
  gap: 1.5em;
  align-items: center;
  padding: clamp(1.1em, 2vw, 1.6em);
  background: rgb(255 255 255 / 55%);
  border-radius: 0.9em;

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25em;
  }
`;

export const StageName = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.9em;

  [data-letter] {
    width: 2.2em;
    height: 2.2em;
    display: grid;
    flex: none;
    place-items: center;
    font-size: 0.85em;
    color: var(--color-white);
    background: var(--color-dark);
    border-radius: 50%;
  }

  h3 {
    margin: 0;
    font-size: 1.15em;
    font-weight: 450;
    line-height: 1.3;
  }

  p {
    margin: 0.2em 0 0;
    font-size: 0.8em;
    line-height: 1.4;
    opacity: 0.55;
  }
`;

export const Steps = styled.ol`
  --gap: 1.6em;

  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: var(--gap);
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 840px) {
    --gap: 1.4em;

    grid-auto-flow: row;
  }
`;

export const Step = styled.li`
  position: relative;
  padding: 0.85em 0.95em 0.9em;
  background: var(--color-white);
  border-radius: 0.6em;
  box-shadow: 0 1px 0 rgb(28 29 32 / 6%);
  opacity: 0;
  transition:
    opacity 0.6s ease,
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--i, 0) * 110ms);
  transform: translateY(0.75em);

  [data-in] & {
    opacity: 1;
    transform: none;
  }

  &[data-out] {
    color: var(--color-white);
    background: var(--color-dark);
  }

  h4 {
    margin: 0;
    padding-right: 2.5em;
    font-size: 0.9em;
    font-weight: 450;
    line-height: 1.3;
  }

  p {
    margin: 0.35em 0 0;
    font-size: 0.72em;
    line-height: 1.4;
    opacity: 0.6;
  }

  [data-llm] {
    position: absolute;
    top: 0.85em;
    right: 0.75em;
    padding: 0.15em 0.5em;
    font-size: 0.55em;
    letter-spacing: 0.06em;
    color: var(--color-white);
    background: var(--color-blue);
    border-radius: 1em;
  }

  /* The arrow to the next step, drawn from its tail once in view */
  &:not(:last-child)::after {
    width: var(--gap);
    height: 1px;
    position: absolute;
    top: 50%;
    left: 100%;
    content: '';
    background: currentcolor;
    opacity: 0.4;
    transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 110ms + 250ms);
    transform: scaleX(0);
    transform-origin: left;
  }

  &[data-out]:not(:last-child)::after {
    background: var(--color-dark);
  }

  [data-in] &:not(:last-child)::after {
    transform: none;
  }

  @media (max-width: 840px) {
    &:not(:last-child)::after {
      width: 1px;
      height: var(--gap);
      top: 100%;
      left: 1.5em;
      transform: scaleY(0);
      transform-origin: top;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::after {
      transition: none;
    }
  }
`;

/* ---- the three labels ---- */

export const Labels = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap-padding);

  @media (max-width: 840px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const LabelCard = styled.div`
  --tone: var(--label-green);

  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: clamp(1.25em, 2.2vw, 1.9em);
  background: var(--color-white);
  border-top: 0.3em solid var(--tone);
  border-radius: 0.6em;

  &[data-label='y'] {
    --tone: var(--label-yellow);
  }

  &[data-label='r'] {
    --tone: var(--label-red);
  }

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1em;
  }

  h4 {
    margin: 0;
    font-size: clamp(1.35em, 1.9vw, 1.9em);
    font-weight: 450;
    line-height: 1.2;
  }

  header span {
    font-size: 0.8em;
    white-space: nowrap;
    opacity: 0.55;
  }

  p {
    flex: 1;
    margin: 0;
    line-height: 1.6;
  }

  footer {
    display: flex;
    align-items: center;
    gap: 0.6em;
    font-size: 0.8em;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  footer i {
    width: 0.8em;
    height: 0.8em;
    display: block;
    background: var(--tone);
    border-radius: 50%;
  }
`;

/* ---- the five systems ---- */

export const Systems = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1em;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const System = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: 1.3em 1.25em 1.25em;
  background: var(--color-white);
  border-radius: 0.6em;

  [data-key] {
    font-size: 0.75em;
    letter-spacing: 0.06em;
    opacity: 0.5;
  }

  h4 {
    margin: 0;
    font-size: 1.25em;
    font-weight: 450;
    line-height: 1.2;
  }

  [data-tool] {
    flex: none;
    margin: 0;
    font-size: 0.8em;
    opacity: 0.55;
  }

  p {
    flex: 1;
    margin: 0.2em 0 0;
    font-size: 0.9em;
    line-height: 1.55;
  }

  [data-calls] {
    align-self: flex-start;
    margin-top: 0.4em;
    padding: 0.35em 0.8em;
    font-size: 0.72em;
    letter-spacing: 0.04em;
    background: var(--color-lightgray);
    border-radius: 1em;
  }
`;

/* A heading inside the method section, between its three parts. */
export const SubHeading = styled.h3`
  max-width: 22em;
  margin: 0;
  padding: var(--section-padding) 0 calc(var(--section-padding) / 3);
  font-size: clamp(1.55em, 2.3vw, 2.5em);
  font-weight: 450;
  line-height: 1.25;

  span {
    display: block;
    margin-top: 0.4em;
    font-size: 0.5em;
    line-height: 1.6;
    opacity: 0.6;
  }
`;
