import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let questionUrls: MetadataRoute.Sitemap = [];

  try {
    const questions = await prisma.question.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000,
    });

    questionUrls = questions.map((question) => ({
      url: `${SITE_URL}/practice/${question.id}`,
      lastModified: question.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    questionUrls = [];
  }

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/practice`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/flowchart`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...questionUrls,
  ];
}
