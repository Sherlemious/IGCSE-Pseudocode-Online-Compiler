import type { MetadataRoute } from 'next';
import { BRAND } from '@/shared/brand/brand';
import { DEFAULT_DESCRIPTION, SITE_NAME } from '@/shared/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: BRAND.shortName,
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: BRAND.colors.ink,
    theme_color: BRAND.colors.ink,
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
