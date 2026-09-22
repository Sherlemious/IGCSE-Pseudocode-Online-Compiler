import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { OG_SQUARE, OG_WIDE, OpenGraphCard, OpenGraphMark } from '@/shared/brand/OpenGraphCard';

export const runtime = 'nodejs';

async function ogFonts() {
  const dir = join(process.cwd(), 'src/shared/brand/fonts');
  const [fraunces, fira] = await Promise.all([
    readFile(join(dir, 'Fraunces-SemiBoldItalic.ttf')),
    readFile(join(dir, 'FiraCode-Regular.ttf')),
  ]);
  return [
    { name: 'Fraunces', data: fraunces, style: 'italic' as const, weight: 600 as const },
    { name: 'Fira Code', data: fira, style: 'normal' as const, weight: 400 as const },
  ];
}

/** Dev/render helper. Share previews use the static files at /og-mark.png and /og-wide.png. */
export async function GET(request: Request) {
  const wide = new URL(request.url).searchParams.get('wide') === '1';
  if (wide) {
    return new ImageResponse(<OpenGraphCard />, {
      ...OG_WIDE,
      fonts: await ogFonts(),
    });
  }
  return new ImageResponse(<OpenGraphMark />, { ...OG_SQUARE });
}
