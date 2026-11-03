'use client';

import { useEffect, useRef } from 'react';

import { MediaImage, MediaVideo } from './index.styled';

/**
 * Image or video that fills its box.
 * - Default videos autoplay muted and only play while on screen, like the
 *   reference.
 * - `controls: true` videos wait for the visitor to press play, keep their
 *   sound, are shown uncropped on black, and pause when scrolled away.
 * - Images and videos given a `width` and `height` reserve their shape
 *   before they load.
 * - `eager` loads an image at once instead of when it nears the screen: the
 *   laptop slides need it, or a picture waiting off to the side arrives late.
 * - `lowPriority` is for an eager image below the first screen. It is still
 *   fetched at once, but behind the hero, the styles and the scripts, and the
 *   server no longer lists it among the preloads at the top of the page.
 * @param {{media: {type: 'image' | 'video', src: string, alt?: string, poster?: string, controls?: boolean, width?: number, height?: number}, eager?: boolean, lowPriority?: boolean}} props
 */
export function CaseMedia({ media, eager = false, lowPriority = false }) {
  /** @type {import('react').MutableRefObject<HTMLVideoElement>} */
  const videoRef = useRef(null);
  const withControls = Boolean(media.controls);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    //? Reduced motion: keep the first frame and let the visitor press play
    if (reduceMotion && !withControls) {
      video.controls = true;
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!withControls) video.play().catch(() => {});
      },
      { rootMargin: withControls ? '0px' : '20% 0px' },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, [withControls, media.src]);

  if (media.type === 'video') {
    return (
      <MediaVideo
        ref={videoRef}
        key={media.src}
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        $contain={withControls}
        controls={withControls}
        muted={!withControls}
        loop={!withControls}
        playsInline
        preload='metadata'
        aria-label={media.alt}
        aria-hidden={media.alt ? undefined : true}
      />
    );
  }

  return (
    <MediaImage
      src={media.src}
      alt={media.alt ?? ''}
      width={media.width}
      height={media.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding='async'
      fetchPriority={lowPriority ? 'low' : undefined}
    />
  );
}
