import { buildLlmsTxt } from '@/modules/docs/llmsTxt';

export const revalidate = 3600;

export async function GET() {
  const body = await buildLlmsTxt();
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
