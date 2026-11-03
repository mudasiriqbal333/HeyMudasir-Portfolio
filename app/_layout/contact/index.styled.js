'use client';

import { motion } from 'framer-motion';
import { styled } from 'styled-components';

import { ContainerMedium, Row } from '@/components';

/* Reference: .footer-rounded-div + .rounded-div-wrap/.rounded-div */
export const Lip = styled.div`
  width: 100%;
  height: 0;
  position: relative;
  z-index: 2;
  display: block;
`;

export const LipWrap = styled(motion.div)`
  width: 100%;
  height: 10vh;
  position: relative;
  top: 0;
  overflow: hidden;
  transform: translateY(-1px);

  @media (max-width: 720px) {
    height: 7.5vh;
  }
`;

export const LipShape = styled.div`
  width: 150%;
  height: 750%;
  position: absolute;
  left: 50%;
  z-index: 1;
  display: block;
  background: var(--footer-lip, hsl(var(--background)));
  border-radius: 50%;
  transform: translate(-50%, -86.666%);
`;

/* Reference: .footer-wrap (overflow hidden, darker ground behind the parallax) */
export const Wrap = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: var(--color-dark-dark);
  box-shadow: 0 5px 0 5px var(--color-dark);
`;

/* Reference: .overlay-gradient, softens content rising under the lip */
export const Shade = styled.div`
  width: 100%;
  height: calc(var(--section-padding) * 0.75);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgb(28 29 32 / 100%),
    rgb(28 29 32 / 0%)
  );
  opacity: 0.75;
`;

/* Reference: footer.section.footer */
export const Inner = styled(motion.footer)`
  width: 100%;
  padding-top: var(--section-padding);
  color: var(--color-white);
  background: var(--color-dark);
  will-change: transform;
`;

export const FooterContainer = styled(ContainerMedium)`
  display: flex;
  flex-direction: column;
`;

export const Col = styled.div`
  width: 100%;
  position: relative;
`;

export const HeadingRow = styled(Row)`
  padding-bottom: calc(var(--section-padding) / 2);

  @media (max-width: 720px) {
    padding-bottom: calc(var(--section-padding) * 0.75);
  }
`;

export const Heading = styled.h2`
  font-size: calc(clamp(3.25em, 7vw, 8em) * 0.875);
  line-height: 1.065;

  > span {
    display: block;
  }
`;

export const Picture = styled.span`
  width: 0.85em;
  height: 0.85em;
  position: relative;
  display: inline-flex;
  margin-right: 0.125em;
  overflow: hidden;
  vertical-align: baseline;
  background: var(--color-lightgray);
  border-radius: 50%;
  transform: translateY(0.09em);

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    object-fit: cover;
  }

  @media (max-width: 720px) {
    width: 0.95em;
    height: 0.95em;
    transform: translateY(0.1em);
  }
`;

export const Arrow = styled(motion.div)`
  width: clamp(0.9em, 1.1vw, 1.1em);
  position: absolute;
  right: 0;
  bottom: calc(var(--gap-padding) * 1.5);
  will-change: transform;

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 720px) {
    bottom: 1em;
  }
`;

export const StripeRow = styled(Row)`
  padding-bottom: calc(var(--section-padding) * 0.475);

  @media (max-width: 900px) {
    padding-bottom: calc(var(--section-padding) * 0.75);
  }

  @media (max-width: 720px) {
    padding-bottom: calc(var(--section-padding) * 1.25);
  }
`;

export const LightStripe = styled.div`
  width: 100%;
  height: 1px;
  display: block;
  background: var(--color-border-light);
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

export const PillsRow = styled(Row)`
  .pills {
    display: flex;
    flex-direction: row;
  }

  .pills > * {
    display: inline-flex;
    margin-right: 0.5em;
  }

  @media (max-width: 720px) {
    padding-bottom: calc(var(--section-padding) / 5);

    .pills {
      flex-direction: column;
    }

    .pills > * {
      width: 100%;
      margin: 0 0 0.75em;
    }
  }
`;
