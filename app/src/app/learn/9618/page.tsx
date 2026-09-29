import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import LearnLadder from '@/modules/learn/LearnLadder';
import { ALEVEL_9618 } from '@/modules/learn/curriculum';
import { flattenLessons, lessonHref } from '@/modules/learn/path';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'AS & A Level 9618 Path | Cambridge Pseudocode',
  },
  description:
    'A sequenced Cambridge International 9618 path for students who already write IGCSE pseudocode. Records, CASE ranges, BYREF, random files, pointers, stacks, queues, linked lists, trees and classes. Levels 1–3 are free.',
  alternates: {
    canonical: '/learn/9618',
  },
  openGraph: {
    title: 'AS & A Level 9618 Path | Cambridge Pseudocode',
    description:
      'Eight levels of 9618 pseudocode, from records to classes. Write, run, and check in the browser. First three levels free.',
    url: `${SITE_URL}/learn/9618`,
    type: 'website',
    images: [SHARE_IMAGE],
  },
};

const learnJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: ALEVEL_9618.title,
  description: ALEVEL_9618.subtitle,
  url: `${SITE_URL}/learn/9618`,
  inLanguage: 'en',
  isAccessibleForFree: true,
  educationalLevel: ['Cambridge International AS Level 9618', 'Cambridge International A Level 9618'],
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  hasPart: flattenLessons(ALEVEL_9618)
    .filter(({ lesson }) => lesson.playable)
    .map(({ level, lesson }, index) => ({
      '@type': 'LearningResource',
      position: index + 1,
      name: `${lesson.title} · Level ${level.number} ${level.name}`,
      url: `${SITE_URL}${lessonHref(level, lesson, ALEVEL_9618.basePath)}`,
      isAccessibleForFree: level.free,
    })),
};

export default function ALevelLearnPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learnJsonLd) }} />
      <Suspense fallback={<div className="flex-1 bg-background" />}>
        <LearnLadder course={ALEVEL_9618} premiumAccess={!PREMIUM_GATING_ENABLED} />
      </Suspense>
    </>
  );
}
