import type { Metadata } from 'next';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import PracticeIndex from '@/modules/practice/PracticeIndex';
import { getQuestionCatalog } from '@/shared/lib/catalogCache';
import { SHARE_IMAGE, SITE_URL } from '@/shared/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute: 'Pseudocode Practice Checker | IGCSE & A Level Tester',
  },
  description:
    'Pseudocode checker and tester for Cambridge IGCSE and A Level. Practise past-paper questions, run them in the compiler, and check answers against hidden tests.',
  alternates: {
    canonical: '/practice',
  },
  openGraph: {
    title: 'Pseudocode Practice Checker | IGCSE & A Level Tester',
    description:
      'Pseudocode checker and tester for Cambridge IGCSE and A Level. Practise past-paper questions and check answers against hidden tests.',
    url: `${SITE_URL}/practice`,
    type: 'website',
    images: [SHARE_IMAGE],
  },
};

export default async function PracticePage() {
  let questions: Awaited<ReturnType<typeof getQuestionCatalog>> = [];
  try {
    questions = await getQuestionCatalog();
  } catch (error) {
    // This page is cached for a day, so an empty list here would be served to
    // everyone until the next deploy (Oct 2026: a build ran before a schema
    // push and shipped "All 0"). Throwing fails the build, keeping the old
    // deployment live, or keeps the last good page on revalidation.
    if (process.env.NODE_ENV === 'production') throw error;
    // Local dev without a database: show the empty list.
  }

  return <PracticeIndex questions={questions} gatingEnabled={PREMIUM_GATING_ENABLED} />;
}
