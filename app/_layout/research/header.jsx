'use client';

import { ContainerMedium, Row, Stripe } from '@/components';
import { researchPaper } from '@/data';

import { Header, Subtitle, Title } from './index.styled';
import { Intro, IntroCol } from '../case/index.styled';

/** The title, and three columns of facts, as at the top of a case page. */
export function ResearchHeader() {
  const { title, subtitle, kind, institution, supervisor, year } =
    researchPaper;

  return (
    <>
      <Header>
        <ContainerMedium data-once-in>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </ContainerMedium>
      </Header>

      <Intro data-once-in>
        <ContainerMedium>
          <Row>
            <IntroCol>
              <h2>Research</h2>
              <Stripe />
              <p>{kind}</p>
            </IntroCol>
            <IntroCol>
              <h2>Institution</h2>
              <Stripe />
              <p>{institution}</p>
            </IntroCol>
            <IntroCol data-inline='true'>
              <h2>Supervisor &amp; year</h2>
              <Stripe />
              <p>{supervisor} ·</p>
              <p>{year}</p>
            </IntroCol>
          </Row>
        </ContainerMedium>
      </Intro>
    </>
  );
}
