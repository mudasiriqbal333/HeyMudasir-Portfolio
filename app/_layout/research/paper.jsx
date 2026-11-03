'use client';

import { motion } from 'framer-motion';

import { Container, MagneticButton } from '@/components';
import { researchPaper } from '@/data';

import { Heading, PaperRow, PaperText, Section } from './index.styled';
import { Reveal, revealProps } from './reveal';
import { roundButton } from '../description/classes';

const MotionPaperText = motion(PaperText);

/** The way out to the dissertation itself, as the home page's "About me". */
export function ResearchPaper() {
  const { pdf, pages, kind, institution, year } = researchPaper;

  return (
    <Section>
      <Container>
        <PaperRow>
          <MotionPaperText {...revealProps()}>
            <Heading>Read the full paper</Heading>
            <p>
              The whole dissertation in {pages} pages: the method in full, every
              table and figure, the statistical tests, the predictions made
              before the third judge was run, and the appendices.
            </p>
            <p data-meta>
              {kind} · {institution} · {year}
            </p>
          </MotionPaperText>
          <Reveal delay={0.15}>
            <MagneticButton
              href={pdf}
              target='_blank'
              rel='noopener'
              prefetch={false}
              strength={100}
              textStrength={50}
              whileHover={{ scale: 1 }}
              className={roundButton}
            >
              Read the paper
              <span className='sr-only'> (PDF, opens in a new tab)</span>
            </MagneticButton>
          </Reveal>
        </PaperRow>
      </Container>
    </Section>
  );
}
