'use client';

import { useEffect, useState } from 'react';
import { Bug, X, Check, ChevronDown, ChevronRight, Paperclip } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { AUTOSAVE_KEY, BUG_REPORT_OUTPUT_KEY } from '@/modules/compiler/constants';
import { OPEN_BUG_REPORT_EVENT } from '@/shared/lib/events';

type Category = 'bug' | 'suggestion' | 'other';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'bug', label: 'Bug' },
  { id: 'suggestion', label: 'Suggestion' },
  { id: 'other', label: 'Other' },
];

/**
 * Global "Report a bug" modal. Opened from anywhere (header button, command
 * palette) by dispatching the `OPEN_BUG_REPORT_EVENT` window CustomEvent — the
 * same decoupled pattern as KeyboardShortcutsModal, so it needs no props and is
 * mounted once in the root layout.
 *
 * On open it snapshots reproduction context: the current editor code, latest
 * terminal output, page path and browser user-agent. Code and output are shown
 * read-only so reports preserve the exact context; either can still be omitted.
 */
export default function ReportBugModal() {
  const ph = usePostHog();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState<Category>('bug');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const [includeCode, setIncludeCode] = useState(false);
  const [code, setCode] = useState('');
  const [includeOutput, setIncludeOutput] = useState(false);
  const [output, setOutput] = useState('');
  const [attachedOpen, setAttachedOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [userAgent, setUserAgent] = useState('');

  // Open on the global event, snapshotting fresh reproduction context each time.
  useEffect(() => {
    const openHandler = () => {
      setStep('form');
      setSubmitting(false);
      setCategory('bug');
      setDescription('');
      setEmail('');
      setAttachedOpen(false);
      // AUTOSAVE_KEY only holds the main compiler editor's content. On other
      // routes (practice/exam) attaching it would be misleading, so only
      // prefill + default-attach code when we're actually on the compiler page.
      const onCompiler = (() => {
        try { return window.location.pathname === '/'; } catch { return false; }
      })();
      let saved = '';
      let savedOutput = '';
      if (onCompiler) {
        try { saved = localStorage.getItem(AUTOSAVE_KEY) ?? ''; } catch { saved = ''; }
        try { savedOutput = sessionStorage.getItem(BUG_REPORT_OUTPUT_KEY) ?? ''; } catch { savedOutput = ''; }
      }
      setCode(saved);
      setIncludeCode(onCompiler && saved.trim().length > 0);
      setOutput(savedOutput);
      setIncludeOutput(onCompiler && savedOutput.trim().length > 0);
      try {
        setPageUrl(window.location.pathname + window.location.search);
        setUserAgent(navigator.userAgent);
      } catch {
        setPageUrl('');
        setUserAgent('');
      }
      setOpen(true);
    };
    window.addEventListener(OPEN_BUG_REPORT_EVENT, openHandler);
    return () => window.removeEventListener(OPEN_BUG_REPORT_EVENT, openHandler);
  }, []);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const canSubmit = description.trim().length > 0 && !submitting;
  const attachedCode = includeCode ? code.trim() || null : null;
  const attachedOutput = includeOutput ? output.trim() || null : null;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    ph?.capture('bug_reported', {
      category,
      has_code: !!attachedCode,
      has_output: !!attachedOutput,
      page: pageUrl || undefined,
    });

    try {
      const res = await fetch('/api/bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description: description.trim(),
          code: attachedCode,
          output: attachedOutput,
          pageUrl: pageUrl || null,
          userAgent: userAgent || null,
          email: !session?.user?.email && email.trim() ? email.trim() : null,
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setStep('done');
      setTimeout(() => setOpen(false), 1500);
    } catch {
      setSubmitting(false);
      toast.error("Couldn't send the report — please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Report a bug"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-surface border border-border rounded-lg shadow-intense w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
              <Bug size={13} className="text-primary" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-light-text uppercase">
              Report a bug
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-dark-text hover:text-light-text p-0.5 rounded hover:bg-background transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {step === 'form' && (
          <div className="flex-1 overflow-y-auto scrollbar-pretty px-4 py-3.5 space-y-3.5">
            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all duration-150
                    ${category === c.id
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'bg-background border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                    }`}
                >
                  {category === c.id && <Check size={9} />}
                  {c.label}
                </button>
              ))}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="bug-description" className="mono-label text-dark-text mb-1.5 block">
                What went wrong?
              </label>
              <textarea
                id="bug-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem and, if you can, the steps to reproduce it."
                rows={4}
                autoFocus
                className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-2
                  text-light-text placeholder-dark-text/40 resize-none outline-none
                  focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Optional email — only for logged-out users */}
            {!session?.user?.email && (
              <div>
                <label htmlFor="bug-email" className="mono-label text-dark-text mb-1.5 block">
                  Email (optional)
                </label>
                <input
                  id="bug-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="So we can follow up (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-light-text text-xs
                    placeholder:text-dark-text/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            )}

            {/* Attached context */}
            <div className="rounded-lg border border-border bg-background/60">
              <button
                type="button"
                onClick={() => setAttachedOpen((v) => !v)}
                className="w-full flex items-center gap-1.5 px-2.5 py-2 text-[11px] text-dark-text hover:text-light-text transition-colors"
              >
                {attachedOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <Paperclip size={11} />
                <span className="font-medium">Attached context</span>
                <span className="ml-auto text-[10px] text-dark-text/60">
                  {[attachedCode && 'code', attachedOutput && 'output', 'page'].filter(Boolean).join(' + ')}
                </span>
              </button>

              {attachedOpen && (
                <div className="px-2.5 pb-2.5 space-y-2 border-t border-border/60 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-dark-text/70">Your code (read-only)</span>
                    <button
                      type="button"
                      onClick={() => setIncludeCode((v) => !v)}
                      className="text-[10px] text-primary hover:underline"
                    >
                      {includeCode ? 'Remove code' : 'Attach code'}
                    </button>
                  </div>
                  {includeCode && (
                    <pre className="max-h-40 w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background px-2.5 py-2 font-mono text-[11px] leading-relaxed text-light-text scrollbar-pretty">
                      {code}
                    </pre>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-dark-text/70">Program output (read-only)</span>
                    <button
                      type="button"
                      onClick={() => setIncludeOutput((v) => !v)}
                      className="text-[10px] text-primary hover:underline"
                    >
                      {includeOutput ? 'Remove output' : 'Attach output'}
                    </button>
                  </div>
                  {includeOutput && (
                    <pre className="max-h-40 w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background px-2.5 py-2 font-mono text-[11px] leading-relaxed text-light-text scrollbar-pretty">
                      {output}
                    </pre>
                  )}
                  <div className="text-[10px] text-dark-text/60 break-words">
                    <span className="text-dark-text/80">Page:</span> {pageUrl || '—'}
                  </div>
                  {userAgent && (
                    <div className="text-[10px] text-dark-text/60 truncate" title={userAgent}>
                      <span className="text-dark-text/80">Browser:</span> {userAgent}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                onClick={() => setOpen(false)}
                className="text-[10px] text-dark-text hover:text-light-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary
                  hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                {submitting ? 'Sending…' : 'Send report'}
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="px-4 py-8 flex flex-col items-center gap-2 text-center">
            <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
              <Check size={15} className="text-success" />
            </div>
            <p className="text-sm font-medium text-light-text">Thanks for reporting</p>
            <p className="text-xs text-dark-text">We&apos;ll take a look. This really helps.</p>
          </div>
        )}
      </div>
    </div>
  );
}
