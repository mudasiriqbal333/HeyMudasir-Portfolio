'use client';

import { ContainerMedium, MagneticButton, Row, Stripe } from '@/components';
import { cvFile } from '@/data';

import { CvButton, CvLine } from './index.styled';
import { roundButton } from '../contact/classes';

/**
 * The line under the heading with the round "Download CV" button on it, in
 * the place and size of the reference's globe.
 */
export function AboutCvLine() {
  return (
    <CvLine data-once-in>
      <ContainerMedium>
        <Row>
          <div className='relative w-full'>
            <Stripe />
            <CvButton>
              <MagneticButton
                href={cvFile.href}
                target='_blank'
                rel='noopener'
                prefetch={false}
                variant='primary'
                strength={100}
                whileHover={{ scale: 1 }}
                className={roundButton}
              >
                {cvFile.label}
                <span className='sr-only'> (PDF, opens in a new tab)</span>
              </MagneticButton>
            </CvButton>
          </div>
        </Row>
      </ContainerMedium>
    </CvLine>
  );
}
