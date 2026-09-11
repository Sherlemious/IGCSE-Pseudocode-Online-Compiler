'use client';

import { useEffect, useState } from 'react';
import { BookMarked, X } from 'lucide-react';
import { OPEN_CHEATSHEET_EVENT } from '@/shared/lib/events';

/**
 * Pseudocode syntax cheat sheet. Opened from anywhere (editor toolbar, command
 * palette) by dispatching `OPEN_CHEATSHEET_EVENT` — the same decoupled pattern as
 * KeyboardShortcutsModal / ReportBugModal, so it needs no props and is mounted
 * once in the root layout.
 *
 * The content deliberately targets the mistakes PostHog shows students make most:
 * `=` instead of `<-`, `FOR i = 1`, missing `:` in DECLARE, uncommaed OUTPUT,
 * BASIC/Python block closers, ELSEIF, etc. A stuck student can pull this up
 * instead of guessing (or pasting a whole ChatGPT answer).
 */

interface Entry {
  code: string;
  note?: string;
}
interface Section {
  title: string;
  entries: Entry[];
}

const SECTIONS: Section[] = [
  {
    title: 'Variables',
    entries: [
      { code: 'DECLARE Count : INTEGER', note: 'name, then a colon, then the type' },
      { code: 'Count <- 0', note: 'assign with <-  (never =)' },
      { code: '// INTEGER  REAL  STRING  CHAR  BOOLEAN', note: 'the built-in types' },
    ],
  },
  {
    title: 'Output & Input',
    entries: [
      { code: 'OUTPUT "Score is ", Score', note: 'separate items with a comma' },
      { code: 'INPUT Name', note: 'no brackets — INPUT is a statement' },
    ],
  },
  {
    title: 'Selection',
    entries: [
      { code: 'IF Score >= 50 THEN\n  OUTPUT "Pass"\nELSE\n  OUTPUT "Fail"\nENDIF' },
      { code: 'CASE OF Grade\n  "A" : OUTPUT "Top"\n  OTHERWISE OUTPUT "Keep going"\nENDCASE' },
    ],
  },
  {
    title: 'Loops',
    entries: [
      { code: 'FOR i <- 1 TO 10\n  OUTPUT i\nNEXT i', note: 'count-controlled' },
      { code: 'WHILE Total < 100 DO\n  Total <- Total + 1\nENDWHILE', note: 'pre-condition' },
      { code: 'REPEAT\n  INPUT Answer\nUNTIL Answer = "yes"', note: 'post-condition' },
    ],
  },
  {
    title: 'Arrays',
    entries: [
      { code: 'DECLARE Marks : ARRAY[1:10] OF INTEGER', note: 'square brackets, 1-based' },
      { code: 'Marks[3] <- 88', note: 'index with [ ]' },
    ],
  },
  {
    title: 'Procedures & Functions',
    entries: [
      { code: 'PROCEDURE Greet(Name : STRING)\n  OUTPUT "Hi ", Name\nENDPROCEDURE', note: 'call with CALL Greet("Sam")' },
      { code: 'FUNCTION Square(n : INTEGER) RETURNS INTEGER\n  RETURN n * n\nENDFUNCTION', note: 'RETURNS type in the header' },
    ],
  },
  {
    title: 'Operators',
    entries: [
      { code: '=   <>   <   >   <=   >=', note: 'compare (= is compare, not assign)' },
      { code: 'AND   OR   NOT', note: 'logic — spelled out' },
      { code: 'MOD   DIV', note: 'remainder / whole-number divide' },
      { code: 'FullName <- First & " " & Last', note: '& joins strings' },
    ],
  },
  {
    title: 'Comments',
    entries: [{ code: '// this is a comment', note: 'use //  (not # or /* */)' }],
  },
];

export default function CheatSheetModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener(OPEN_CHEATSHEET_EVENT, openHandler);
    return () => window.removeEventListener(OPEN_CHEATSHEET_EVENT, openHandler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pseudocode syntax cheat sheet"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-surface border border-border rounded-lg shadow-intense w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
              <BookMarked size={13} className="text-primary" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-light-text uppercase">
              Pseudocode cheat sheet
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-dark-text hover:text-light-text p-0.5 rounded hover:bg-background transition-colors"
            aria-label="Close cheat sheet"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-pretty px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTIONS.map((section) => (
              <div key={section.title} className="rounded-lg border border-border bg-background/50 p-3">
                <h3 className="mono-label text-primary/80 mb-2">{section.title}</h3>
                <div className="space-y-2">
                  {section.entries.map((entry, i) => (
                    <div key={i}>
                      <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-light-text">
                        {entry.code}
                      </pre>
                      {entry.note && (
                        <p className="text-[10px] text-dark-text/70 mt-0.5">{entry.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-4 py-2.5 text-center text-[10px] text-dark-text/60">
          Full reference in the{' '}
          <a href="/docs" className="text-primary hover:underline">
            docs
          </a>
          . Open this anytime with <kbd>Ctrl+K</kbd> → &ldquo;cheat sheet&rdquo;.
        </div>
      </div>
    </div>
  );
}
