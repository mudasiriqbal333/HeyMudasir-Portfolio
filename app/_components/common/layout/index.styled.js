'use client';

import { css, styled } from 'styled-components';

/* Reference layout primitives: .container, .container.medium, .row, .stripe */

const container = css`
  max-width: 100em;
  margin: 0 auto;
`;

export const Container = styled.div`
  ${container}

  padding-inline: var(--container-padding);
`;

export const ContainerMedium = styled.div`
  ${container}

  padding-inline: calc(var(--container-padding) * 2);

  @media (max-width: 540px) {
    padding-inline: var(--container-padding);
  }
`;

export const Row = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

export const Stripe = styled.div`
  width: 100%;
  height: 1px;
  display: block;
  background: var(--color-border);
`;
