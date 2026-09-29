import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import LearnPlayer from '@/modules/learn/LearnPlayer';
import { ALEVEL_9618 } from '@/modules/learn/curriculum';
import { findLesson, flattenLessons, lessonHref } from '@/modules/learn/path';
import { SHARE_IMAGE, SITE_URL, truncateDescription } from '@/shared/lib/seo';

interface Props {
  params: Promise<{ level: string; lesson: string }>;
}

export function generateStaticParams() {
  return flattenLessons(ALEVEL_9618).map(({ level, lesson }) => ({
    level: level.slug,
    lesson: lesson.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level: levelSlug, lesson: lessonSlug } = await params;
  const found = findLesson(ALEVEL_9618, levelSlug, lessonSlug);
  if (!found) {
    return { title: 'Lesson', robots: { index: false, follow: false } };
  }
  const title = `${found.lesson.title} · Level ${found.level.number} ${found.level.name}`;
  const path = lessonHref(found.level, found.lesson, ALEVEL_9618.basePath);
  const description = truncateDescription(`${found.lesson.why} Cambridge International 9618.`, 160);
  return {
    title: { absolute: `${title} | AS & A Level 9618` },
    description,
    alternates: { canonical: path },
    robots: found.lesson.playable ? undefined : { index: false, follow: false },
    openGraph: {
      title: `${title} | AS & A Level 9618`,
      description,
      url: path,
      type: 'article',
      images: [SHARE_IMAGE],
    },
  };
}

export default async function ALevelLessonPage({ params }: Props) {
  const { level: levelSlug, lesson: lessonSlug } = await params;
  const found = findLesson(ALEVEL_9618, levelSlug, lessonSlug);
  if (!found) notFound();

  const path = lessonHref(found.level, found.lesson, ALEVEL_9618.basePath);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: found.lesson.title,
    description: found.lesson.why,
    url: `${SITE_URL}${path}`,
    educationalLevel: ['Cambridge International AS Level 9618', 'Cambridge International A Level 9618'],
    isAccessibleForFree: found.level.free,
    isPartOf: {
      '@type': 'Course',
      name: ALEVEL_9618.title,
      url: `${SITE_URL}/learn/9618`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LearnPlayer
        course={ALEVEL_9618}
        level={found.level}
        lesson={found.lesson}
        premiumAccess={!PREMIUM_GATING_ENABLED}
      />
    </>
  );
}
