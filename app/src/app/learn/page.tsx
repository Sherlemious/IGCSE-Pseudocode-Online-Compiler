import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import LearnLadder from '@/modules/learn/LearnLadder';
import { IGCSE_PAPER_2 } from '@/modules/learn/curriculum';
import { flattenLessons, lessonHref } from '@/modules/learn/path';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Paper 2 Path | IGCSE & O Level 2210 Pseudocode Course',
  },
  description:
    'A sequenced Cambridge O Level 2210 and IGCSE 0478 Paper 2 path. Ten levels of pseudocode — write, run, and check in the browser. Levels 1–3 are free. Start with the written tutorial if you are new.',
  alternates: {
    canonical: '/learn',
  },
  openGraph: {
    title: 'Paper 2 Path | IGCSE & O Level 2210 Pseudocode Course',
    description:
      'Ten levels of Cambridge O Level 2210 and IGCSE 0478 pseudocode. Write, run, and check in the browser. First three levels free.',
    url: `${SITE_URL}/learn`,
    type: 'website',
    images: [SHARE_IMAGE],
  },
};

const learnJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: IGCSE_PAPER_2.title,
  description: IGCSE_PAPER_2.subtitle,
  url: `${SITE_URL}/learn`,
  inLanguage: 'en',
  isAccessibleForFree: true,
  educationalLevel: ['Cambridge O Level 2210', 'IGCSE 0478', 'IGCSE 0984'],
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  hasPart: flattenLessons(IGCSE_PAPER_2)
    .filter(({ lesson }) => lesson.playable)
    .map(({ level, lesson }, index) => ({
      '@type': 'LearningResource',
      position: index + 1,
      name: `${lesson.title} · Level ${level.number} ${level.name}`,
      url: `${SITE_URL}${lessonHref(level, lesson)}`,
      isAccessibleForFree: level.free,
    })),
};

export default function LearnPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learnJsonLd) }} />
      <Suspense fallback={<div className="flex-1 bg-background" />}>
        <LearnLadder premiumAccess={!PREMIUM_GATING_ENABLED} />
      </Suspense>
    </>
  );
}
