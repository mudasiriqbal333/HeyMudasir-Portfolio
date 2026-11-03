'use client';

import Image from 'next/image';

import { Stripe, TitleWithTagline } from '@/components';

import {
  Tile,
  TileFigure,
  TileImage,
  TileLink,
  TileMeta,
  Tiles,
  TilesContainer,
  TilesSection,
  TileTitle,
  TileWrap,
} from './index.styled';

/**
 * Reference section.work-tiles: the image tiles, two to a row, which stand
 * in for the rows at 1024px and below and are the "columns" view above
 * that. Every case is rendered; the ones the filter drops take no space.
 * A mouse over a tile shows the larger "View" disc without a preview image.
 * @param {Object} props
 * @param {typeof import('@/data').workOptions} props.items
 * @param {Set<string>} props.visible hrefs the current filter keeps
 * @param {'out' | 'in' | null} props.fade filter fade of the tiles
 * @param {boolean} props.open whether this is the chosen view
 * @param {'out' | 'in' | null} props.viewFade view-swap fade of the section
 * @param {ReturnType<typeof import('@/hooks').useFollowPointer>['bind']} props.bind
 */
export function WorkTiles({ items, visible, fade, open, viewFade, bind }) {
  return (
    <TilesSection
      data-work-tiles
      data-visible={open}
      data-fade={viewFade ?? undefined}
    >
      <TilesContainer>
        <Tiles>
          {items.map(
            (
              { href, title, tagline, services, year, image, background },
              index,
            ) => {
              const shown = visible.has(href);

              return (
                <Tile
                  key={href}
                  data-visible={shown}
                  data-fade={fade ?? undefined}
                  aria-hidden={shown ? undefined : true}
                >
                  <TileWrap>
                    <TileLink
                      href={href}
                      data-tile
                      tabIndex={shown ? undefined : -1}
                      {...bind(index, true)}
                    >
                      <TileFigure>
                        <TileImage
                          data-tile-image
                          style={{ backgroundColor: background }}
                        >
                          {/* A tile is half the row (whole at 620px and
                              below) and a wide thumbnail is cropped by its
                              height, so ask for more than the tile's width
                              to keep it sharp; the first is the largest
                              paint on phones and tablets */}
                          <Image
                            src={image}
                            alt=''
                            fill
                            sizes='(max-width: 620px) 100vw, 60vw'
                            priority={index === 0}
                            unoptimized={image.startsWith('data:')}
                          />
                        </TileImage>
                      </TileFigure>
                      <TileTitle>
                        <TitleWithTagline tagline={tagline} data-tile-tagline>
                          <h4 data-tile-title>
                            <span>{title}</span>
                          </h4>
                        </TitleWithTagline>
                        <Stripe />
                      </TileTitle>
                      <TileMeta>
                        <p data-tile-services>{services}</p>
                        <p data-tile-year>
                          <span>{year}</span>
                        </p>
                      </TileMeta>
                    </TileLink>
                  </TileWrap>
                </Tile>
              );
            },
          )}
        </Tiles>
      </TilesContainer>
    </TilesSection>
  );
}
