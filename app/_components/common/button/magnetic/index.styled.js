'use client';

import { motion } from 'framer-motion';
import { css, styled } from 'styled-components';

export const MagneticItem = styled(motion.span)`
  position: relative;
  z-index: 1;
  display: block;
  width: max-content;
  max-width: 14ch;
  word-break: break-all;

  ${({ $nowrap }) =>
    $nowrap &&
    css`
      max-width: none;
      white-space: nowrap;
      word-break: normal;
    `}
`;
