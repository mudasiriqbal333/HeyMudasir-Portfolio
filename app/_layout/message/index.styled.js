'use client';

import { styled } from 'styled-components';

import { Socials } from '../contact/bottom.styled';

/* Reference: main#error. One dark screen, at least a screen tall, with the
   slim footer at its foot. Clipped like the reference, so the round button
   cannot widen the page when the mouse pulls it past the right edge of a
   narrow window. */
export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-white);
  background: var(--color-dark);

  @media (max-width: 540px) {
    min-height: 100svh;
  }
`;

/* Reference: header.section.default-header.error-header.full-height. On the
   reference this header is the whole screen and the footer lies over its
   bottom edge; here it takes the screen the footer leaves, which looks the
   same while there is room. Where there is not (a phone held sideways, a
   small phone showing the error page) the page grows and scrolls, instead of
   the footer running across the rule and the buttons as it does on the
   reference. It ends one em under its last part. */
export const Main = styled.main`
  flex: 1 0 auto;
  padding-top: calc(var(--section-padding) * 1.33);
  padding-bottom: 1em;

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) * 1.95);
  }
`;

/* Reference: .flex-col, the box the text and the round button are placed
   against. */
export const Col = styled.div`
  width: 100%;
  position: relative;
`;

/* Reference: .error-header h1. Each line is its own block; from 720px down
   the lines are inline boxes, so two short ones share a line when both fit. */
export const Title = styled.h1`
  font-size: calc(clamp(3.25em, 7vw, 8em) * 0.875);
  line-height: 1.065;

  > span {
    display: block;
  }

  @media (max-width: 720px) {
    > span {
      display: inline-flex;
    }
  }
`;

/* Reference: .error-header p. Top right of the column, level with the first
   line of the title; under the title from 720px down. Two limits are ours.
   On wide screens a long sentence wraps inside the right-hand 40% instead of
   running over the title. On phones the space under the text is the
   reference's section padding, but never less than 5em: the round button
   stands 4.5em above the rule there, and on a short phone (under 667px
   tall) the section padding alone would let it touch the text. */
export const Text = styled.p`
  max-width: 40%;
  position: absolute;
  top: 1em;
  right: 0;
  line-height: 1.66;

  @media (max-width: 720px) {
    max-width: none;
    position: relative;
    top: auto;
    right: auto;
    margin-top: calc(var(--gap-padding) * 1.5);
    margin-bottom: max(var(--section-padding), 5em);
  }
`;

/* Reference: .error-header .stripe */
export const Rule = styled.div`
  height: 1px;
  margin-top: calc(var(--section-padding) * 0.66);
  background: var(--color-border-light);
`;

/* Reference: .error-header .btn-row and its .btn. The round button sits on
   the rule, half its own width in from the right (a fifth on phones). With
   nothing under it, the row keeps the room the lower half of the button
   needs. */
export const ButtonRow = styled.div`
  position: relative;

  &:last-child {
    height: calc(clamp(9em, 12vw, 11em) / 2);
  }
`;

export const ButtonFixed = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;
  transform: translate(-50%, -50%);

  @media (max-width: 720px) {
    transform: translate(-20%, -50%);
  }
`;

/* Not on the reference, which has one button: the second action of the error
   page, an outlined pill under the rule. It keeps the distance the site
   footer keeps between its own rule and its pills, and like those pills it
   fills the row on phones. There it passes under the round button, so the
   distance is never less than the 4.5em the button reaches below the rule
   plus one em (the section padding alone is too little on a screen under
   587px tall). */
export const PillRow = styled.div`
  display: flex;
  padding-top: calc(var(--section-padding) * 0.475);

  @media (max-width: 900px) {
    padding-top: calc(var(--section-padding) * 0.75);
  }

  @media (max-width: 720px) {
    padding-top: max(calc(var(--section-padding) * 1.25), 5.5em);

    > * {
      width: 100%;
    }
  }
`;

/* Reference: #error footer.footer-contact, the slim footer (version, local
   time, socials) at the foot of the screen. */
export const Footer = styled.footer`
  position: relative;
  z-index: 5;
  flex: none;

  /* Reference .container.no-padding > .bottom-footer: no wider than 100em,
     and no space above it. The width is spelled out for the two-row case
     below, where a centred box would otherwise shrink to its content. */
  > div {
    width: 100%;
    max-width: 100em;
    margin: 0 auto;
    padding-top: 0;
  }

  /* As measured on the reference: from 721px to 1023px wide the footer
     stands its own height above the bottom edge (its stylesheet lifts it
     there; from 1024px up its smooth scrolling puts it back on the edge).
     Two equal rows, the second one empty, keep that distance. */
  @media (min-width: 721px) and (max-width: 1023px) {
    display: grid;
    grid-template-rows: 1fr 1fr;
  }

  /* Reference: no social links on phones; their box keeps its padding */
  @media (max-width: 720px) {
    ${Socials} > * {
      display: none;
    }
  }
`;
