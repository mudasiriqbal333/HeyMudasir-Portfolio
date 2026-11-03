'use client';

import { ArrowIcon } from '@/components';
import { contactOptions } from '@/data';

import {
  Arrow,
  AsidePicture,
  HeroAside,
  HeroRow,
  HeroText,
  InlinePicture,
  Title,
} from './index.styled';

export function ContactHero() {
  const { pageHeading: heading, profilePicture } = contactOptions;
  const [firstLine, ...otherLines] = heading;

  return (
    <HeroRow data-once-in>
      <HeroText>
        <Title>
          <span>
            {/* Inline picture only shows on small screens */}
            <InlinePicture>
              <img src={profilePicture.src} alt='' />
            </InlinePicture>{' '}
            {firstLine}
          </span>
          {otherLines.map(line => (
            <span key={line}>{line}</span>
          ))}
        </Title>
      </HeroText>

      <HeroAside>
        <AsidePicture>
          <img src={profilePicture.src} alt={profilePicture.alt} />
        </AsidePicture>
        <Arrow>
          <ArrowIcon />
        </Arrow>
      </HeroAside>
    </HeroRow>
  );
}
