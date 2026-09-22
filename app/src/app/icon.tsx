import { BRAND } from '@/shared/brand/brand';
import { markSvg } from '@/shared/brand/mark';

export const size = { width: 48, height: 48 };
export const contentType = 'image/svg+xml';

export default function Icon() {
  const svg = markSvg({ color: BRAND.colors.paper, background: BRAND.colors.ink, radius: 11 });
  return new Response(svg, { headers: { 'Content-Type': contentType } });
}
