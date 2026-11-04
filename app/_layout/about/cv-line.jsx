'use client';

import {
  ArrowIcon,
  ContainerMedium,
  MagneticButton,
  Row,
  Stripe,
} from '@/components';
import { cvFile } from '@/data';

import { CvButton, CvDownload, CvLine } from './index.styled';
import { roundButton } from '../contact/classes';

/**
 * The line under the heading with the round "View CV" button on it, in the
 * place and size of the reference's globe. The button opens the CV in the
 * browser; the link under it downloads it.
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
              {/* A plain link: the browser saves the file under this name */}
              <CvDownload href={cvFile.href} download={cvFile.download.name}>
                {cvFile.download.label}
                <ArrowIcon className='rotate-45' />
              </CvDownload>
            </CvButton>
          </div>
        </Row>
      </ContainerMedium>
    </CvLine>
  );
}
