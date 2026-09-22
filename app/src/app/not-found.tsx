import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PaperGrain } from '@/shared/brand';

const ink = (delay: number, duration?: number) =>
  ({ '--ink-delay': `${delay}s`, ...(duration ? { '--ink-duration': `${duration}s` } : {}) }) as CSSProperties;

export default function NotFound() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background flex items-center justify-center px-5 py-12 sm:p-10">
      <div className="exam-sheet-stack relative w-full max-w-[37rem]">
        <div aria-hidden="true" className="exam-sheet-under absolute inset-0 bg-[#E4DCCB]" />

        <article className="exam-sheet relative bg-brand-paper text-brand-ink">
          <PaperGrain className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-70" />
          <span aria-hidden="true" className="exam-sheet-fold absolute top-0 right-0" />
          <svg aria-hidden="true" viewBox="0 0 40 14" className="absolute left-3 top-3 w-10 -rotate-[26deg]" fill="none">
            <path d="M4 9.5V5.5C4 4.4 4.9 3.5 6 3.5H34C35.1 3.5 36 4.4 36 5.5V9.5" stroke="#8E939D" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M6 3.5H34" stroke="#D9DCE2" strokeWidth="1" strokeLinecap="round" />
          </svg>

          <div className="relative grid grid-cols-[3.5rem_1fr_3.75rem] sm:grid-cols-[4.75rem_1fr_5.25rem]">
            <div className="border-r border-brand-red/80" />
            <header className="px-4 sm:px-6 pt-10 pb-6">
              <p className="text-[11px] text-brand-ink/55">Page number</p>
              <div className="mt-1.5 flex">
                {['4', '0', '4'].map((digit, i) => (
                  <span
                    key={i}
                    className="w-8 h-9 -ml-px first:ml-0 border border-brand-ink/35 flex items-center justify-center font-mono text-lg text-brand-ink"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </header>
            <div className="border-l border-brand-rule/70 px-1.5 pt-10 text-center">
              <p className="text-[10px] leading-tight text-brand-ink/45">For examiner&apos;s use</p>
            </div>

            <div className="border-r border-brand-red/80 px-2 sm:px-3 pt-2">
              <p
                className="ink-in font-display italic text-[11.5px] sm:text-[13px] leading-snug text-brand-red"
                style={ink(1.45)}
              >
                See mark scheme.
              </p>
            </div>
            <div className="px-4 sm:px-6 pb-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-semibold text-lg">1</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 border-b-2 border-dotted border-brand-rule/70 pb-1.5">
                    <span className="relative inline-block font-mono text-[13px] sm:text-[15px] whitespace-nowrap">
                      OUTPUT &quot;this page&quot;
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 180 20"
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-[calc(100%+0.5rem)] overflow-visible"
                        fill="none"
                      >
                        <path
                          className="ink-draw"
                          style={ink(0.62, 0.38)}
                          pathLength={1}
                          d="M3 12.5C28 9.5 52 13 86 10.8S150 7.8 177 9.4"
                          stroke="var(--color-brand-red)"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="font-display text-sm text-brand-ink/55 shrink-0">[1]</span>
                  </div>
                  <p className="mt-5 font-display italic text-[17px] sm:text-lg leading-snug text-brand-ink/75 border-b-2 border-dotted border-brand-rule/70 pb-2">
                    That page doesn&apos;t exist, or it has moved.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-l border-brand-rule/70 flex justify-center pt-0.5">
              <span className="relative w-12 h-12 sm:w-14 sm:h-14 -rotate-6">
                <span
                  className="ink-in absolute inset-0 flex items-center justify-center font-display italic text-[1.7rem] sm:text-[2rem] text-brand-red"
                  style={ink(0.95)}
                >
                  0
                </span>
                <svg aria-hidden="true" viewBox="0 0 56 56" className="absolute inset-0 w-full h-full overflow-visible" fill="none">
                  <path
                    className="ink-draw"
                    style={ink(1.05, 0.55)}
                    pathLength={1}
                    d="M40.5 9.5C29 3.5 9.5 8 7.3 25C5.3 41.5 21.5 51 36 46.2C49.5 41.8 53 25 45.3 14.6C42 10.4 37 8.4 31 8.2"
                    stroke="var(--color-brand-red)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            <div className="border-r border-brand-red/80" />
            <div className="pr-4 sm:pr-6 pl-[2.2rem] sm:pl-[2.7rem] pt-6 pb-10">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-sm text-sm font-medium text-brand-ink underline decoration-brand-red/40 decoration-1 underline-offset-4 hover:decoration-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper transition-colors"
              >
                <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to the compiler
              </Link>
            </div>
            <div className="border-l border-brand-rule/70" />
          </div>
        </article>
      </div>
    </div>
  );
}
