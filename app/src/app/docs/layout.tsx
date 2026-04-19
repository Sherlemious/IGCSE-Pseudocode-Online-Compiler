import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pseudocode Language Reference — IGCSE Syntax Guide',
  description:
    'Complete Cambridge IGCSE pseudocode syntax reference. Covers variables, arrays, IF/ELSE, FOR/WHILE/REPEAT loops, procedures, functions, file handling, and built-in functions — with examples.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
