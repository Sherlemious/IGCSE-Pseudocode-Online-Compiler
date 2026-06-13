import Link from 'next/link';
import CompilerPage from '../components/compiler/CompilerPage';

const FEATURE_LINKS = [
  { label: 'Practice Questions', href: '/practice' },
  { label: 'Language Docs', href: '/docs' },
  { label: 'Timed Exams', href: '/exam' },
  { label: 'Progress Analytics', href: '/analytics' },
] as const;

const FEATURE_TAGS = [
  'Interactive INPUT',
  'Trace Tables',
  'Classes & OOP',
  'Dyslexia Friendly',
  'Autograded',
  'No install',
] as const;

export default function Home() {
  return (
    <>
      {/*
       * Server-rendered tagline bar — gives Google crawlable body text and
       * an H1. Kept visually compact so it doesn't eat into the editor area.
       */}
      <section
        aria-label="About this compiler"
        className="sr-only"
      >
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-xs font-semibold text-light-text whitespace-nowrap">
            IGCSE and AS &amp; A Level Pseudocode Compiler
          </h1>
          <span className="sr-only">
            - Free online editor and runner for Cambridge IGCSE Computer Science, Cambridge O Level
            Computer Science, and Cambridge International AS &amp; A Level Computer Science (9618).
            Supports 0478, 0984, 2210 and 9618 pseudocode, including trace tables, records,
            pointers, classes, object-oriented programming, dyslexia-friendly editor settings,
            analytics, timed practice exams, and Cambridge past-paper questions.
          </span>
        </div>

        <nav aria-label="Site features" className="hidden sm:flex items-center gap-1.5 flex-wrap">
          {FEATURE_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] px-1.5 py-0.5 rounded border border-primary/30 text-primary/70 hover:border-primary/60 hover:text-primary transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
          {FEATURE_TAGS.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded border border-border text-dark-text/50 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </nav>
      </section>

      <CompilerPage />
    </>
  );
}
