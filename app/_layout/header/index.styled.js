'use client';

import { motion } from 'framer-motion';
import { styled } from 'styled-components';

import { WireGlobe } from '@/components';

/* The hero is taller than the screen, like the reference: 115% of the
   viewport, or 110% on phones, where the copy sits at the bottom. */
export const Hero = styled.header`
  min-height: 115vh;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: var(--color-white);
  background: var(--color-gray);

  @media (max-width: 720px) {
    min-height: 110vh;
    min-height: 110svh;
    max-height: 110vh;
    max-height: 110svh;
    padding-block: calc(var(--gap-padding) * 2);
    align-items: flex-end;
  }
`;

/* ---- portrait ----
   PORTRAIT SIZE: the photo is as tall as the Portrait box below. On desktop
   the box is 87% of the hero's height and starts 8% from the top, so the
   photo's bottom edge sits at 95% (\`top\` + \`height\`). On phones (720px
   and below) it is 75% tall and starts 25% from the top, so it stands on
   the hero's bottom edge, with the face clear above the name. To make the
   photo bigger or smaller change
   \`height\`, then move \`top\` to put its bottom edge back where you want
   it. \`width: 90%\` with \`left: 0\` is the area the photo is centred in on
   desktop. On phones the photo is wider than the screen, so it takes the
   whole width and is cropped around the middle: the face is 49% across
   the picture, so 50% keeps it in the middle of the screen. Lower the
   first value to move the face right, raise it to move it left. */
export const PortraitWrap = styled.div`
  position: absolute;
  inset: 0;
`;

export const Portrait = styled(motion.div)`
  width: 90%;
  height: 87%;
  position: absolute;
  top: 8%;
  left: 0;

  img {
    width: auto;
    max-width: 100%;
    height: 100%;
    position: absolute;
    left: 50%;
    object-fit: cover;
    transform: translateX(-50%);
    user-select: none;
    pointer-events: none;
  }

  @media (max-width: 720px) {
    width: 100%;
    height: 75%;
    top: 25%;

    img {
      object-position: 50% 50%;
    }
  }
`;

/* ---- "Located in" pill, centred in the first screen ---- */
export const FirstScreen = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;

  @media (max-width: 720px) {
    height: 100svh;
  }
`;

export const Hanger = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  display: inline-block;
  transform: translateY(-50%);

  /* Only the globe is left on phones, at the right of the role, in the
     empty band between the top bar and the head; high enough that the role's
     longer second line passes under its rounded edge on a 360px screen */
  @media (max-width: 720px) {
    width: 6em;
    height: 6em;
    top: calc(6.6em + 10px);
    right: calc(var(--container-padding) - 0.9em);
    left: auto;
    transform: none;
  }
`;

export const HangerShape = styled.svg`
  width: auto;
  height: 6em;
  display: block;
  fill: var(--color-dark);

  @media (max-width: 720px) {
    display: none;
  }
`;

export const HangerText = styled.p`
  margin: 0;
  padding-right: 5em;
  padding-left: var(--gap-padding);
  position: absolute;
  top: 50%;
  line-height: 1.2;
  transform: translateY(-50%);

  span {
    display: block;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

/* The round hole at the pill's end, holding the globe */
export const HangerBall = styled.div`
  width: 4.2em;
  height: 4.2em;
  position: absolute;
  top: 0.9em;
  right: 0.9em;
  z-index: 1;
`;

export const GlobeSpin = styled(motion.div)`
  position: absolute;
  inset: 0;
`;

export const HeroGlobe = styled(WireGlobe)`
  --globe-size: 2.5em;

  font-size: 0.8em;

  @media (max-width: 720px) {
    --globe-size: 3em;
  }
`;

/* ---- role, right-aligned with the arrow above it ---- */
export const RoleContainer = styled.div`
  width: 100%;
  padding: 0 var(--container-padding) 15vh;
  position: relative;

  /* Phones: in the empty band between the top bar and the head, so it never
     covers the face */
  @media (max-width: 720px) {
    padding-bottom: 0;
    position: absolute;
    top: calc(6em + 30px);
    left: 0;
  }
`;

export const RoleRow = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 720px) {
    justify-content: flex-start;
  }
`;

export const RoleCol = styled.div`
  position: relative;
`;

export const RoleArrow = styled(motion.div)`
  position: absolute;
  top: -12.5vh;
  left: 0;

  svg {
    width: clamp(1.1em, 1.3vw, 1.25em);
    height: auto;
  }

  /* Phones: just above the role, in the same band, a little smaller, with
     the role starting under the point it aims at */
  @media (max-width: 720px) {
    margin-bottom: 1.1em;
    position: relative;
    top: auto;

    svg {
      width: 0.9em;
    }
  }
`;

export const RoleHeading = styled.h4`
  margin: 0;
  font-size: clamp(1.55em, 2.3vw, 2.5em);
  font-weight: inherit;
  line-height: 1.4;

  /* Not in the reference: the role crosses the light shirt in this photo, so
     a soft shadow keeps the white text readable; on the grey it barely shows */
  text-shadow: 0 1px 20px rgb(0 0 0 / 40%);

  span {
    display: block;
  }

  /* Phones: a size smaller, to fit the band above the head, and moved
     20px right so it starts where the arrow above it points */
  @media (max-width: 720px) {
    margin-left: 20px;
    font-size: 1.35em;
  }
`;

/* ---- the big rolling name ---- */
export const BigName = styled.div`
  width: 100%;
  padding-bottom: calc(var(--gap-padding) * 1.25);
  position: absolute;
  bottom: 15vh;
  left: 0;
  pointer-events: none;

  /* Phones: rolling along the bottom of the screen, over the crossed arms */
  @media (max-width: 720px) {
    bottom: 12vh;
    bottom: 12svh;
  }
`;

export const NameTrack = styled(motion.div)`
  width: 100%;
  position: relative;
  display: flex;
`;

export const NameRoll = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const NameText = styled.h1`
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  font-size: max(9em, 15vw);
  font-weight: inherit;
  line-height: 1;
  color: var(--color-white);
  white-space: nowrap;
  user-select: none;

  .spacer {
    padding: 0 3vw;
  }

  /* Phones: 5px smaller than the 9em it would be */
  @media (max-width: 720px) {
    font-size: calc(9em - 5px);
  }
`;
