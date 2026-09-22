import { SITE_NAME } from '@/shared/lib/seo';

/** Visual identity for surfaces around the editor — never inside it. */
export const BRAND = {
  shortName: 'Pseudocode Compiler',
  maker: 'Sherlemious',
  tagline: 'Write, run and trace Cambridge pseudocode in your browser',
  colors: {
    ink: '#111726',
    paper: '#F3EEE3',
    red: '#E5533D',
    highlight: '#F2C94C',
    rule: '#9FB3D1',
  },
} as const;

export { SITE_NAME };
export type BrandColors = (typeof BRAND)['colors'];
