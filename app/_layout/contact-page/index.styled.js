'use client';

import { css, styled } from 'styled-components';

//? Fluid tokens mirrored from the reference design, scoped to this page.
export const Page = styled.main`
  --alert-error: #f44;
  --alert-success: #24c958;

  color: var(--color-white);
  background: var(--color-dark);
`;

export const Header = styled.section`
  position: relative;
  padding-top: calc(var(--section-padding) * 1.33);
  padding-bottom: calc(var(--section-padding) / 3);

  @media (max-width: 720px) {
    padding-top: calc(var(--section-padding) * 1.95);
  }
`;

export const Container = styled.div`
  max-width: 100em;
  margin: 0 auto;
  padding-inline: calc(var(--container-padding) * 2);

  @media (max-width: 540px) {
    padding-inline: var(--container-padding);
  }
`;

const row = css`
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

export const HeroRow = styled.div`
  ${row}
`;

export const HeroText = styled.div`
  width: 73%;
  position: relative;
  padding-right: calc(var(--container-padding) / 2);

  @media (max-width: 720px) {
    width: 100%;
    padding-right: 0;
  }
`;

export const HeroAside = styled.div`
  width: 27%;
  position: relative;
  padding-top: calc(clamp(3.25em, 7vw, 8em) * 0.875 * 1.175);
  padding-left: calc(var(--container-padding) / 2);

  @media (max-width: 720px) {
    width: 100%;
    height: calc(var(--section-padding) * 0.75);
    padding-left: 0;
  }
`;

export const Title = styled.h1`
  font-size: calc(clamp(3.25em, 7vw, 8em) * 0.875);
  line-height: 1.065;

  /* Direct children only: the inline picture is a span too */
  > span {
    display: block;
  }
`;

const ProfilePicture = styled.span`
  --size: clamp(4.5em, 6.5vw, 8em);

  width: var(--size);
  height: var(--size);
  position: relative;
  display: inline-flex;
  overflow: hidden;
  vertical-align: baseline;
  background: hsl(var(--secondary));
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    object-fit: cover;
  }
`;

export const InlinePicture = styled(ProfilePicture)`
  display: none;

  @media (max-width: 720px) {
    width: 0.95em;
    height: 0.95em;
    display: inline-flex;
    margin-right: 0.125em;
    transform: translateY(0.1em);
  }
`;

export const AsidePicture = styled(ProfilePicture)`
  @media (max-width: 720px) {
    display: none;
  }
`;

//? Absolutely positioned under the aside picture. Rendered as a div so its
//? static position (no left set) starts a new line at the column's left edge;
//? the 720px rule flips it to the top-right corner.
export const Arrow = styled.div`
  width: clamp(0.9em, 1.1vw, 1.1em);
  position: absolute;
  bottom: calc(var(--section-padding) * -0.5);
  transform: translateY(-50%);

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 720px) {
    inset: -4em 0.5em 0 auto;
    transform: translateY(-50%) scale(-1, 1);
  }
`;

export const FormRow = styled.div`
  ${row}

  padding-top: var(--section-padding);

  @media (max-width: 720px) {
    padding-top: 0;
  }
`;

export const FormCol = styled.div`
  width: 73%;
  position: relative;
  order: 2;
  padding-right: calc(var(--container-padding) / 2);

  @media (max-width: 720px) {
    width: 100%;
    padding-top: calc(var(--section-padding) * 0.25);
    padding-right: 0;
  }
`;

export const DetailsCol = styled.div`
  width: 27%;
  position: relative;
  order: 2;
  padding-left: calc(var(--container-padding) / 2);

  @media (max-width: 720px) {
    width: 100%;
    order: 1;
    padding-left: 0;
  }
`;

export const Form = styled.form`
  width: 100%;
  display: block;
`;

export const Honeypot = styled.div`
  position: absolute;
  left: -9999px;
`;

export const Field = styled.div`
  width: 100%;
  position: relative;
  display: block;
  padding: 0 2.75em;
  font-size: 1.33em;
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  transition: border-color 0.2s ease-in-out;

  /* Only the first visible row gets a top rule */
  & + & {
    border-top: 0;
  }

  &:focus-within {
    border-bottom-color: var(--color-white);
  }

  [data-number] {
    position: absolute;
    top: 3.4em;
    left: 0;
    margin: 0;
    font-size: 0.6em;
    line-height: 1.065;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.33;
  }

  label {
    width: 100%;
    display: block;
    padding-top: 1.66em;
    color: inherit;
    transition: all 0.2s ease-in-out;
  }

  &[data-filled='true'] label {
    opacity: 0.33;
  }

  input,
  textarea {
    width: 100%;
    display: block;
    margin-top: -0.33em;
    padding: 1em 0 2em;
    font-family: inherit;
    font-size: 1em;
    font-weight: inherit;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: 0;
    outline: 0;
    box-shadow: none;
    appearance: none;
  }

  /* Text inputs keep the browser's normal line box, as in the reference */
  input {
    line-height: normal;
  }

  textarea {
    resize: none;
  }

  input::placeholder,
  textarea::placeholder {
    color: inherit;
    opacity: 0.33;
  }

  @media (max-width: 720px) {
    padding: 0 0 0 1.5em;
    font-size: 1.15em;
  }
`;

export const Alert = styled.div`
  position: relative;
  padding-bottom: 0.75em;
  font-size: 1rem;
  line-height: 1.1em;
  transform: translateY(-1.5em);

  span {
    margin: 0;
    font-size: 1em;
    line-height: 1rem;
    color: var(--alert-error);
  }

  &::before {
    width: 0.3em;
    height: 0.3em;
    position: absolute;
    top: 0.35em;
    left: -3.85em;
    content: '';
    background: var(--alert-error);
    border-radius: 50%;
  }

  &[data-variant] {
    margin-top: 1.5em;
    padding-left: 2.75em;
    transform: none;
  }

  &[data-variant]::before {
    left: 1.75em;
  }

  &[data-variant='success'] span {
    color: var(--alert-success);
  }

  &[data-variant='success']::before {
    background: var(--alert-success);
  }
`;

export const SendWrapper = styled.div`
  position: relative;
  z-index: 5;
  float: right;
  transform: translate(-20%, -60%);
`;

const eyebrow = css`
  font-size: 0.6em;
  line-height: 1.065;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.5;
`;

/* The "Book a call" pill, above the contact details */
export const BookCall = styled.div`
  padding-bottom: 2.75em;
`;

export const Eyebrow = styled.h5`
  ${eyebrow}

  margin-bottom: 1em;
`;

export const LinkList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2.5em;

  li {
    height: 2em;
    display: flex;
    align-items: center;
  }

  p {
    margin: 0;
    line-height: 1.66;
  }
`;

export const SocialsBlock = styled.div`
  @media (max-width: 720px) {
    display: none;
  }
`;

/* Reference: .footer-contact, the slim footer on the contact page */
export const ContactFooter = styled.footer`
  width: 100%;
  margin-top: -1px;
  background: var(--color-dark);
  box-shadow: 0 5px 0 5px var(--color-dark);

  > div {
    padding-top: 0;
  }
`;
