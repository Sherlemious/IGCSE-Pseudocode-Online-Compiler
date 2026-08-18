import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // `/examples` must be allowed explicitly: a `Disallow: /exam` prefix
      // also matches `/examples` (robots.txt is longest-prefix, not exact).
      allow: ['/', '/examples', '/examples/'],
      disallow: ['/api/', '/auth/', '/admin/', '/profile/', '/analytics/', '/exam$', '/exam/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
