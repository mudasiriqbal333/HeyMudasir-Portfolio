'use client';

import Link from 'next/link';

import { ArrowIcon, Container, Stripe } from '@/components';
import { aboutOptions } from '@/data';

import {
  CertLink,
  Degree,
  Degrees,
  List,
  ListLabels,
  ListSection,
  RowArrow,
  ServicesHeading,
  ServicesHeadingRow,
} from './index.styled';
import { useRowPreview } from './preview';

const { credentials } = aboutOptions;

//? One preview picture per row, in row order: the certificate itself
const slides = credentials.certifications.map(({ title, image }) => ({
  key: title,
  image,
  kind: 'certificate',
}));

/**
 * The degrees, then every certificate as a row that opens where it can be
 * verified, the certificate itself following the mouse. A certificate with
 * no `href` is a plain row: no arrow, and no "Verify" disc on hover.
 */
export function AboutCredentials() {
  const { rowProps, followers } = useRowPreview(slides, 'wide');

  return (
    <ListSection data-list='certificates'>
      <Container>
        <ServicesHeadingRow>
          <div className='w-full'>
            <ServicesHeading>{credentials.heading}</ServicesHeading>
          </div>
        </ServicesHeadingRow>

        <Degrees>
          {credentials.education.map(({ label, title, school, link }) => (
            <Degree key={title}>
              <p data-label>{label}</p>
              <Stripe />
              <h3>{title}</h3>
              <p>{school}</p>
              {link ? <Link href={link.href}>{link.text}</Link> : null}
            </Degree>
          ))}
        </Degrees>

        <ListLabels aria-hidden='true'>
          {credentials.labels.map((label, column) => (
            <span key={label} data-col={column + 1}>
              {label}
            </span>
          ))}
        </ListLabels>

        <List>
          {credentials.certifications.map(
            ({ title, issuer, year, href }, row) => (
              <li key={title}>
                <Stripe />
                <CertLink
                  {...(href
                    ? {
                        href,
                        target: '_blank',
                        rel: 'noopener',
                        ...rowProps(row),
                      }
                    : { as: 'div' })}
                >
                  <span data-col='1'>
                    <span data-title>
                      {title}
                      {href ? (
                        <span className='sr-only'> (opens in a new tab)</span>
                      ) : null}
                    </span>
                  </span>
                  <span data-col='2'>{issuer}</span>
                  <span data-col='3'>{year}</span>
                  {href ? (
                    <RowArrow aria-hidden='true'>
                      <ArrowIcon />
                    </RowArrow>
                  ) : null}
                </CertLink>
              </li>
            ),
          )}
          <li aria-hidden='true'>
            <Stripe />
          </li>
        </List>
      </Container>

      {followers('Verify')}
    </ListSection>
  );
}
