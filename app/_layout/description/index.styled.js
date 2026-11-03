'use client';

import { motion } from 'framer-motion';
import { styled } from 'styled-components';

/* Reference: section.home-intro, a 70/30 row in the medium container that
   stacks at 720px with the round button hanging off the bottom right. */

export const Section = styled.section`
  position: relative;
  padding-top: var(--section-padding);
  padding-bottom: calc(var(--section-padding) * 0.66);

  @media (max-width: 720px) {
    padding-bottom: var(--section-padding);
  }
`;

export const Lead = styled.div`
  width: 70%;
  position: relative;
  padding-right: var(--gap-padding);

  @media (max-width: 720px) {
    width: 100%;
    padding-right: 0;
  }
`;

export const Title = styled.h4`
  font-size: clamp(1.55em, 2.3vw, 2.5em);
  line-height: 1.45;
`;

/* Reference .span-lines: each word is clipped by its own line box */
export const Word = styled.span`
  position: relative;
  display: inline-flex;
  overflow: hidden;

  > span {
    position: relative;
    display: block;
  }
`;

export const Aside = styled.div`
  width: 30%;
  position: relative;
  padding-left: var(--gap-padding);

  @media (max-width: 720px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: calc(var(--section-padding) / 2) 0 0;
  }
`;

export const TextWrap = styled(motion.div)`
  p {
    max-width: 14em;
    padding-top: 0.5em;
    margin-bottom: 6em;
    font-size: 1em;
    line-height: 1.66;
  }

  @media (max-width: 720px) {
    width: 100%;

    p {
      padding-top: 0;
      margin-bottom: calc(var(--section-padding) * 0.66);
    }
  }

  /* Below 360px the reference button would cover the end of the text, so
     keep at least half its height (4.5em) clear under the paragraph. */
  @media (max-width: 359.98px) {
    p {
      margin-bottom: max(calc(var(--section-padding) * 0.66), 4.5em);
    }
  }
`;

/* Top at 80% of the row on wide screens; on narrow ones centred on the
   bottom edge, a fifth of its width in from the right, so it sits below the
   side text instead of over it. */
export const ButtonSlot = styled.div`
  position: absolute;
  top: 80%;
  z-index: 20;

  @media (max-width: 720px) {
    top: auto;
    right: 0;
    bottom: 0;
    transform: translate(-20%, 50%);
  }
`;
