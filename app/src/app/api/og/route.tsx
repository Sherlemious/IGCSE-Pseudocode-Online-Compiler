import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { OpenGraphCard } from '@/shared/brand/OpenGraphCard';

export const runtime = 'nodejs';

const size = { width: 1200, height: 630 };

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

/** Dev/render helper. Share previews use the static file at /og.png. */
export async function GET() {
  return new ImageResponse(<OpenGraphCard />, {
    ...size,
    fonts: await ogFonts(),
  });
}
