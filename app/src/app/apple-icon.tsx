/* eslint-disable @next/next/no-img-element -- ImageResponse / Satori only supports <img> */
import { ImageResponse } from 'next/og';
import { BRAND } from '@/shared/brand/brand';
import { markDataUri } from '@/shared/brand/mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BRAND.colors.ink,
        }}
      >
        <img src={markDataUri({ color: BRAND.colors.paper, size: 256 })} width={150} height={150} alt="" />
      </div>
    ),
    { ...size },
  );
}
