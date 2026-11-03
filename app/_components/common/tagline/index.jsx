'use client';

import { Lockup, Tagline } from './index.styled';

export { Lockup, Tagline } from './index.styled';

/**
 * A list title with the project's optional tagline hanging under it, ending
 * under the title's last letter. A title without a tagline is returned as it
 * is, so it keeps its own box.
 * @param {Object} props
 * @param {string} [props.tagline]
 * @param {import('react').ReactNode} props.children the title
 */
export function TitleWithTagline({ tagline, children, ...rest }) {
  if (!tagline) return children;

  return (
    <Lockup>
      {children}
      <Tagline $hang {...rest}>
        {tagline}
      </Tagline>
    </Lockup>
  );
}
