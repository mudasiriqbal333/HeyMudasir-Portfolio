'use client';

import { Fragment, useRef } from 'react';

import { motion } from 'framer-motion';

import { ContainerMedium, MagneticButton, Row } from '@/components';
import { homeOptions } from '@/data';
import { useMediaQuery, useSpeedParallax } from '@/hooks';

import { roundButton } from './classes';
import {
  Aside,
  ButtonSlot,
  Lead,
  Section,
  TextWrap,
  Title,
  Word,
} from './index.styled';
import { useScrollPlay } from './use-scroll-play';
import { fadeIn, wordReveal } from './variants';

const words = homeOptions.statement.split(' ');

/**
 * Home intro (reference section.home-intro): the statement revealed word by
 * word, the side note fading up, and the round "About me" link drifting up
 * as the page scrolls.
 */
export function Description() {
  /** @type {import('react').MutableRefObject<HTMLHeadingElement>} */
  const titleRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const textRef = useRef(null);
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const buttonRef = useRef(null);

  //? Reference triggers: the words start when the heading's top enters the
  //? viewport, the side note 10% of the viewport earlier ("0% 110%").
  const titleState = useScrollPlay(titleRef) ? 'shown' : 'hidden';
  const textState = useScrollPlay(textRef, '10%') ? 'shown' : 'hidden';

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  //? The reference only runs parallax on desktop smooth scroll.
  const parallax = useMediaQuery('(min-width: 1024px)') && !reduceMotion;
  //? Reference data-scroll-speed="2": rises by 0.2x the scrolled distance.
  const buttonY = useSpeedParallax(buttonRef, -0.2);

  return (
    <Section>
      <ContainerMedium>
        <Row>
          <Lead>
            <Title ref={titleRef}>
              {words.map((word, index) => (
                <Fragment key={index}>
                  {index > 0 ? ' ' : null}
                  <Word>
                    <motion.span
                      custom={index}
                      variants={wordReveal}
                      initial='hidden'
                      animate={titleState}
                    >
                      {word}
                    </motion.span>
                  </Word>
                </Fragment>
              ))}
            </Title>
          </Lead>

          <Aside>
            <TextWrap
              ref={textRef}
              variants={fadeIn}
              initial='hidden'
              animate={textState}
            >
              <p>{homeOptions.note}</p>
            </TextWrap>

            <ButtonSlot>
              <motion.div
                ref={buttonRef}
                style={parallax ? { y: buttonY } : undefined}
              >
                <MagneticButton
                  href='/about'
                  strength={100}
                  textStrength={50}
                  whileHover={{ scale: 1 }}
                  className={roundButton}
                >
                  About me
                </MagneticButton>
              </motion.div>
            </ButtonSlot>
          </Aside>
        </Row>
      </ContainerMedium>
    </Section>
  );
}
