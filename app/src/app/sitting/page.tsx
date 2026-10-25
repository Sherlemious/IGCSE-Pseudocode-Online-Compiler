import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoBadge } from '@/shared/brand';
import { earlyBirdFor } from '@/modules/billing/paddle/passes';
import { isSitting, SITTINGS } from '@/modules/onboarding/sittings';

export const metadata: Metadata = {
  title: 'Exam sitting saved',
  description: 'Your exam sitting is saved.',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ s?: string }>;
}

/** Where a one-tap sitting answer lands (api/me/sitting/[choice]). */
export default async function SittingSavedPage({ searchParams }: Props) {
  const { s } = await searchParams;
  const sitting = isSitting(s) ? s : null;
  const label = SITTINGS.find((item) => item.value === sitting)?.label;
  const earlyBird = sitting === 'may_jun_2027' ? earlyBirdFor('may_june') : null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
        <div className="w-full rounded-2xl border border-border bg-surface/80 p-6 shadow-intense backdrop-blur-sm sm:p-8">
          <LogoBadge size={64} animate className="mx-auto mb-4" />
          <p className="mono-label mb-3 text-primary">Saved</p>
          <h1 className="text-2xl font-bold tracking-tight text-light-text sm:text-3xl">
            {label ? `${label}, got it` : 'Got it'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-dark-text">
            {sitting === 'oct_nov_2026'
              ? 'Hope the paper went well. If you are sitting again, you can change this any time from the card in the editor.'
              : 'Reminders and practice will be timed to your paper. You can change this any time from the card in the editor.'}
          </p>

          {earlyBird && (
            <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-4 text-left text-sm">
              <p className="font-semibold text-success">Early bird: the May/June pass is {earlyBird.percent}% off until 30 Nov</p>
              <p className="mt-1 text-dark-text">
                One payment opens every level of the Paper 2 Path, the full practice library and timed exams until 30 June.
              </p>
              <Link
                href="/pricing?view=student&checkout=student-may-june&from=sitting_page"
                className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Get the May/June pass
              </Link>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/learn?from=sitting_page"
              className={`inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold ${
                earlyBird
                  ? 'border border-border text-light-text hover:bg-surface'
                  : 'bg-primary text-white hover:bg-primary-hover'
              }`}
            >
              Practise on the Paper 2 Path
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-10 items-center rounded-lg border border-border px-4 text-sm font-semibold text-light-text hover:bg-surface"
            >
              Open the editor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
