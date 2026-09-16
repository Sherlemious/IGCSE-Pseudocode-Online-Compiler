import type { Metadata } from 'next';
import { Suspense } from 'react';
import LearnLadder from '@/modules/learn/LearnLadder';
import { SITE_URL } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Paper 2 Path | IGCSE Pseudocode Levels',
  },
  description:
    'A sequenced IGCSE Computer Science Paper 2 path. Ten levels of Cambridge pseudocode — write, run, and check in the browser. Levels 1–3 are free.',
  alternates: {
    canonical: '/learn',
  },
  openGraph: {
    title: 'Paper 2 Path | IGCSE Pseudocode Levels',
    description:
      'Ten levels of Cambridge IGCSE pseudocode. Write, run, and check in the browser. First three levels free.',
    url: `${SITE_URL}/learn`,
    type: 'website',
  },
};

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-background" />}>
      <LearnLadder />
    </Suspense>
  );
}
