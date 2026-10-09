import type { MetadataRoute } from 'next';
import { getQuestionCatalog } from '@/shared/lib/catalogCache';
import { ALEVEL_9618, IGCSE_PAPER_2 } from '@/modules/learn/curriculum';
import { flattenLessons, lessonHref } from '@/modules/learn/path';
import { SITE_URL } from '@/shared/lib/seo';
import { BLOG_PATH, BLOG_POSTS, blogPageCount, blogPageHref, blogPostHref } from '@/modules/content/blog';
import { GUIDE_PAGES, guideHref } from '@/modules/content/guidePages';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let questionUrls: MetadataRoute.Sitemap = [];

  try {
    const questions = await getQuestionCatalog();

    questionUrls = questions.map((question) => ({
      url: `${SITE_URL}/practice/${question.id}`,
      lastModified: question.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    // Cached for a day: never publish a sitemap without the question pages.
    if (process.env.NODE_ENV === 'production') throw error;
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
      url: `${SITE_URL}/learn`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn/9618`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tutorial`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}${BLOG_PATH}`,
      lastModified: BLOG_POSTS[0] ? new Date(BLOG_POSTS[0].updated ?? BLOG_POSTS[0].published) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...Array.from({ length: blogPageCount() - 1 }, (_, i) => ({
      url: `${SITE_URL}${blogPageHref(i + 2)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE_URL}${blogPostHref(post)}`,
      lastModified: new Date(post.updated ?? post.published),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/editor`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/flowchart`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...GUIDE_PAGES.map((page) => ({
      url: `${SITE_URL}${guideHref(page.slug)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: page.slug === '9618' ? 0.8 : 0.7,
    })),
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/examples`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
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
    {
      url: `${SITE_URL}/refund`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...questionUrls,
    ...[IGCSE_PAPER_2, ALEVEL_9618].flatMap((course) =>
      flattenLessons(course)
        .filter(({ lesson }) => lesson.playable)
        .map(({ level, lesson }) => ({
          url: `${SITE_URL}${lessonHref(level, lesson, course.basePath)}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })),
    ),
  ];
}
