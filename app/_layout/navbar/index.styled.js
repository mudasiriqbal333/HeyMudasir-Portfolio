'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { styled } from 'styled-components';

const MotionLink = motion(Link);

/* Reference: .nav-bar (style-new.css) */
export const Bar = styled.nav`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--gap-padding) / 2);
  color: ${({ $theme }) =>
    $theme === 'dark' ? 'var(--color-dark)' : 'var(--color-white)'};
  background: transparent;

  @media (max-width: 540px) {
    padding: var(--gap-padding) calc(var(--gap-padding) * 0.5)
      var(--gap-padding) calc(var(--gap-padding) * 0.33);
  }
`;

/* Reference: .btn-link .btn-click / .btn-text */
export const NavLink = styled(MotionLink)`
  height: 2.75em;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 calc(var(--gap-padding) / 2);
  font-size: 1em;
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  /* Active / hover dot */
  &::after {
    width: calc(clamp(16px, 1.2vw, 19px) / 2.75);
    height: calc(clamp(16px, 1.2vw, 19px) / 2.75);
    position: absolute;
    bottom: -0.5em;
    left: 50%;
    display: block;
    content: '';
    background: currentcolor;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: var(--animation-fast);
  }

  &[data-active='true']::after,
  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const Links = styled.ul`
  display: flex;
  align-items: center;

  /* Siblings lose their dot while another link is hovered */
  &:hover ${NavLink}[data-active='true']:not(:hover)::after {
    transform: translate(-50%, -50%) scale(0);
  }

  li:last-child {
    display: none;
  }

  @media (max-width: 540px) {
    li {
      display: none;
    }

    li:last-child {
      display: block;
    }
  }
`;

export const MenuButton = styled(motion.button)`
  height: 2.75em;
  display: inline-flex;
  align-items: center;
  padding: 0 calc(var(--gap-padding) / 2);
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;

  &::before {
    width: calc(clamp(16px, 1.2vw, 19px) / 2.75);
    height: calc(clamp(16px, 1.2vw, 19px) / 2.75);
    display: block;
    margin-right: 0.6em;
    content: '';
    background: currentcolor;
    border-radius: 50%;
  }
`;

/* Reference: .btn-link.btn-left-top (styleguide.css) */
export const Brand = styled(MotionLink)`
  height: 2.75em;
  display: flex;
  align-items: center;
  padding: 0 calc(var(--gap-padding) / 2);
  font-size: 1em;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;

  .credit {
    padding-right: 0.21em;
  }

  .credit span {
    position: relative;
    display: block;
    transition: var(--animation-primary);
    transform: translate(0, 0) rotate(0.001deg);
  }

  .cbd {
    position: relative;
    overflow: hidden;
    transition: var(--animation-primary);
  }

  .code-by,
  .name {
    position: relative;
    display: inline-block;
    transition: var(--animation-primary);
    transform: translateX(0) rotate(0.001deg);
  }

  .name {
    padding-right: 0.2em;
    padding-left: 0.21em;
  }

  /* Sits right after the first name, clipped by .cbd until hover widens it */
  .last-name {
    position: absolute;
    top: 0;
    left: 100%;
    padding-left: 0.1em;
    white-space: nowrap;
  }

  &:hover .credit span {
    transform: translate(0, 0) rotate(360deg);
  }

  &:hover .code-by,
  &:hover .name {
    transform: translateX(-3.7em) rotate(0.001deg);
  }

  &:hover .cbd {
    padding-right: 1.8em;
  }

  /* Reference disables the reveal on phones, where :hover sticks after a tap */
  @media (max-width: 540px) {
    &:hover .credit span {
      transform: translate(0, 0) rotate(0.001deg);
    }

    &:hover .code-by,
    &:hover .name {
      transform: translateX(0) rotate(0.001deg);
    }

    &:hover .cbd {
      padding-right: 0;
    }
  }
`;
