'use client';

import { useEffect } from 'react';
import { LayoutTemplate, PenLine, ArrowRight, CornerDownLeft, Info } from 'lucide-react';

type StartMode = 'template' | 'scratch';

interface Props {
  starterCode: string;
  hasExistingWork?: boolean;
  onChoose: (mode: StartMode) => void;
  /** When the gate was re-opened from an existing session, allow backing out. */
  onCancel?: () => void;
}

const SCRATCH_LINE_WIDTHS = ['72%', '46%', '61%', '33%'];

export default function PracticeStartGate({ starterCode, hasExistingWork, onChoose, onCancel }: Props) {
  // First few meaningful lines of the scaffold, for the template preview.
  const preview = (() => {
    const lines = starterCode.replace(/\r/g, '').split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    return { shown: lines.slice(0, 5), more: lines.length > 5 };
  })();

  // Keyboard: 1 → template, 2 → scratch, Enter → recommended (template), Esc → cancel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') { e.preventDefault(); onChoose('template'); }
      else if (e.key === '2') { e.preventDefault(); onChoose('scratch'); }
      else if (e.key === 'Enter') { e.preventDefault(); onChoose('template'); }
      else if (e.key === 'Escape' && onCancel) { e.preventDefault(); onCancel(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onChoose, onCancel]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid relative scrollbar-pretty">
      {/* Atmospheric glow from the top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 55%)' }}
      />

      <div className="relative min-h-full flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <div className="text-center mb-7 animate-fade-in-up">
            <div className="mono-label text-primary/70 mb-2">Choose your start</div>
            <h2 className="text-2xl font-bold tracking-tight text-light-text">How do you want to begin?</h2>
            <p className="text-sm text-dark-text mt-2 max-w-md mx-auto leading-relaxed">
              Pick a starting point for this question. You can change it anytime — your work is saved as you type.
            </p>
          </div>

          {/* Choice cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* ── Template ── */}
            <button
              onClick={() => onChoose('template')}
              className="group relative text-left rounded-2xl border border-border bg-surface p-5 overflow-hidden card-glow transition-all duration-200 hover:border-primary/45 hover:-translate-y-0.5 animate-fade-in-up"
              style={{ animationDelay: '70ms' }}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ background: 'linear-gradient(90deg, var(--color-primary), transparent)' }}
              />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/[0.12] border border-primary/25 flex items-center justify-center">
                  <LayoutTemplate size={18} className="text-primary" />
                </div>
                <span className="mono-label text-primary/70 px-2 py-0.5 rounded-full border border-primary/25 bg-primary/5">
                  Guided
                </span>
              </div>
              <h3 className="text-sm font-semibold text-light-text mb-1">Use the template</h3>
              <p className="text-xs text-dark-text leading-relaxed mb-3">
                Begin with a scaffold — declarations, structure and{' '}
                <code className="font-mono text-info text-[0.95em]">TODO</code> hints already in place. Fill in the logic.
              </p>

              {/* Starter-code preview */}
              <div className="rounded-lg border border-border bg-background/70 overflow-hidden mb-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 border-b border-border/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-dark-text/30" />
                  <span className="font-mono text-[10px] text-dark-text/55">starter.pseudo</span>
                </div>
                <div className="px-3 py-2 text-[11px] font-mono leading-relaxed">
                  {preview.shown.map((line, i) => (
                    <div key={i} className="flex gap-3 min-w-0">
                      <span className="text-dark-text/30 select-none w-3 text-right shrink-0">{i + 1}</span>
                      <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-pre text-light-text/65">
                        {line || ' '}
                      </span>
                    </div>
                  ))}
                  {preview.more && (
                    <div className="flex gap-3">
                      <span className="text-dark-text/30 select-none w-3 text-right shrink-0">⋯</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  Use template
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                <kbd className="hidden sm:inline">1</kbd>
              </div>
            </button>

            {/* ── From scratch ── */}
            <button
              onClick={() => onChoose('scratch')}
              className="group relative text-left rounded-2xl border border-border bg-surface p-5 overflow-hidden transition-all duration-200 hover:border-light-text/30 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.6)] animate-fade-in-up"
              style={{ animationDelay: '130ms' }}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 opacity-40"
                style={{ background: 'linear-gradient(90deg, var(--color-light-text), transparent)' }}
              />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-light-text/[0.07] border border-border flex items-center justify-center">
                  <PenLine size={18} className="text-light-text/80" />
                </div>
                <span className="mono-label text-dark-text px-2 py-0.5 rounded-full border border-border bg-background/50">
                  Challenge
                </span>
              </div>
              <h3 className="text-sm font-semibold text-light-text mb-1">Start from scratch</h3>
              <p className="text-xs text-dark-text leading-relaxed mb-3">
                An empty editor. Plan and write the whole solution yourself — closest to real exam conditions.
              </p>

              {/* Empty-canvas motif */}
              <div className="rounded-lg border border-dashed border-border bg-background/40 overflow-hidden mb-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 border-b border-border/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-dark-text/20" />
                  <span className="font-mono text-[10px] text-dark-text/45">untitled.pseudo</span>
                </div>
                <div className="px-3 py-[11px] space-y-[7px]">
                  {SCRATCH_LINE_WIDTHS.map((w, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <span className="text-dark-text/25 text-[11px] font-mono w-3 text-right select-none shrink-0">{i + 1}</span>
                      <span className="h-px rounded-full bg-border/70" style={{ width: w }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-light-text">
                  Start blank
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                <kbd className="hidden sm:inline">2</kbd>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '210ms' }}>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-dark-text/60">
              <kbd className="inline-flex items-center gap-0.5"><CornerDownLeft size={10} /></kbd>
              <span>Enter for template</span>
              <span className="text-border">·</span>
              <kbd>1</kbd>
              <kbd>2</kbd>
              <span>to choose</span>
            </div>

            {hasExistingWork && (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-1.5 text-[11px] text-warning">
                  <Info size={12} className="shrink-0" />
                  Choosing a start will replace your current code.
                </div>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="text-xs text-dark-text hover:text-light-text underline underline-offset-2 transition-colors"
                  >
                    Keep my current code
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
