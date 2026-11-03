'use client';

import { useRef } from 'react';

import { useInView } from 'framer-motion';

import { Container, Stripe } from '@/components';
import { researchNumbers } from '@/data';

import { Figure, Label, NumberItem, Numbers, Section } from './index.styled';
import { CountUp, Reveal } from './reveal';

/** The findings in four numbers, counted up as they come into view. */
export function ResearchNumbers() {
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const ref = useRef(null);
  const run = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });

  return (
    <Section data-tone='gray'>
      <Container>
        <Label>
          <h2>In numbers</h2>
          <Stripe />
        </Label>
        <Numbers ref={ref}>
          {researchNumbers.map(({ value, decimals, after, text }, index) => (
            <Reveal key={text} delay={index * 0.08}>
              <NumberItem>
                <Figure>
                  <CountUp value={value} decimals={decimals} run={run} />
                  <span>{after}</span>
                </Figure>
                <p>{text}</p>
              </NumberItem>
            </Reveal>
          ))}
        </Numbers>
      </Container>
    </Section>
  );
}
