import { ImageResponse } from 'next/og';

import { brand } from '@/data';

//? Generated from the brand data at request time, so there is no stock photo to
//? keep in sync. Next serves it at /opengraph-image and reuses it for Twitter.
export const alt = `${brand.firstName} ${brand.lastName}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#1c1d20',
          padding: '80px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#999d9e',
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#455ce9',
              marginRight: 16,
            }}
          />
          <div style={{ display: 'flex' }}>Portfolio</div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
            fontSize: 112,
            lineHeight: 1.05,
          }}
        >
          <div style={{ display: 'flex' }}>{brand.firstName}</div>
          <div style={{ display: 'flex' }}>{brand.lastName}</div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 48,
            height: 2,
            width: '100%',
            background: '#3a3d42',
          }}
        />
      </div>
    ),
    size,
  );
}
