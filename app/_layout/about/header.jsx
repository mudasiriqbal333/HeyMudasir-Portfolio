'use client';

import { ContainerMedium } from '@/components';
import { aboutOptions } from '@/data';

import { Header, Title } from './index.styled';

export function AboutHeader() {
  const { heading } = aboutOptions;

  return (
    <Header>
      <ContainerMedium data-once-in>
        <Title>
          {heading.map((line, index) => (
            <span key={line}>
              {line}
              {index < heading.length - 1 ? ' ' : null}
            </span>
          ))}
        </Title>
      </ContainerMedium>
    </Header>
  );
}
