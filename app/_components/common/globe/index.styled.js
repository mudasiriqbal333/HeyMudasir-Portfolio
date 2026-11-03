'use client';

import { keyframes, styled } from 'styled-components';

const rock = keyframes`
  0%, 100% { transform: translate(-50%, -50%) rotate(15deg); }
  50% { transform: translate(-50%, -50%) rotate(-15deg); }
`;

const meridian = keyframes`
  0% { width: 100%; background: transparent; border-radius: 50%; box-shadow: inset 0.1em 0 0 0.08em var(--color-white); }
  49% { background: transparent; border-radius: 50%; box-shadow: inset 0.1em 0 0 0.08em var(--color-white); }
  50% { width: 0.175em; background: var(--color-white); border-radius: 0; }
  51% { background: transparent; border-radius: 50%; box-shadow: inset -0.1em 0 0 0.08em var(--color-white); }
  100% { width: 100%; background: transparent; border-radius: 50%; box-shadow: inset -0.1em 0 0 0.08em var(--color-white); }
`;

/* The outer circle, centred in whatever holds it. Its size comes from
   --globe-size (3em by default) and its line widths from its own font-size. */
export const GlobeShell = styled.div`
  width: var(--globe-size, 3em);
  height: var(--globe-size, 3em);
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  will-change: transform;
`;

/* The wireframe: a rocking outline with meridians that sweep across it. */
export const GlobeWrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: inset 0 0 0 0.125em var(--color-white);
  animation: ${rock} 5.4s cubic-bezier(0.35, 0, 0.65, 1) infinite;

  .circle {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 0.75em;
    border-radius: 50%;
    box-shadow: inset 0.1em 0 0 0.08em var(--color-white);
    transform: translate(-50%, -50%);
    animation: ${meridian} 2.7s linear infinite;
  }

  .circle:nth-child(1) {
    animation-delay: -1.8s;
  }

  .circle:nth-child(2) {
    animation-delay: -0.9s;
  }

  .circle-hor {
    width: 150%;
    height: 55%;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 0.75em;
    border-radius: 50%;
    box-shadow: inset 0 0 0 0.15em var(--color-white);
    transform: translate(-50%, -50%);
  }

  .circle-hor-middle {
    width: 150%;
    height: 0.15em;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 0.75em;
    background: var(--color-white);
    transform: translate(-50%, -50%);
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    .circle {
      animation: none;
    }
  }
`;
