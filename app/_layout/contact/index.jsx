'use client';

import { motion } from 'framer-motion';

import { ArrowIcon, MagneticButton } from '@/components';
import { contactOptions } from '@/data';

import { FooterBottom } from './bottom';
import { pill, roundButton } from './classes';
import {
  Arrow,
  ButtonFixed,
  Col,
  FooterContainer,
  Heading,
  HeadingRow,
  LightStripe,
  Picture,
  PillsRow,
  StripeRow,
} from './index.styled';
import { FooterShell } from './shell';

/** Site footer ("Let's work together") on the reference footer shell. */
export function Contact() {
  const { heading, profilePicture, contactDetails, cta } = contactOptions;
  const [firstLine, ...otherLines] = heading;

  return (
    <FooterShell>
      {({ animate, isDesktop, isTabletUp, arrowRotate, buttonX }) => (
        <>
          <FooterContainer>
            <HeadingRow>
              <Col>
                <Arrow
                  style={
                    animate && isTabletUp ? { rotate: arrowRotate } : undefined
                  }
                >
                  <ArrowIcon direction='down-left' />
                </Arrow>
                <Heading>
                  <span>
                    <Picture>
                      {/* At the foot of every page: fetched at once, as
                          before, but behind what the first screen needs */}
                      <img
                        src={profilePicture.src}
                        alt=''
                        decoding='async'
                        fetchPriority='low'
                      />
                    </Picture>{' '}
                    {firstLine}
                  </span>
                  {otherLines.map(line => (
                    <span key={line}>{line}</span>
                  ))}
                </Heading>
              </Col>
            </HeadingRow>

            <StripeRow>
              <Col>
                <LightStripe />
                <ButtonFixed>
                  <motion.div
                    style={animate && isDesktop ? { x: buttonX } : undefined}
                  >
                    <MagneticButton
                      href={cta.href}
                      variant='primary'
                      strength={100}
                      whileHover={{ scale: 1 }}
                      className={roundButton}
                    >
                      {cta.label}
                    </MagneticButton>
                  </motion.div>
                </ButtonFixed>
              </Col>
            </StripeRow>

            <PillsRow>
              <Col>
                <div className='pills'>
                  {contactDetails.map(({ href, title }) => (
                    <MagneticButton
                      key={href}
                      href={href}
                      variant='outline'
                      strength={25}
                      nowrap
                      whileHover={{ scale: 1 }}
                      className={pill}
                    >
                      {title}
                    </MagneticButton>
                  ))}
                </div>
              </Col>
            </PillsRow>
          </FooterContainer>

          <FooterBottom />
        </>
      )}
    </FooterShell>
  );
}
