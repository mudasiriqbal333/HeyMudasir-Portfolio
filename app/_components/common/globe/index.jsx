'use client';

import { forwardRef } from 'react';

import { GlobeShell, GlobeWrap } from './index.styled';

/**
 * Animated wireframe globe, used in the About page's blue disc and in the
 * home hero's "Located in" pill. Decorative, so it is hidden from assistive
 * technology. Extra props (className, data attributes) go to the outer
 * circle, which is what a page rotates on scroll.
 */
export const WireGlobe = forwardRef(
  /**
   * @param {import('react').HTMLAttributes<HTMLDivElement>} props
   * @param {import('react').ForwardedRef<HTMLDivElement>} ref
   */
  function WireGlobe(props, ref) {
    return (
      <GlobeShell ref={ref} aria-hidden='true' {...props}>
        <GlobeWrap>
          <div className='circle' />
          <div className='circle' />
          <div className='circle' />
          <div className='circle-hor' />
          <div className='circle-hor-middle' />
        </GlobeWrap>
      </GlobeShell>
    );
  },
);
