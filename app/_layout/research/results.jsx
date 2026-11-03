'use client';

import { motion } from 'framer-motion';

import { Container } from '@/components';
import { researchResults } from '@/data';

import {
  CascadeChart,
  CombinationsChart,
  MetaChart,
  OverlapChart,
  SweepChart,
  SystemsChart,
  TaxonomyChart,
} from './charts';
import { Result, ResultText } from './charts.styled';
import { Heading, HeadingRow, Intro, Section } from './index.styled';
import { revealProps } from './reveal';

const MotionHeading = motion(Heading);
const MotionIntro = motion(Intro);
const MotionResultText = motion(ResultText);

//? Each result names the chart it is told beside
const CHARTS = {
  taxonomy: TaxonomyChart,
  sweep: SweepChart,
  systems: SystemsChart,
  overlap: OverlapChart,
  combinations: CombinationsChart,
  meta: MetaChart,
  cascade: CascadeChart,
};

/** What the study found: seven results, each beside the chart it rests on. */
export function ResearchResults() {
  return (
    <Section>
      <Container>
        <HeadingRow>
          <MotionHeading {...revealProps()}>What I found</MotionHeading>
          <MotionIntro {...revealProps(0.1)}>
            Seven results, from what the errors look like to what it costs to
            catch them. Every chart is drawn from the dissertation’s own tables
            and figures.
          </MotionIntro>
        </HeadingRow>

        {researchResults.map(result => {
          const ResultChart = CHARTS[result.chart];

          return (
            <Result key={result.no}>
              <MotionResultText {...revealProps()}>
                <p data-no>{result.no}</p>
                <h3>{result.title}</h3>
                {result.text.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </MotionResultText>
              <ResultChart />
            </Result>
          );
        })}
      </Container>
    </Section>
  );
}
