'use client';

import { useEffect, useRef, useState } from 'react';

import { Container } from '@/components';
import { useMediaQuery, useSpeedParallax } from '@/hooks';
import { cycleIndex, groupScreenRuns } from '@/utils';

import {
  Block,
  Device,
  DeviceFrame,
  DeviceRow,
  DeviceScreen,
  FadeSlide,
  FullwidthBlock,
  FullwidthMedia,
  GalleryButton,
  GalleryCount,
  MobileCol,
  MobilesBlock,
  MobilesRow,
  Phone,
  PhoneDevice,
  PhoneDeviceClip,
  PhoneDeviceScreen,
  PhoneIsland,
  PhoneRow,
  PhoneScreen,
  PlainRow,
  PlainScreen,
  Slide,
  SliderStrip,
  SliderViewport,
  StripItem,
  StripTrack,
  StripViewport,
  Tint,
} from './index.styled';
import { CaseMedia } from './media';
import { useStripMotion } from './use-strip-motion';

function Chevron({ direction }) {
  return (
    <svg
      viewBox='0 0 10 16'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
      aria-hidden='true'
    >
      {direction === 'previous' ? (
        <polyline points='8 1 2 8 8 15' />
      ) : (
        <polyline points='2 1 8 8 2 15' />
      )}
    </svg>
  );
}

/**
 * What the laptop screen shows: one media, or several with previous / next
 * arrows (the visitor steps through them; each video keeps its own controls).
 * @param {{media: object | object[]}} props
 */
function DeviceMedia({ media }) {
  const items = Array.isArray(media) ? media : [media];
  const [index, setIndex] = useState(0);
  const current = items[Math.min(index, items.length - 1)];

  if (items.length < 2) return <CaseMedia media={current} />;

  const step = delta =>
    setIndex(value => cycleIndex(value, delta, items.length));

  return (
    <>
      <CaseMedia media={current} />
      <GalleryCount aria-live='polite'>
        {index + 1} / {items.length}
      </GalleryCount>
      <GalleryButton
        type='button'
        data-side='previous'
        aria-label='Previous video'
        onClick={() => step(-1)}
      >
        <Chevron direction='previous' />
      </GalleryButton>
      <GalleryButton
        type='button'
        data-side='next'
        aria-label='Next video'
        onClick={() => step(1)}
      >
        <Chevron direction='next' />
      </GalleryButton>
    </>
  );
}

//? How much longer the laptop holds its first picture than the others.
const FIRST_PICTURE_EXTRA_MS = 2000;

/**
 * Laptop gallery for a project with no recording: its pictures slide by on
 * their own, one every `interval` ms, always in the same direction. It only
 * runs while the laptop is on screen, waits while the mouse is over it or an
 * arrow has focus, and stands still under reduced motion; a click on the
 * screen or an arrow always works and restarts the wait.
 *
 * Two ways to change picture. `slide` (the default) moves a strip sideways,
 * with no seam in the loop: a copy of the first picture sits after the last
 * one, the strip slides on to that copy, then jumps back to the real first
 * picture without animating, which looks like nothing happened. `fade`
 * stacks the pictures and cross-fades from one to the next.
 *
 * Every picture is fetched at once, so none arrives after its turn. Only the
 * first is wanted early; the others queue behind the top of the page.
 * @param {{media: object[], interval: number, effect?: 'slide' | 'fade'}} props
 */
function DeviceSlider({ media, interval, effect = 'slide' }) {
  const count = media.length;
  const fade = effect === 'fade';
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const ref = useRef(null);
  const frames = useRef([]);
  //? 0 .. count, where `count` is the copy of the first picture
  const [position, setPosition] = useState(0);
  const [instant, setInstant] = useState(false);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const index = position % count;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      frames.current.forEach(cancelAnimationFrame);
    };
  }, []);

  /** Put the strip at `from` without animating, then slide it to `to`. */
  const jumpThenSlide = (from, to) => {
    setInstant(true);
    setPosition(from);
    //? Two frames: the first paints the jump, the second starts the slide
    const first = requestAnimationFrame(() => {
      const second = requestAnimationFrame(() => {
        setInstant(false);
        setPosition(to);
      });
      frames.current.push(second);
    });
    frames.current = [first];
  };

  /** @param {1 | -1} delta */
  const step = delta => {
    if (fade) setPosition(cycleIndex(index, delta, count));
    else if (reduceMotion) {
      setInstant(true);
      setPosition(cycleIndex(index, delta, count));
    } else if (delta > 0) {
      //? Already on the copy (its slide still running): restart from the
      //? real first picture
      if (position >= count) jumpThenSlide(0, 1);
      else {
        setInstant(false);
        setPosition(position + 1);
      }
    } else if (position === 0) jumpThenSlide(count, count - 1);
    else {
      setInstant(false);
      setPosition(position - 1);
    }
  };

  //? One wait per picture: it starts again whenever the picture changes, so
  //? a click also restarts it. The first picture is the one the project
  //? leads with, so it stays up a little longer than the rest.
  useEffect(() => {
    if (reduceMotion || !inView || hovered || focused) return undefined;

    const wait = index === 0 ? interval + FIRST_PICTURE_EXTRA_MS : interval;
    const timer = setTimeout(() => step(1), wait);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, inView, hovered, focused, reduceMotion, interval]);

  return (
    <div
      ref={ref}
      role='group'
      aria-roledescription='carousel'
      aria-label='Screens'
      className='absolute inset-0'
      onPointerEnter={event =>
        event.pointerType === 'mouse' && setHovered(true)
      }
      onPointerLeave={event =>
        event.pointerType === 'mouse' && setHovered(false)
      }
      onFocus={() => setFocused(true)}
      onBlur={event =>
        !event.currentTarget.contains(event.relatedTarget) && setFocused(false)
      }
    >
      {/* A click on the right half of the screen goes forward, on the left
          half back */}
      <SliderViewport
        onClick={event => {
          const { left, width } = event.currentTarget.getBoundingClientRect();
          step(event.clientX - left < width / 2 ? -1 : 1);
        }}
      >
        {fade ? (
          media.map((item, at) => (
            <FadeSlide
              key={at}
              data-current={at === index || undefined}
              aria-hidden={at === index ? undefined : true}
            >
              <CaseMedia media={item} eager lowPriority={at > 0} />
            </FadeSlide>
          ))
        ) : (
          <SliderStrip
            style={{ '--slide': position }}
            data-instant={instant || undefined}
            onTransitionEnd={event => {
              //? Landed on the copy: swap to the real first picture unseen
              if (event.target === event.currentTarget && position === count) {
                setInstant(true);
                setPosition(0);
              }
            }}
          >
            {media.map((item, at) => (
              <Slide key={at} aria-hidden={at === index ? undefined : true}>
                <CaseMedia media={item} eager lowPriority={at > 0} />
              </Slide>
            ))}
            <Slide aria-hidden='true'>
              <CaseMedia media={{ ...media[0], alt: '' }} eager />
            </Slide>
          </SliderStrip>
        )}
      </SliderViewport>
      {/* Not a live region: it changes by itself every few seconds */}
      <GalleryCount>
        {index + 1} / {count}
      </GalleryCount>
      {/* No arrows on show: the screen itself is the control. These two stay
          for the keyboard and appear only when tabbed to */}
      <GalleryButton
        type='button'
        data-side='previous'
        data-quiet
        aria-label='Previous screen'
        onClick={() => step(-1)}
      >
        <Chevron direction='previous' />
      </GalleryButton>
      <GalleryButton
        type='button'
        data-side='next'
        data-quiet
        aria-label='Next screen'
        onClick={() => step(1)}
      >
        <Chevron direction='next' />
      </GalleryButton>
    </div>
  );
}

/**
 * A phone in place of the laptop, for an app that only runs on phones: the
 * same slideshow, or the same single picture or video, on a phone's screen.
 * The screen takes the shape of the first picture and every picture fills
 * it (the project data check says when one has another shape).
 * @param {{block: object, background: string, last?: boolean}} props
 */
function PhoneBlock({ block, background, last }) {
  const slides =
    block.autoplay && Array.isArray(block.media) && block.media.length > 1;
  const first = Array.isArray(block.media) ? block.media[0] : block.media;
  const ratio =
    first?.width && first?.height ? first.width / first.height : undefined;

  return (
    <Block
      style={{ '--block-bg': background }}
      data-padding-bottom={Boolean(block.paddingBottom)}
      data-last={last || undefined}
    >
      <Container>
        <PhoneRow>
          <PhoneDevice
            data-device='phone'
            style={ratio ? { '--screen-ratio': ratio } : undefined}
          >
            <PhoneDeviceScreen>
              {slides ? (
                <DeviceSlider
                  media={block.media}
                  interval={block.autoplay}
                  effect={block.effect}
                />
              ) : (
                <PhoneDeviceClip>
                  <DeviceMedia media={block.media} />
                </PhoneDeviceClip>
              )}
            </PhoneDeviceScreen>
            <PhoneIsland aria-hidden='true' />
          </PhoneDevice>
        </PhoneRow>
      </Container>
    </Block>
  );
}

function DeviceBlock({ block, background, frame, last }) {
  if (block.device === 'phone') {
    return <PhoneBlock block={block} background={background} last={last} />;
  }

  //? `autoplay: <ms>` on a block with several pictures makes them slide by
  //? themselves; anything else keeps the click-through gallery.
  const slides =
    block.autoplay && Array.isArray(block.media) && block.media.length > 1;

  return (
    <Block
      style={{ '--block-bg': background }}
      data-padding-bottom={Boolean(block.paddingBottom)}
      data-last={last || undefined}
    >
      <Container>
        <DeviceRow>
          <Device>
            <DeviceFrame
              data-drawn={!frame}
              style={frame ? { '--device-frame': `url(${frame})` } : undefined}
            >
              {frame ? null : <div className='lid' aria-hidden='true' />}
            </DeviceFrame>
            <DeviceScreen>
              {slides ? (
                <DeviceSlider
                  media={block.media}
                  interval={block.autoplay}
                  effect={block.effect}
                />
              ) : (
                <DeviceMedia media={block.media} />
              )}
            </DeviceScreen>
          </Device>
        </DeviceRow>
      </Container>
    </Block>
  );
}

function PlainBlock({ block, background, last }) {
  return (
    <Block
      style={{ '--block-bg': background }}
      data-padding-bottom={Boolean(block.paddingBottom)}
      data-last={last || undefined}
    >
      <Container>
        <PlainRow>
          <PlainScreen data-natural={block.media.type === 'image'}>
            <CaseMedia media={block.media} />
          </PlainScreen>
        </PlainRow>
      </Container>
    </Block>
  );
}

/**
 * Several screenshots in a row (silent clips too, playing while in view): one
 * strip that drifts from right to left on a loop. A sideways scroll or a drag
 * with the cursor on it takes it over until
 * the cursor leaves (see useStripMotion). The pictures are repeated to close
 * the loop; only the first set is announced. They are fetched at once, so
 * none drifts in unloaded, but behind the top of the page.
 * @param {{blocks: Array<object>, background: string}} props
 */
function ScreensStrip({ blocks, background, last }) {
  const { viewportRef, trackRef, copies, dragging } = useStripMotion(
    blocks.length,
  );

  return (
    <Block
      style={{ '--block-bg': background }}
      data-padding-bottom={blocks.some(block => block.paddingBottom)}
      data-last={last || undefined}
    >
      <StripViewport
        ref={viewportRef}
        role='group'
        aria-roledescription='carousel'
        aria-label='Screenshots'
        tabIndex={0}
        data-dragging={dragging || undefined}
        data-screens-strip
      >
        <StripTrack ref={trackRef}>
          {Array.from({ length: copies }, (_, copy) =>
            blocks.map(({ media }, at) => (
              <StripItem
                key={`${copy}-${at}`}
                aria-hidden={copy ? true : undefined}
                style={
                  media.width && media.height
                    ? { '--ratio': media.width / media.height }
                    : undefined
                }
              >
                <PlainScreen data-natural='true'>
                  <CaseMedia
                    media={copy ? { ...media, alt: '' } : media}
                    eager
                    lowPriority
                  />
                </PlainScreen>
              </StripItem>
            )),
          )}
        </StripTrack>
      </StripViewport>
    </Block>
  );
}

function FullwidthBlockView({ block, parallax }) {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const ref = useRef(null);
  //? Reference data-scroll-speed="-3": 0.3x the distance to the viewport centre
  const y = useSpeedParallax(ref, 0.3);

  return (
    <FullwidthBlock ref={ref}>
      <FullwidthMedia style={parallax ? { y } : undefined}>
        <CaseMedia media={block.media} />
      </FullwidthMedia>
      {block.tint ? <Tint style={{ opacity: block.tint }} /> : null}
    </FullwidthBlock>
  );
}

function MobilesBlockView({ block, background, parallax }) {
  /** @type {import('react').MutableRefObject<HTMLElement>} */
  const ref = useRef(null);
  //? Reference: first phone at speed 1 (lags), last at -1 (leads), middle static
  const up = useSpeedParallax(ref, -0.1);
  const down = useSpeedParallax(ref, 0.1);
  const amount = Math.min(block.media.length, 3);
  const offsets = [up, null, down];

  return (
    <MobilesBlock ref={ref} style={{ '--block-bg': background }}>
      <MobilesRow data-amount={amount}>
        {block.media.slice(0, 3).map((media, index) => (
          <MobileCol key={`${index}-${media.src}`}>
            <Phone
              style={
                parallax && offsets[index] ? { y: offsets[index] } : undefined
              }
            >
              <PhoneScreen>
                <CaseMedia media={media} />
              </PhoneScreen>
            </Phone>
          </MobileCol>
        ))}
      </MobilesRow>
    </MobilesBlock>
  );
}

/**
 * @param {{blocks: Array<object>, background: string, frame?: string, parallax: boolean}} props
 */
export function CaseBlocks({ blocks, background, frame, parallax }) {
  //? Screenshots in a row become one moving strip, which a laptop slideshow's
  //? later pictures also join
  const groups = groupScreenRuns(blocks);

  return groups.map(({ index, block, strip }, at) => {
    //? The block right above the footer keeps some room under it (the phones
    //? and full-width pictures bring their own)
    const last = at === groups.length - 1;

    if (strip) {
      return (
        <ScreensStrip
          key={`strip-${index}`}
          last={last}
          blocks={strip}
          background={
            strip.find(item => item.background)?.background ?? background
          }
        />
      );
    }

    const bg = block.background ?? background;
    const key = `${block.type}-${index}`;

    switch (block.type) {
      case 'device':
        return (
          <DeviceBlock
            key={key}
            block={block}
            background={bg}
            frame={frame}
            last={last}
          />
        );
      case 'plain':
        return (
          <PlainBlock key={key} block={block} background={bg} last={last} />
        );
      case 'fullwidth':
        return (
          <FullwidthBlockView key={key} block={block} parallax={parallax} />
        );
      case 'mobiles':
        return (
          <MobilesBlockView
            key={key}
            block={block}
            background={bg}
            parallax={parallax}
          />
        );
      default:
        return null;
    }
  });
}
