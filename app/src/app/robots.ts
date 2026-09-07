import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/lib/seo';

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

const PUBLIC_ALLOW = ['/', '/examples', '/examples/', '/llms.txt', '/llms-full.txt', '/compare', '/faq'];
const PRIVATE_DISALLOW = ['/api/', '/auth/', '/admin/', '/profile/', '/analytics/', '/exam$', '/exam/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // `/examples` must be allowed explicitly: a `Disallow: /exam` prefix
        // also matches `/examples` (robots.txt is longest-prefix, not exact).
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
