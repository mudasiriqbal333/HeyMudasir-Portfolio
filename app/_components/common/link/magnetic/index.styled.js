'use client';

import { motion } from 'framer-motion';
import { styled } from 'styled-components';

/* Text link with the centre-growing underline (reference .btn-link-external) */
export const LinkAnchor = styled(motion.a)`
  height: 2em;
  position: relative;
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;

  &::after {
    width: 100%;
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 50%;
    content: '';
    background: currentcolor;
    transform: translate(-50%, -50%) scale(0, 1);
    transition: transform 0.3s cubic-bezier(0.7, 0, 0.3, 1);
  }

  &:focus-visible::after {
    transform: translate(-50%, -50%) scale(1, 1);
  }

  @media (hover: hover) {
    &:hover::after {
      transform: translate(-50%, -50%) scale(1, 1);
    }
  }
`;
