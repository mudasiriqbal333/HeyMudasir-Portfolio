'use client';

import { styled } from 'styled-components';

/* Reference: .bottom-footer */
export const Bottom = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: calc(var(--section-padding) / 1.3) calc(var(--gap-padding) / 1.33)
    calc(var(--gap-padding) / 1.75) var(--gap-padding);

  h3 {
    margin-bottom: 1.5em;
    font-size: 0.6em;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 0.85em;
    line-height: 1.66;
  }

  time {
    text-transform: uppercase;
  }

  @media (max-width: 720px) {
    padding: 5vh 0 calc(var(--gap-padding) / 1.75);

    p {
      font-size: 1em;
    }
  }
`;

export const Credits = styled.div`
  display: flex;
  justify-content: space-between;

  > div:first-child {
    padding-right: var(--gap-padding);
  }

  @media (max-width: 720px) {
    width: 100%;
    order: 3;
    padding: 0 var(--container-padding) calc(var(--gap-padding) * 0.75);
  }
`;

export const Socials = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin-bottom: 1em;
    padding-left: calc(var(--gap-padding) * 0.5);
  }

  ul {
    display: flex;
  }

  li {
    display: inline-flex;
    font-size: 0.85em;
  }

  /* The li is 0.85em, so undo that scale to keep the reference 14.4px gap */
  li a {
    height: 2.25em;
    margin: 0 calc(var(--gap-padding) / 3 / 0.85);
  }

  @media (max-width: 720px) {
    width: 100%;
    padding: 0 calc(var(--container-padding) - var(--gap-padding) * 0.333)
      calc(var(--section-padding) / 3);

    ul {
      width: 100%;
    }

    li {
      font-size: 1em;
    }
  }
`;

export const BottomStripe = styled.div`
  width: calc(100% - var(--gap-padding) * 0.666);
  height: 1px;
  display: none;
  margin-top: var(--gap-padding);
  margin-left: calc(var(--gap-padding) * 0.333);
  background: var(--color-border-light);

  @media (max-width: 720px) {
    display: block;
  }
`;
