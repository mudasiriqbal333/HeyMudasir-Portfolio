'use client';

import { useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';

import { ArrowIcon, Container, Row } from '@/components';
import { aboutOptions } from '@/data';
import { useSpeedParallax } from '@/hooks';

import {
  BottomLightgray,
  Dots,
  Intro,
  IntroArrow,
  IntroImageCol,
  IntroText,
  Portrait,
  PortraitImage,
} from './index.styled';

/** @param {{parallax: boolean}} props */
export function AboutIntro({ parallax }) {
  const { intro } = aboutOptions;
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const frameRef = useRef(null);
  const { scrollY } = useScroll();
  //? Reference: text at speed -1 and photo at speed -2, i.e. they drift down
  //? by 10% and 20% of the scrolled distance. The photo's drift is measured
  //? from its frame's middle passing the screen's middle, so it covers its
  //? frame the whole way through (PortraitImage).
  const textY = useTransform(scrollY, value => value * 0.1);
  const imageY = useSpeedParallax(frameRef, 0.2);

  return (
    <Intro data-once-in>
      <BottomLightgray aria-hidden='true' />
      <Container>
        <Row>
          <IntroText>
            <IntroArrow data-intro-arrow>
              <ArrowIcon />
            </IntroArrow>
            <motion.p style={parallax ? { y: textY } : undefined}>
              {intro.paragraph}
            </motion.p>
            <motion.p style={parallax ? { y: textY } : undefined}>
              <span>
                {intro.note}
                <Dots>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </Dots>
              </span>
            </motion.p>
          </IntroText>

          <IntroImageCol>
            <Portrait ref={frameRef} data-intro-image>
              <PortraitImage
                src={intro.image}
                alt={intro.imageAlt}
                data-parallax={parallax || undefined}
                style={parallax ? { y: imageY } : undefined}
              />
            </Portrait>
          </IntroImageCol>
        </Row>
      </Container>
    </Intro>
  );
}
