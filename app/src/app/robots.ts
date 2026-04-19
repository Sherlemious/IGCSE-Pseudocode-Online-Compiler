import type { MetadataRoute } from 'next';

const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/analytics/', '/exam'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
