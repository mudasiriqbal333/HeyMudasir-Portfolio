'use client';

import { useRef } from 'react';

import { useOnceInReveal } from '@/hooks';

import { ContactDetails } from './details';
import { ContactForm } from './form';
import { ContactHero } from './hero';
import {
  ContactFooter,
  Container,
  DetailsCol,
  FormCol,
  FormRow,
  Header,
  Page,
} from './index.styled';
import { FooterBottom } from '../contact/bottom';

export function ContactPage() {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const pageRef = useRef(null);
  useOnceInReveal(pageRef);

  return (
    <Page ref={pageRef}>
      <Header>
        <Container>
          <ContactHero />
          <FormRow data-once-in>
            <FormCol>
              <ContactForm />
            </FormCol>
            <DetailsCol>
              <ContactDetails />
            </DetailsCol>
          </FormRow>
        </Container>
      </Header>
      <ContactFooter>
        <FooterBottom />
      </ContactFooter>
    </Page>
  );
}
