'use client';

import { motion } from 'framer-motion';

import { Container, Stripe } from '@/components';
import {
  researchImplications,
  researchLimitations,
  researchNext,
} from '@/data';

import {
  Heading,
  HeadingRow,
  Implication,
  Implications,
  Intro,
  Label,
  Lists,
  Section,
} from './index.styled';
import { Reveal, revealProps } from './reveal';

const MotionHeading = motion(Heading);
const MotionIntro = motion(Intro);
const MotionImplication = motion(Implication);

/** What a team building such a system should take from it, then the study's
 *  limits and what comes next. */
export function ResearchImplications() {
  return (
    <Section data-tone='gray'>
      <Container>
        <HeadingRow>
          <MotionHeading {...revealProps()}>What it means</MotionHeading>
          <MotionIntro {...revealProps(0.1)}>
            For a team putting a local RAG system in front of people, four
            things to take from it.
          </MotionIntro>
        </HeadingRow>

        <Implications>
          {researchImplications.map((item, index) => (
            <MotionImplication
              key={item.no}
              {...revealProps((index % 2) * 0.1)}
            >
              <p data-no>{item.no}</p>
              <Stripe />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </MotionImplication>
          ))}
        </Implications>

        <Lists>
          <Reveal>
            <Label>
              <h3>Limitations</h3>
              <Stripe />
            </Label>
            <ul>
              {researchLimitations.map(text => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <Label>
              <h3>What comes next</h3>
              <Stripe />
            </Label>
            <ul>
              {researchNext.map(text => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </Reveal>
        </Lists>
      </Container>
    </Section>
  );
}
