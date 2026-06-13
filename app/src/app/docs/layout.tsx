import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pseudocode Language Reference — IGCSE and AS & A Level Syntax Guide',
  description:
    'Complete Cambridge IGCSE (0478) and Cambridge International AS & A Level Computer Science (9618) pseudocode syntax reference. Covers variables, arrays, loops, procedures, records, pointers, classes, file handling, and built-in functions — with examples.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
