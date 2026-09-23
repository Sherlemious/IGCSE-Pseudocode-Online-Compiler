import { buildLlmsFullTxt } from '@/modules/docs/llmsTxt';
import { CATALOG_CACHE_CONTROL } from '@/shared/lib/catalogCache';

export const revalidate = 86400;

export async function GET() {
  const body = await buildLlmsFullTxt();
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': CATALOG_CACHE_CONTROL,
    },
  });
}
