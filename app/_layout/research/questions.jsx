'use client';

import { motion } from 'framer-motion';

import { Container } from '@/components';
import { researchQuestions } from '@/data';

import {
  Heading,
  HeadingRow,
  Intro,
  Question,
  Questions,
  Section,
} from './index.styled';
import { revealProps } from './reveal';

const MotionHeading = motion(Heading);
const MotionIntro = motion(Intro);
const MotionQuestion = motion(Question);

/** The four research questions, each with what the study found. */
export function ResearchQuestions() {
  return (
    <Section>
      <Container>
        <HeadingRow>
          <MotionHeading {...revealProps()}>
            What I asked, and what I found
          </MotionHeading>
          <MotionIntro {...revealProps(0.1)}>
            Four research questions, tested on answers that were generated once
            and then frozen, so every detector judged exactly the same claims.
          </MotionIntro>
        </HeadingRow>

        <Questions>
          {researchQuestions.map(({ no, question, answer }) => (
            <MotionQuestion key={no} {...revealProps()}>
              <p data-no>{no}</p>
              <h3>{question}</h3>
              <p>{answer}</p>
            </MotionQuestion>
          ))}
        </Questions>
      </Container>
    </Section>
  );
}
