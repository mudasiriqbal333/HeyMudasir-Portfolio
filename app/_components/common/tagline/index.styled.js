'use client';

import { css, styled } from 'styled-components';

/* A title together with its tagline: exactly as wide as the title, so the
   tagline can end under the title's last letter. */
export const Lockup = styled.div`
  position: relative;
  width: fit-content;
  max-width: 100%;
`;

/* A project's optional short line under its title ("Powered by BMW"), in the
   small uppercase style of the site's labels. Inside a Lockup it ends under
   the title's last letter; one longer than the title starts under the title
   instead and runs on to the right. With $hang it is taken out of the flow,
   just under the title, in the space a list row already has there, so the
   row stays as tall as the rows around it. */
export const Tagline = styled.small`
  display: block;
  font-size: 0.6em;
  font-weight: 450;
  line-height: 1.065;
  letter-spacing: 0.05em;
  text-align: right;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0.66;

  ${({ $hang }) =>
    $hang &&
    css`
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      margin-top: 0.9em;
    `}
`;
