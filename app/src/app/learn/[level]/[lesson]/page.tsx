import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { resolveLearnPremiumAccess } from '@/modules/learn/access';
import LearnPlayer from '@/modules/learn/LearnPlayer';
import { IGCSE_PAPER_2 } from '@/modules/learn/curriculum';
import { findLesson, flattenLessons } from '@/modules/learn/path';
import { truncateDescription } from '@/shared/lib/seo';

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
  return {
    title: { absolute: `${title} | Paper 2 Path` },
    description: truncateDescription(found.lesson.why),
    robots: found.lesson.playable ? undefined : { index: false, follow: false },
  };
}

export default async function LearnLessonPage({ params }: Props) {
  const { level: levelSlug, lesson: lessonSlug } = await params;
  const found = findLesson(IGCSE_PAPER_2, levelSlug, lessonSlug);
  if (!found) notFound();
  const session = await auth();
  const premiumAccess = await resolveLearnPremiumAccess(session?.user);
  return <LearnPlayer level={found.level} lesson={found.lesson} premiumAccess={premiumAccess} />;
}
