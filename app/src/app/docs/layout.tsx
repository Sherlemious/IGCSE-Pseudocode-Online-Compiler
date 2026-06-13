import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cambridge Pseudocode Syntax Guide - IGCSE, O Level & A Level',
  description:
    'Complete Cambridge IGCSE, O Level and AS & A Level pseudocode reference. Covers trace tables, arrays, loops, procedures, records, pointers, classes/OOP, file handling and built-in functions.',
  alternates: {
    canonical: '/docs',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
