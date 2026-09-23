import { BRAND } from './brand';

/**
 * The Examiner Owl, on a 48×48 grid: a pair of braces for the face, ringed eyes and the
 * arrowhead as a red beak. Class names hook the entrance and hover motion in globals.css.
 */

/** Circle as a path, so a disc and its hole can share one even-odd fill. */
const disc = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

const BRACE_LEFT =
  'M13.6 8.6C9.6 8.6 8.3 10.9 8.3 14.8V19.1C8.3 21.5 6.8 23 4.5 24C6.8 25 8.3 26.5 8.3 28.9V33.2C8.3 37.1 9.6 39.4 13.6 39.4';
const BRACE_RIGHT =
  'M34.4 8.6C38.4 8.6 39.7 10.9 39.7 14.8V19.1C39.7 21.5 41.2 23 43.5 24C41.2 25 39.7 26.5 39.7 28.9V33.2C39.7 37.1 38.4 39.4 34.4 39.4';

const brace = (d: string, fg: string) =>
  `<path d="${d}" stroke="${fg}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

const eye = (cx: number, fg: string, side: 'l' | 'r') =>
  `<path class="mk-owl-eye mk-owl-eye-${side}" fill-rule="evenodd" fill="${fg}" d="${disc(cx, 21, 6.2)}${disc(cx + 1.2, 20.1, 2.6)}"/>`;

/** Inner markup; `fg` paints the braces and eyes (currentColor in the UI). */
export function markBody(fg: string): string {
  const red = BRAND.colors.red;
  return (
    brace(BRACE_LEFT, fg) +
    brace(BRACE_RIGHT, fg) +
    eye(18.3, fg, 'l') +
    eye(29.7, fg, 'r') +
    `<path class="mk-owl-beak" d="M21 29.2H27L24 34.4Z" fill="${red}" stroke="${red}" stroke-width="1.6" stroke-linejoin="round"/>`
  );
}

type SvgOptions = {
  color?: string;
  background?: string;
  radius?: number;
  size?: number;
};

export function markSvg(opts: SvgOptions = {}): string {
  const { color = BRAND.colors.paper, background, radius = 10, size = 48 } = opts;
  const bg = background ? `<rect width="48" height="48" rx="${radius}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" fill="none">${bg}${markBody(color)}</svg>`;
}

export function markDataUri(opts: SvgOptions = {}): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(markSvg(opts))}`;
}
