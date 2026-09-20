import type { Metadata } from 'next';
import { SITE_URL } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Cambridge Pseudocode Guide | IGCSE 0478, O Level 2210 & A Level 9618',
  },
  description:
    'Free Cambridge IGCSE 0478, O Level 2210 and A Level 9618 pseudocode guide. DECLARE, CONSTANT, DIV, ROUND, not equal to (<>) and the full syntax — run every example in the online compiler.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'Cambridge Pseudocode Guide — IGCSE 0478, O Level 2210 & A Level 9618',
    description:
      'Official-style Cambridge pseudocode syntax: DECLARE, CONSTANT, DIV, ROUND, loops, arrays, procedures and A Level OOP. Run examples in the browser.',
    url: `${SITE_URL}/docs`,
    type: 'article',
  },
  keywords: [
    'cambridge pseudocode guide',
    'cambridge o level 2210 pseudocode',
    'o level computer science 2210',
    '9618 pseudocode guide',
    '0478 pseudocode guide',
    'igcse pseudocode guide',
    'cie pseudocode guide',
    'a level pseudocode guide',
    'cambridge pseudocode syntax',
    'DIV in pseudocode',
    'how to declare a constant in pseudocode',
    'how to round in pseudocode',
    'not equal to in pseudocode',
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Cambridge Pseudocode Guide (IGCSE 0478, O Level 2210 and A Level 9618)',
  name: 'Cambridge Pseudocode Guide',
  description:
    'Syntax guide for Cambridge IGCSE 0478, O Level 2210 and AS & A Level 9618 pseudocode, including DECLARE, CONSTANT, DIV, ROUND and comparison operators.',
  url: `${SITE_URL}/docs`,
  inLanguage: 'en',
  isAccessibleForFree: true,
  educationalLevel: 'IGCSE, O Level, AS & A Level',
  about: ['Cambridge pseudocode', 'IGCSE 0478', 'O Level 2210', 'A Level 9618', 'DECLARE', 'DIV'],
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
