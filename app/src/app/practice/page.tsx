import type { Metadata } from 'next';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import PracticeIndex from '@/modules/practice/PracticeIndex';
import { getQuestionCatalog } from '@/shared/lib/catalogCache';
import { SITE_URL } from '@/shared/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: 'Pseudocode Practice Questions | IGCSE & A Level Past Papers',
  },
  description:
    'Free Cambridge IGCSE and A Level pseudocode practice questions from past papers. Run algorithms in the online compiler, check answers with hidden tests, and use hints and trace tables.',
  alternates: {
    canonical: '/practice',
  },
  openGraph: {
    title: 'Pseudocode Practice Questions | IGCSE & A Level Past Papers',
    description:
      'Free Cambridge IGCSE and A Level pseudocode practice questions from past papers. Run algorithms in the online compiler with hidden tests, hints and trace tables.',
    url: `${SITE_URL}/practice`,
    type: 'website',
  },
};

export default async function PracticePage() {
  let questions: Awaited<ReturnType<typeof getQuestionCatalog>> = [];
  try {
    questions = await getQuestionCatalog();
  } catch {
    // DB not yet configured — show placeholder
  }

  return <PracticeIndex questions={questions} gatingEnabled={PREMIUM_GATING_ENABLED} />;
}
