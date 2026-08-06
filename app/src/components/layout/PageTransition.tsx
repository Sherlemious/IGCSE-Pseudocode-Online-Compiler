'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const SECTION_ORDER = ['compiler', 'docs', 'practice', 'exam'] as const;
type Section = (typeof SECTION_ORDER)[number] | 'other';
type Direction = 'forward' | 'backward' | null;

const sectionFromPathname = (pathname: string): Section => {
  if (pathname === '/') return 'compiler';
  if (pathname === '/docs' || pathname.startsWith('/docs/')) return 'docs';
  if (pathname === '/practice' || pathname.startsWith('/practice/')) return 'practice';
  if (pathname === '/exam' || pathname.startsWith('/exam/')) return 'exam';
  return 'other';
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const section = sectionFromPathname(pathname);
  const [transition, setTransition] = useState<{ section: Section; direction: Direction }>({
    section,
    direction: null,
  });

  if (transition.section !== section) {
    const previousIndex = SECTION_ORDER.indexOf(
      transition.section as (typeof SECTION_ORDER)[number],
    );
    const currentIndex = SECTION_ORDER.indexOf(section as (typeof SECTION_ORDER)[number]);
    const canSlide = previousIndex !== -1 && currentIndex !== -1;

    setTransition({
      section,
      direction: canSlide ? (currentIndex > previousIndex ? 'forward' : 'backward') : null,
    });
  }

  const transitionClass =
    transition.direction === 'forward'
      ? 'page-slide-forward'
      : transition.direction === 'backward'
        ? 'page-slide-backward'
        : '';

  return (
    <div
      key={section}
      className={`flex min-h-0 flex-1 flex-col overflow-hidden ${transitionClass}`}
    >
      {children}
    </div>
  );
}
