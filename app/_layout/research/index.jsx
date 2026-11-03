'use client';

import { useRef } from 'react';

import { researchAbstract } from '@/data';
import { useOnceInReveal } from '@/hooks';

import { ClaimsPanel } from './claims';
import { ResearchHeader } from './header';
import { ResearchImplications } from './implications';
import { Page } from './index.styled';
import { ResearchMethod } from './method';
import { ResearchNumbers } from './numbers';
import { ResearchPaper } from './paper';
import { ResearchQuestions } from './questions';
import { ResearchResults } from './results';
import { CaseDescription } from '../case/description';

/**
 * The Research page: the dissertation laid out as a case page is, title,
 * facts and a hero (here the claims themselves), then the study in words,
 * numbers and charts, and the way to the paper.
 */
export function Research() {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const pageRef = useRef(null);

  useOnceInReveal(pageRef);

  return (
    <Page ref={pageRef}>
      <ResearchHeader />
      <ClaimsPanel />
      <CaseDescription description={researchAbstract} />
      <ResearchNumbers />
      <ResearchQuestions />
      <ResearchMethod />
      <ResearchResults />
      <ResearchImplications />
      <ResearchPaper />
    </Page>
  );
}
