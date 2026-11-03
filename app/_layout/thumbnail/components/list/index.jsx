'use client';

import { Container, Stripe, TitleWithTagline } from '@/components';

import { RowLink, Section, ServicesCol, TitleCol } from './index.styled';
import { ThumbnailLabel } from '../label';

/**
 * "Recent projects" rows, shown above 1024px.
 * @param {Object} props
 * @param {typeof import('@/data').thumbnailOptions} props.items
 * @param {ReturnType<typeof import('@/hooks').useFollowPointer>['bind']} props.bind
 */
export function ThumbnailList({ items, bind }) {
  return (
    <Section>
      <Container>
        <ThumbnailLabel>Recent projects</ThumbnailLabel>
        <ul>
          {items.map(({ href, title, tagline, services }, index) => (
            <li key={href}>
              <Stripe />
              <RowLink href={href} {...bind(index)}>
                <TitleCol>
                  <TitleWithTagline tagline={tagline}>
                    <h4>
                      <span>{title}</span>
                    </h4>
                  </TitleWithTagline>
                </TitleCol>
                <ServicesCol>
                  <p>{services}</p>
                </ServicesCol>
              </RowLink>
            </li>
          ))}
        </ul>
        <Stripe />
      </Container>
    </Section>
  );
}
