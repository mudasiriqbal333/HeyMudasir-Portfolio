'use client';

import { Container, Stripe } from '@/components';
import { aboutOptions } from '@/data';

import {
  Dots,
  Service,
  Services,
  ServicesHeading,
  ServicesHeadingRow,
  ServicesRow,
} from './index.styled';

function StarIcon() {
  return (
    <svg viewBox='0 0 100 100' fill='currentColor' aria-hidden='true'>
      <path d='M99.17 50C71.94 50.45 50 72.66 50 100l-.007-.827C49.552 71.94 27.338 50 0 50l.827-.007C28.06 49.552 50 27.338 50 0l.007.827C50.448 28.06 72.662 50 100 50z' />
    </svg>
  );
}

export function AboutServices() {
  const { services } = aboutOptions;

  return (
    <Services data-services>
      <Container>
        <ServicesHeadingRow>
          <div className='w-full'>
            <ServicesHeading>
              {services.heading}{' '}
              <Dots>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </Dots>
            </ServicesHeading>
          </div>
        </ServicesHeadingRow>

        <ServicesRow>
          {services.items.map(({ no, title, description, starred }) => (
            <Service key={no}>
              <p data-number aria-hidden='true'>
                {no}
              </p>
              <Stripe />
              <h3>
                {starred ? <StarIcon /> : null}
                {title}
              </h3>
              <p>{description}</p>
            </Service>
          ))}
        </ServicesRow>
      </Container>
    </Services>
  );
}
