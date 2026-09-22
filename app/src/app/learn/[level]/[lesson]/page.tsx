import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import LearnPlayer from '@/modules/learn/LearnPlayer';
import { IGCSE_PAPER_2 } from '@/modules/learn/curriculum';
import { findLesson, flattenLessons } from '@/modules/learn/path';
import { SHARE_IMAGE, SITE_URL, truncateDescription } from '@/shared/lib/seo';

interface Props {
  params: Promise<{ level: string; lesson: string }>;
}

export function generateStaticParams() {
  return flattenLessons(IGCSE_PAPER_2).map(({ level, lesson }) => ({
    level: level.slug,
    lesson: lesson.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level: levelSlug, lesson: lessonSlug } = await params;
  const found = findLesson(IGCSE_PAPER_2, levelSlug, lessonSlug);
  if (!found) {
    return { title: 'Lesson', robots: { index: false, follow: false } };
  }
  const title = `${found.lesson.title} · Level ${found.level.number} ${found.level.name}`;
  const path = `/learn/${found.level.slug}/${found.lesson.slug}`;
  const description = truncateDescription(
    `${found.lesson.why} Cambridge O Level 2210 and IGCSE 0478 Paper 2.`,
  );
  return {
    title: { absolute: `${title} | IGCSE & O Level Paper 2` },
    description,
    alternates: { canonical: path },
    robots: found.lesson.playable ? undefined : { index: false, follow: false },
    openGraph: {
      title: `${title} | IGCSE & O Level Paper 2`,
      description,
      url: path,
      type: 'article',
      images: [SHARE_IMAGE],
    },
  };
}

export default async function LearnLessonPage({ params }: Props) {
  const { level: levelSlug, lesson: lessonSlug } = await params;
  const found = findLesson(IGCSE_PAPER_2, levelSlug, lessonSlug);
  if (!found) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: found.lesson.title,
    description: found.lesson.why,
    url: `${SITE_URL}/learn/${found.level.slug}/${found.lesson.slug}`,
    educationalLevel: ['Cambridge O Level 2210', 'IGCSE 0478'],
    isAccessibleForFree: found.level.free,
    isPartOf: {
      '@type': 'Course',
      name: IGCSE_PAPER_2.title,
      url: `${SITE_URL}/learn`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LearnPlayer level={found.level} lesson={found.lesson} premiumAccess={!PREMIUM_GATING_ENABLED} />
    </>
  );
}
