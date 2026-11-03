'use client';

import { useId } from 'react';

import { ContainerMedium, Row } from '@/components';
import { aboutOptions } from '@/data';

import {
  Badge,
  BadgeRing,
  Feature,
  FeatureImage,
  FeatureImageCol,
  FeatureImageInner,
  FeatureTextCol,
} from './index.styled';

/** Circular text badge; the ring is rotated -90deg by scroll on the page. */
function FeatureBadge({ text, mark }) {
  const pathId = useId();

  return (
    <Badge aria-hidden='true'>
      <BadgeRing data-badge viewBox='0 0 100 100'>
        <defs>
          <path
            id={pathId}
            d='M50 50m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0'
            fill='none'
          />
        </defs>
        <text
          fill='currentColor'
          fontSize='10.5'
          letterSpacing='1.6'
          style={{ textTransform: 'uppercase' }}
        >
          <textPath href={`#${pathId}`}>{text.toUpperCase()}</textPath>
        </text>
      </BadgeRing>
      <svg viewBox='0 0 100 60'>
        <text
          x='50'
          y='42'
          textAnchor='middle'
          fill='currentColor'
          fontSize='34'
          fontWeight='700'
          letterSpacing='-1'
        >
          {mark}
        </text>
      </svg>
    </Badge>
  );
}

//? The photo stays still: any scroll drift would trim its bottom or open a
//? gap under it, and the bottom must always show. It sits well below the
//? first screen, so it is fetched at once, as before, but behind what the
//? first screen needs.
export function AboutFeature() {
  const { feature } = aboutOptions;

  return (
    <Feature>
      <ContainerMedium>
        <Row>
          <FeatureImageCol>
            <FeatureImage>
              <FeatureImageInner
                src={feature.image}
                alt={feature.imageAlt}
                decoding='async'
                fetchPriority='low'
              />
            </FeatureImage>
          </FeatureImageCol>

          <FeatureTextCol>
            <FeatureBadge text={feature.badge.text} mark={feature.badge.mark} />
            <h2>
              {feature.title.map(line => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p>{feature.description}</p>
          </FeatureTextCol>
        </Row>
      </ContainerMedium>
    </Feature>
  );
}
