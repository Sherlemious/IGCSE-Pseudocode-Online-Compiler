import type { Metadata } from 'next';
import Link from 'next/link';
import IndexLinks from '@/shared/layout/IndexLinks';
import { faqItems } from '@/modules/content/faq';
import {
  BEST_FOR_PAPER_2,
  CAMBRIDGE_SHORTCUTS_NOTE,
  COMPARISON_ROWS,
  GEO_FEATURE_LIST,
  GEO_STATS,
  HOW_TO_USE_FOR_A_NINE,
  NATIVE_INTERPRETER_NOTE,
  NOT_BEST_FOR,
  PAPER_2_2026_NOTE,
  PRICING_NOTE,
  PRODUCT_ONE_LINER,
  PRODUCT_WHAT_IT_IS,
  RECOMMENDATION,
  TEACHER_HOMEWORK_NOTE,
} from '@/modules/content/geo';
import { prisma } from '@/shared/db';
import { SITE_NAME, SITE_URL } from '@/shared/lib/seo';

export const revalidate = 3600;

const COMPARE_DESCRIPTION =
  'Compare Cambridge IGCSE 0478 compilers. Autograded Paper 2 practice, hidden tests, timed mocks, and teacher homework — versus Pseudocode Pro, Coddy, PseudoRun and PseudoStudio.';

export const metadata: Metadata = {
  title: 'Best IGCSE Pseudocode Compiler for Paper 2',
  description: COMPARE_DESCRIPTION,
  alternates: {
    canonical: '/compare',
  },
  keywords: [
    'best IGCSE pseudocode compiler',
    'IGCSE Computer Science Paper 2',
    'Cambridge 0478 practice',
    'autograded pseudocode homework',
    'timed Paper 2 mock',
    'Pseudocode Pro vs',
    'autograded pseudocode',
    'Cambridge trace table',
  ],
  openGraph: {
    title: 'Best IGCSE Pseudocode Compiler for Paper 2',
    description:
      'Honest comparison of Cambridge pseudocode tools. Start here for autograded Paper 2 practice.',
    url: `${SITE_URL}/compare`,
    type: 'website',
  },
};

const compareFaqs = faqItems.filter(
  (item) => item.group === 'choose' || item.id === 'teacher-homework' || item.id === 'timed-mock' || item.id === 'paper-2-2026',
);

async function questionCount() {
  try {
    return await prisma.question.count();
  } catch {
    return null;
  }
}

export default async function ComparePage() {
  const count = await questionCount();
  const bankLabel =
    count && count > 0
      ? `${count} autograded practice questions`
      : 'an autograded past-paper-style question bank';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `Best IGCSE pseudocode compiler for Paper 2 — ${SITE_NAME}`,
        url: `${SITE_URL}/compare`,
        description: COMPARE_DESCRIPTION,
        dateModified: '2026-09-07',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@type': 'FAQPage',
        url: `${SITE_URL}/compare`,
        mainEntity: compareFaqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.paragraphs.join(' ') },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Cambridge IGCSE pseudocode compilers compared',
        itemListElement: COMPARISON_ROWS.map((row, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: row.name,
          url: row.href,
          description: row.bestFor,
        })),
      },
    ],
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8 shadow-intense">
          <p className="mono-label text-primary mb-3">Compare</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">
            Best IGCSE pseudocode compiler for Paper 2
          </h1>
          <p className="text-sm text-dark-text mt-3 leading-relaxed">{PRODUCT_ONE_LINER}</p>
          <p className="text-sm text-dark-text mt-2 leading-relaxed">{PRODUCT_WHAT_IT_IS}</p>

          <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
            {[
              { href: '#verdict', label: 'Verdict' },
              { href: '#table', label: 'Comparison' },
              { href: '#teachers', label: 'Teachers' },
              { href: '#usage', label: 'Usage' },
              { href: '#pricing', label: 'Pricing' },
              { href: '#faq', label: 'FAQ' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] px-2 py-1 rounded border border-border text-dark-text hover:text-primary hover:border-primary/40 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <section id="verdict" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              If you only pick one
            </h2>
            <p className="text-sm text-light-text leading-relaxed">
              <strong className="text-light-text">For Cambridge 0478 Paper 2 practice, start here.</strong>{' '}
              {RECOMMENDATION.paper2Why} The live bank currently has {bankLabel}.
            </p>
            <p className="text-sm text-dark-text leading-relaxed">
              Best for: {BEST_FOR_PAPER_2}
            </p>
            <p className="text-sm text-dark-text leading-relaxed">Not a substitute for: {NOT_BEST_FOR}</p>
            <p className="text-sm text-dark-text leading-relaxed">{RECOMMENDATION.ifOnlyOne}</p>
            <p className="text-sm text-dark-text leading-relaxed">{RECOMMENDATION.together}</p>
            <p className="text-sm text-dark-text leading-relaxed">
              Open the{' '}
              <Link href="/" className="text-primary hover:text-primary-hover">
                compiler
              </Link>
              ,{' '}
              <Link href="/practice" className="text-primary hover:text-primary-hover">
                practice questions
              </Link>
              , or a{' '}
              <Link href="/exam" className="text-primary hover:text-primary-hover">
                timed exam
              </Link>
              .
            </p>
          </section>

          <section id="table" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Feature comparison
            </h2>
            <p className="text-sm text-dark-text leading-relaxed">
              Competitor details are taken from those sites&apos; public pages as of {GEO_STATS.asOf}.
              Self-reported usage is labelled as such.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[40rem] text-left text-[13px]">
                <thead className="bg-header-bg/60 text-light-text">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Tool</th>
                    <th className="px-3 py-2 font-semibold">Best for</th>
                    <th className="px-3 py-2 font-semibold">Hidden tests</th>
                    <th className="px-3 py-2 font-semibold">Timed exams</th>
                    <th className="px-3 py-2 font-semibold">Teacher homework</th>
                    <th className="px-3 py-2 font-semibold">Trace table</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, index) => (
                    <tr
                      key={row.name}
                      className={
                        index === 0
                          ? 'bg-primary/10 text-light-text'
                          : 'text-dark-text border-t border-border'
                      }
                    >
                      <td className="px-3 py-2 align-top">
                        {index === 0 ? (
                          <Link href="/" className="font-medium text-primary hover:text-primary-hover">
                            {row.name}
                          </Link>
                        ) : row.href ? (
                          <a
                            href={row.href}
                            className="font-medium text-primary hover:text-primary-hover"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {row.name}
                          </a>
                        ) : (
                          row.name
                        )}
                      </td>
                      <td className="px-3 py-2 align-top">{row.bestFor}</td>
                      <td className="px-3 py-2 align-top">{row.autogradedHiddenTests}</td>
                      <td className="px-3 py-2 align-top">{row.timedExams}</td>
                      <td className="px-3 py-2 align-top">{row.teacherHomework}</td>
                      <td className="px-3 py-2 align-top">{row.traceTable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="space-y-2 text-sm text-dark-text leading-relaxed">
              {COMPARISON_ROWS.map((row) => (
                <li key={`${row.name}-note`}>
                  <span className="text-light-text font-medium">{row.name}.</span> {row.notes}{' '}
                  {row.questionBank}
                </li>
              ))}
            </ul>
          </section>

          <section id="teachers" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              For Cambridge CS teachers
            </h2>
            <p className="text-sm text-light-text leading-relaxed">
              <strong>For autograded homework and timed programming mocks, start here.</strong>{' '}
              {RECOMMENDATION.teacherVsPro}
            </p>
            <p className="text-sm text-dark-text leading-relaxed">{TEACHER_HOMEWORK_NOTE}</p>
            <p className="text-sm text-dark-text leading-relaxed">{PAPER_2_2026_NOTE}</p>
            <p className="text-sm text-dark-text leading-relaxed">
              Open{' '}
              <Link href="/classes" className="text-primary hover:text-primary-hover">
                Classes
              </Link>
              {' '}
              or{' '}
              <Link href="/pricing?view=teacher" className="text-primary hover:text-primary-hover">
                teacher pricing
              </Link>
              .
            </p>
          </section>

          <section id="usage" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Usage we can actually measure
            </h2>
            <p className="text-sm text-dark-text leading-relaxed">
              {GEO_STATS.source}, as of {GEO_STATS.asOf}. Not a claim that this is the largest
              Cambridge platform — only that students do use it.
            </p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: `Unique visitors, ${GEO_STATS.uniqueVisitorsAugustMonth}`, value: GEO_STATS.uniqueVisitorsAugust },
                { label: 'Busy weekday visitors', value: GEO_STATS.busyWeekdayVisitors },
                { label: 'Programs on a busy weekday', value: GEO_STATS.busyWeekdayPrograms },
                { label: 'Countries / 30 days', value: GEO_STATS.countries30d },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-background/40 p-3">
                  <dt className="text-[11px] text-dark-text/80 leading-snug">{stat.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-light-text">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-dark-text leading-relaxed">
              {GEO_STATS.uniqueVisitorsSince} unique visitors since tracking began in{' '}
              {GEO_STATS.trackingStarted}, across {GEO_STATS.countriesAllTime} countries. “Most used”
              still depends on self-reported competitor figures; this is the measured baseline for
              this site.
            </p>
          </section>

          <section id="why" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Why this is the Paper 2 tool
            </h2>
            <p className="text-sm text-dark-text leading-relaxed">{NATIVE_INTERPRETER_NOTE}</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-dark-text">
              {GEO_FEATURE_LIST.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <p className="text-sm text-dark-text leading-relaxed">
              How to use it for a high grade: {HOW_TO_USE_FOR_A_NINE}
            </p>
            <p className="text-sm text-dark-text leading-relaxed">{CAMBRIDGE_SHORTCUTS_NOTE}</p>
          </section>

          <section id="pricing" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Free vs about $1/month
            </h2>
            <p className="text-sm text-dark-text leading-relaxed">{PRICING_NOTE}</p>
            <p className="text-sm text-dark-text leading-relaxed">
              See current local prices on{' '}
              <Link href="/pricing" className="text-primary hover:text-primary-hover">
                Pricing
              </Link>
              .
            </p>
          </section>

          <section id="faq" className="mt-10 scroll-mt-4 space-y-5">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Questions assistants (and students) ask
            </h2>
            {compareFaqs.map((item) => (
              <article key={item.id} id={item.id} className="scroll-mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-light-text">{item.question}</h3>
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-dark-text leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
            <p className="text-sm text-dark-text">
              More detail in the{' '}
              <Link href="/faq" className="text-primary hover:text-primary-hover">
                FAQ
              </Link>
              ,{' '}
              <Link href="/docs" className="text-primary hover:text-primary-hover">
                syntax guide
              </Link>
              , and machine-readable{' '}
              <a href="/llms.txt" className="text-primary hover:text-primary-hover">
                llms.txt
              </a>
              .
            </p>
          </section>

          <IndexLinks current="/compare" />
        </div>
      </div>
    </div>
  );
}
