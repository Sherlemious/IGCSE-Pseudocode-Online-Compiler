import { SITE_URL } from '@/shared/lib/seo';

export const revalidate = 86400;

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'meta-externalagent',
  'Amazonbot',
];

// https://contentsignals.org: search = indexing/results, ai-input = live answers
// (RAG, grounding), ai-train = model training. Training stays off.
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no';

const PUBLIC_ALLOW = [
  '/',
  '/docs',
  '/docs/',
  '/tutorial',
  '/tutorial/',
  '/learn',
  '/learn/',
  '/practice',
  '/practice/',
  '/examples',
  '/examples/',
  '/llms.txt',
  '/llms-full.txt',
  '/compare',
  '/faq',
  '/og.png',
  '/og-mark.png',
  '/og-wide.png',
  '/favicon.png',
];
const PRIVATE_DISALLOW = ['/api/', '/auth/', '/admin/', '/profile/', '/analytics/', '/exam$', '/exam/'];

// Hand-built rather than app/robots.ts: MetadataRoute.Robots has no Content-Signal field.
// `/examples` must be allowed explicitly: a `Disallow: /exam` prefix also
// matches `/examples` (robots.txt is longest-prefix, not exact).
function group(userAgents: string[]): string[] {
  return [
    ...userAgents.map((ua) => `User-Agent: ${ua}`),
    `Content-Signal: ${CONTENT_SIGNAL}`,
    ...PUBLIC_ALLOW.map((p) => `Allow: ${p}`),
    ...PRIVATE_DISALLOW.map((p) => `Disallow: ${p}`),
  ];
}

export async function GET() {
  const body = [...group(['*']), '', ...group(AI_CRAWLERS), '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
