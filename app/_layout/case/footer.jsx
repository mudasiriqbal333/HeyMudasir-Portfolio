'use client';

import { useState } from 'react';

import { motion, useTransform } from 'framer-motion';

import { MagneticButton } from '@/components';
import { workOptions } from '@/data';

import { NextCaseCursor } from './cursor';
import {
  ButtonRow,
  CaseBottom,
  NextCase,
  StripeRow,
  Tile,
} from './index.styled';
import { FooterBottom } from '../contact/bottom';
import { pill } from '../contact/classes';
import { Col, FooterContainer, LightStripe } from '../contact/index.styled';
import { FooterShell } from '../contact/shell';

/**
 * Reference: the thumbnail rises 25% of the footer's height as the page
 * reaches its end (data-scroll-speed 2.5, position bottom).
 */
function TileMotion({ enabled, scrollYProgress, wrapRef, children }) {
  const y = useTransform(
    scrollYProgress,
    p => (1 - p) * 0.25 * (wrapRef.current?.offsetHeight ?? 0),
  );

  return (
    <motion.div className='tile-motion' style={enabled ? { y } : undefined}>
      {children}
    </motion.div>
  );
}

/**
 * Case footer: "Next case" with the next project's title and thumbnail,
 * the "All projects" pill and the shared bottom row.
 * @param {{next: {slug: string, title: string, thumbnail: string}}} props
 */
export function CaseFooter({ next }) {
  const [hovering, setHovering] = useState(false);

  return (
    <>
      <FooterShell>
        {({ animate, isDesktop, scrollYProgress, wrapRef }) => (
          <>
            <FooterContainer>
              <NextCase
                href={`/work/${next.slug}`}
                onPointerEnter={event =>
                  event.pointerType === 'mouse' && setHovering(true)
                }
                onPointerLeave={() => setHovering(false)}
              >
                <p>Next case</p>
                <h2>{next.title}</h2>
                <Tile aria-hidden='true'>
                  <TileMotion
                    enabled={animate && isDesktop}
                    scrollYProgress={scrollYProgress}
                    wrapRef={wrapRef}
                  >
                    {/* At the foot of the page: fetched at once, as
                        before, but behind what the first screen needs */}
                    <img
                      src={next.thumbnail}
                      alt=''
                      decoding='async'
                      fetchPriority='low'
                    />
                  </TileMotion>
                </Tile>
              </NextCase>

              <StripeRow>
                <Col>
                  <LightStripe />
                </Col>
              </StripeRow>

              <ButtonRow>
                <MagneticButton
                  href='/work'
                  variant='outline'
                  strength={25}
                  textStrength={15}
                  nowrap
                  whileHover={{ scale: 1 }}
                  className={pill}
                >
                  All projects
                  <sup aria-hidden='true'>{workOptions.length}</sup>
                </MagneticButton>
              </ButtonRow>
            </FooterContainer>

            <CaseBottom>
              <FooterBottom />
            </CaseBottom>
          </>
        )}
      </FooterShell>

      <NextCaseCursor active={hovering} />
    </>
  );
}
