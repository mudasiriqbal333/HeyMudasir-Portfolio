'use client';

import { useRef } from 'react';

import { motion, useInView } from 'framer-motion';

import { Container } from '@/components';
import { researchLabels, researchPipeline, researchSystems } from '@/data';

import { Heading, HeadingRow, Intro, Section } from './index.styled';
import {
  LabelCard,
  Labels,
  Pipeline,
  Stage,
  StageName,
  Step,
  Steps,
  SubHeading,
  System,
  Systems,
} from './method.styled';
import { revealProps } from './reveal';

const MotionHeading = motion(Heading);
const MotionIntro = motion(Intro);
const MotionSubHeading = motion(SubHeading);
const MotionLabelCard = motion(LabelCard);
const MotionSystem = motion(System);

/** One stage of the pipeline, drawn once it comes into view. */
function PipelineStage({ stage }) {
  /** @type {import('react').MutableRefObject<HTMLDivElement | null>} */
  const ref = useRef(null);
  const drawn = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });

  return (
    <Stage ref={ref} data-in={drawn || undefined}>
      <StageName>
        <span data-letter aria-hidden='true'>
          {stage.key}
        </span>
        <div>
          <h3>{stage.title}</h3>
          <p>{stage.note}</p>
        </div>
      </StageName>
      <Steps aria-label={`${stage.title} steps`}>
        {stage.steps.map((step, index) => (
          <Step
            key={step.title}
            data-out={step.out || undefined}
            style={{ '--i': index }}
          >
            <h4>{step.title}</h4>
            <p>{step.detail}</p>
            {step.llm ? <span data-llm>LLM</span> : null}
          </Step>
        ))}
      </Steps>
    </Stage>
  );
}

/** How it works: the pipeline, the three labels and the five systems. */
export function ResearchMethod() {
  return (
    <Section data-tone='gray'>
      <Container>
        <HeadingRow>
          <MotionHeading {...revealProps()}>How it works</MotionHeading>
          <MotionIntro {...revealProps(0.1)}>
            A fully local pipeline: the documents are indexed once, every
            question is answered once and frozen, and then each verifier judges
            exactly the same claims against the same passages.
          </MotionIntro>
        </HeadingRow>

        <Pipeline>
          {researchPipeline.map(stage => (
            <PipelineStage key={stage.key} stage={stage} />
          ))}
        </Pipeline>

        <MotionSubHeading {...revealProps()}>
          A traffic light for every claim
          <span>
            Judged only against the five passages retrieved for its question,
            never against the web or what is true elsewhere.
          </span>
        </MotionSubHeading>
        <Labels>
          {researchLabels.map((label, index) => (
            <MotionLabelCard
              key={label.key}
              data-label={label.key}
              {...revealProps(index * 0.08)}
            >
              <header>
                <h4>{label.meaning}</h4>
                <span>{label.count} claims</span>
              </header>
              <p>{label.text}</p>
              <footer>
                <i aria-hidden='true' />
                {label.name} · {label.action}
              </footer>
            </MotionLabelCard>
          ))}
        </Labels>

        <MotionSubHeading {...revealProps()}>
          Five ways to check a claim
          <span>
            Each maps a claim and its passages to green, yellow or red. A claim
            counts as flagged when it comes back yellow or red.
          </span>
        </MotionSubHeading>
        <Systems>
          {researchSystems.map((system, index) => (
            <MotionSystem key={system.key} {...revealProps(index * 0.06)}>
              <span data-key>{system.key}</span>
              <h4>{system.name}</h4>
              <p data-tool>{system.tool}</p>
              <p>{system.text}</p>
              <span data-calls>{system.calls}</span>
            </MotionSystem>
          ))}
        </Systems>
      </Container>
    </Section>
  );
}
