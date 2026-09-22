import type { Metadata } from 'next';
import IndexLinks from '@/shared/layout/IndexLinks';
import { faqItems } from '@/modules/content/faq';
import {
  BEST_FOR_PAPER_2,
  CAMBRIDGE_SHORTCUTS_NOTE,
  GEO_FEATURE_LIST,
  GEO_STATS,
  HOW_TO_USE_FOR_A_NINE,
  NATIVE_INTERPRETER_NOTE,
  NOT_BEST_FOR,
  PAPER_2_2026_NOTE,
  PLAN_FEATURE_ROWS,
  PRICING_NOTE,
  PRODUCT_ONE_LINER,
  PRODUCT_WHAT_IT_IS,
  RECOMMENDATION,
  TEACHER_HOMEWORK_NOTE,
} from '@/modules/content/geo';
import { getQuestionCount } from '@/shared/lib/catalogCache';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo';
import { CompareCtaLink, CompareSectionLink, CompareTracker } from './CompareAnalytics';

export const revalidate = 3600;

const COMPARE_DESCRIPTION =
  'Free Cambridge IGCSE 0478 / O Level 2210 / A Level 9618 Paper 2 practice: in-browser compiler, hidden tests, timed mocks, trace tables, and teacher homework. Student plan typically about $2/month.';

export const metadata: Metadata = {
  title: {
    absolute: 'IGCSE Paper 2 Practice Compiler | Hidden Tests & Trace Tables',
  },
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
    'autograded pseudocode',
    'Cambridge trace table',
  ],
  openGraph: {
    title: 'IGCSE Paper 2 Practice Compiler | Hidden Tests & Trace Tables',
    description:
      'Write Cambridge pseudocode, run it in the browser, dry-run with a trace table, then submit against hidden tests. Free editor; Student typically about $2/month.',
    url: `${SITE_URL}/compare`,
    type: 'website',
    images: [SHARE_IMAGE],
  },
};

const compareFaqs = faqItems.filter(
  (item) => item.group === 'choose' || item.id === 'teacher-homework' || item.id === 'timed-mock' || item.id === 'paper-2-2026',
);

const ctaPrimary =
  'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors';
const ctaSecondary =
  'inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-light-text hover:border-primary/40 hover:text-primary transition-colors';
const ctaText = 'text-primary hover:text-primary-hover';
const navChip =
  'text-[11px] px-2 py-1 rounded border border-border text-dark-text hover:text-primary hover:border-primary/40 transition-colors';

async function questionCount() {
  try {
    return await getQuestionCount();
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
        name: `Why ${SITE_NAME} for Paper 2 practice`,
        url: `${SITE_URL}/compare`,
        description: COMPARE_DESCRIPTION,
        dateModified: '2026-09-17',
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
    ],
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <CompareTracker questionCount={count} />
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
          <p className="mono-label text-primary mb-3">Paper 2 practice</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">
            The IGCSE Paper 2 practice compiler
          </h1>
          <p className="text-sm text-dark-text mt-3 leading-relaxed">{PRODUCT_ONE_LINER}</p>
          <p className="text-sm text-dark-text mt-2 leading-relaxed">{PRODUCT_WHAT_IT_IS}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <CompareCtaLink href="/practice" destination="practice" source="hero" className={ctaPrimary}>
              Start a practice question
            </CompareCtaLink>
            <CompareCtaLink href="/pricing" destination="pricing" source="hero" className={ctaSecondary}>
              See Student pricing
            </CompareCtaLink>
            <CompareCtaLink href="/" destination="compiler" source="hero" className={ctaSecondary}>
              Open the compiler
            </CompareCtaLink>
          </div>

          <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
            {[
              { href: '#why', label: 'Why', section: 'why' },
              { href: '#plans', label: 'Plans', section: 'plans' },
              { href: '#teachers', label: 'Teachers', section: 'teachers' },
              { href: '#usage', label: 'Usage', section: 'usage' },
              { href: '#pricing', label: 'Pricing', section: 'pricing' },
              { href: '#faq', label: 'FAQ', section: 'faq' },
            ].map((link) => (
              <CompareSectionLink key={link.href} href={link.href} section={link.section} className={navChip}>
                {link.label}
              </CompareSectionLink>
            ))}
          </nav>

          <section id="why" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Why this is the Paper 2 tool
            </h2>
            <p className="text-sm text-light-text leading-relaxed">
              <strong className="text-light-text">For Cambridge 0478 Paper 2 practice, start here.</strong>{' '}
              {RECOMMENDATION.paper2Why} The live bank currently has {bankLabel}.
            </p>
            <p className="text-sm text-dark-text leading-relaxed">Best for: {BEST_FOR_PAPER_2}</p>
            <p className="text-sm text-dark-text leading-relaxed">Not a substitute for: {NOT_BEST_FOR}</p>
            <p className="text-sm text-dark-text leading-relaxed">{RECOMMENDATION.ifOnlyOne}</p>
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

          <section id="plans" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Free vs Student vs Teacher
            </h2>
            <p className="text-sm text-dark-text leading-relaxed">
              The editor stays free. Student is typically about US$2 per month when you practise most
              weeks. Teacher plans add the class judge.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[36rem] text-left text-[13px]">
                <thead className="bg-header-bg/60 text-light-text">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Feature</th>
                    <th className="px-3 py-2 font-semibold">Free</th>
                    <th className="px-3 py-2 font-semibold bg-primary/10">Student</th>
                    <th className="px-3 py-2 font-semibold">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_FEATURE_ROWS.map((row) => (
                    <tr key={row.feature} className="text-dark-text border-t border-border">
                      <td className="px-3 py-2 align-top text-light-text">{row.feature}</td>
                      <td className="px-3 py-2 align-top">{row.free}</td>
                      <td className="px-3 py-2 align-top bg-primary/10 text-light-text">{row.student}</td>
                      <td className="px-3 py-2 align-top">{row.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <CompareCtaLink href="/pricing" destination="pricing" source="plans" className={ctaPrimary}>
                Get Student — about $2/month
              </CompareCtaLink>
              <CompareCtaLink
                href="/pricing?view=teacher"
                destination="teacher_pricing"
                source="plans"
                className={ctaSecondary}
              >
                Teacher plans
              </CompareCtaLink>
            </div>
          </section>

          <section id="teachers" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              For Cambridge CS teachers
            </h2>
            <p className="text-sm text-light-text leading-relaxed">
              <strong>For autograded homework and timed programming mocks, start here.</strong>{' '}
              {RECOMMENDATION.teacherPitch}
            </p>
            <p className="text-sm text-dark-text leading-relaxed">{TEACHER_HOMEWORK_NOTE}</p>
            <p className="text-sm text-dark-text leading-relaxed">{PAPER_2_2026_NOTE}</p>
            <p className="text-sm text-dark-text leading-relaxed">
              Open{' '}
              <CompareCtaLink href="/classes" destination="classes" source="teachers" className={ctaText}>
                Classes
              </CompareCtaLink>{' '}
              or{' '}
              <CompareCtaLink
                href="/pricing?view=teacher"
                destination="teacher_pricing"
                source="teachers"
                className={ctaText}
              >
                teacher pricing
              </CompareCtaLink>
              .
            </p>
          </section>

          <section id="usage" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Usage we can actually measure
            </h2>
            <p className="text-sm text-dark-text leading-relaxed">
              {GEO_STATS.source}, as of {GEO_STATS.asOf}.
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
              {GEO_STATS.trackingStarted}, across {GEO_STATS.countriesAllTime} countries.
            </p>
          </section>

          <section id="pricing" className="mt-10 scroll-mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
              Free vs about $2/month
            </h2>
            <p className="text-sm text-dark-text leading-relaxed">{PRICING_NOTE}</p>
            <p className="text-sm text-dark-text leading-relaxed">{RECOMMENDATION.together}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <CompareCtaLink href="/pricing" destination="pricing" source="pricing" className={ctaPrimary}>
                See current local prices
              </CompareCtaLink>
              <CompareCtaLink href="/exam" destination="exam" source="pricing" className={ctaSecondary}>
                Sit a timed exam
              </CompareCtaLink>
            </div>
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
              <CompareCtaLink href="/faq" destination="faq" source="faq" className={ctaText}>
                FAQ
              </CompareCtaLink>
              ,{' '}
              <CompareCtaLink href="/docs" destination="docs" source="faq" className={ctaText}>
                Cambridge pseudocode guide
              </CompareCtaLink>
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
