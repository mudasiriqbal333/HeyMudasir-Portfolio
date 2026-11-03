'use client';

import Image from 'next/image';

import { Stripe, TitleWithTagline } from '@/components';

import {
  Section,
  Tile,
  TileImage,
  TileLink,
  TileMeta,
  Tiles,
  TilesContainer,
  TileTitle,
} from './index.styled';

/**
 * Image tiles that stand in for the rows at 1024px and below. A mouse over a
 * tile shows the larger "View" disc without a preview image.
 * @param {Object} props
 * @param {typeof import('@/data').thumbnailOptions} props.items
 * @param {ReturnType<typeof import('@/hooks').useFollowPointer>['bind']} props.bind
 */
export function ThumbnailTiles({ items, bind }) {
  return (
    <Section>
      <TilesContainer>
        <Tiles>
          {items.map(
            (
              { href, title, tagline, services, year, image, background },
              index,
            ) => (
              <Tile key={href}>
                <TileLink href={href} {...bind(index, true)}>
                  <TileImage style={{ backgroundColor: background }}>
                    {/* Wide thumbnails are cropped by height, so ask for
                        more than the tile's width to keep them sharp */}
                    <Image
                      src={image}
                      alt=''
                      fill
                      sizes='100vw'
                      unoptimized={image.startsWith('data:')}
                    />
                  </TileImage>
                  <TileTitle>
                    <TitleWithTagline tagline={tagline}>
                      <h4>
                        <span>{title}</span>
                      </h4>
                    </TitleWithTagline>
                    <Stripe />
                  </TileTitle>
                  <TileMeta>
                    <p>{services}</p>
                    <p>{year}</p>
                  </TileMeta>
                </TileLink>
              </Tile>
            ),
          )}
        </Tiles>
      </TilesContainer>
    </Section>
  );
}
