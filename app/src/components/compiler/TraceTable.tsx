'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Table2, Copy, Check, AlertTriangle } from 'lucide-react';
import type { TraceRow } from '../../interpreter/core/types';

interface TraceTableProps {
  rows: TraceRow[];
  maxRows: number;
  /** True while the program is still running or being stepped — drives the
   *  "current row" cursor and follow-along auto-scroll. */
  isLive?: boolean;
}

/**
 * Renders a Cambridge-style trace ("dry run") table: one row per executed
 * statement, a column per variable (in first-appearance order), and an OUTPUT
 * column. Styled after a printed exam-paper trace table — a ruled grid with a
 * serif caption — so it reads as the assessment artifact students know. Cells
 * whose value changed from the previous row are highlighted like a freshly
 * pencilled-in answer, and while the program runs the latest row is marked as
 * the current step and scrolled into view.
 */
const TraceTable: React.FC<TraceTableProps> = ({ rows, maxRows, isLive = false }) => {
  const [copied, setCopied] = useState(false);

  // Column order = variables in the order they first appear across the trace.
  const columns = useMemo(() => {
    const seen: string[] = [];
    const set = new Set<string>();
    for (const row of rows) {
      for (const v of row.variables) {
        if (!set.has(v.name)) {
          set.add(v.name);
          seen.push(v.name);
        }
      }
    }
    return seen;
  }, [rows]);

  const formatVar = (value: string, type: string) => {
    if (type === 'STRING') return `"${value}"`;
    if (type === 'CHAR') return `'${value}'`;
    return value;
  };

  // Follow execution: keep the most recent (current) row in view while live.
  const lastRowRef = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    if (isLive && lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [rows.length, isLive]);

  const handleCopy = () => {
    const header = ['Step', 'Line', ...columns, 'OUTPUT'].join('\t');
    const lines = rows.map((row) => {
      const byName = new Map(row.variables.map((v) => [v.name, formatVar(v.value, v.type)]));
      const cells = columns.map((c) => byName.get(c) ?? '');
      return [row.step, row.line, ...cells, row.output.join(' ')].join('\t');
    });
    navigator.clipboard.writeText([header, ...lines].join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // Empty state — no trace recorded yet.
  if (rows.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-dark-text select-none p-4">
        <Table2 className="h-8 w-8 text-dark-text/20" />
        <div className="text-center space-y-1">
          <div className="display-serif text-base text-light-text/60">Dry-run trace</div>
          <div className="text-xs text-dark-text/50">
            Press <strong className="text-light-text">Run</strong> or <strong className="text-light-text">Debug</strong> to build a dry-run table
          </div>
          <div className="text-xs text-dark-text/30">
            Each row shows variable values after a line runs, plus any output.
          </div>
        </div>
      </div>
    );
  }

  const truncated = rows.length >= maxRows;

  // Ruling tones — faint grey lines that read as pencil rules on the dark sheet.
  const RULE = 'border-dark-text/10';
  // Sticky header rule via inset box-shadow (border-b detaches from a sticky cell on scroll).
  const headRule = 'shadow-[inset_0_-2px_0_0_var(--color-border)]';
  const headCell = `text-left py-1.5 px-2 font-normal sticky top-0 z-10 bg-background ${headRule}`;

  return (
    <div className="h-full flex flex-col" style={{ fontSize: 'var(--editor-font-size)' }}>
      {/* Caption bar — serif title gives it the printed-paper register */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 shrink-0 border-b border-dark-text/10">
        <div className="flex items-baseline gap-2 min-w-0">
          <Table2 className="h-3.5 w-3.5 text-primary self-center shrink-0" />
          <h3 className="display-serif text-base font-semibold text-light-text">Trace Table</h3>
          <span className="mono-label text-dark-text/45">dry run</span>
          <span className="text-dark-text/45 text-xs whitespace-nowrap">· {rows.length} steps</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-dark-text hover:text-light-text px-1.5 py-1 rounded hover:bg-surface transition-colors shrink-0"
          title="Copy as table (tab-separated)"
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto px-3 pb-3 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full">
        <table className="w-full text-xs font-mono border-collapse mt-1">
          <thead>
            {/* Sticky header — inset box-shadow (not border-b) so the divider
                stays put; collapsed borders detach from a sticky cell on scroll. */}
            <tr className="text-dark-text/60">
              <th className={`text-right py-1.5 pr-2 font-normal sticky top-0 left-0 z-20 bg-background ${headRule}`}>#</th>
              <th className={`text-right py-1.5 px-2 font-normal sticky top-0 z-10 bg-background ${headRule} border-l ${RULE}`}>Line</th>
              {columns.map((name) => (
                <th key={name} className={`${headCell} text-light-text/80 whitespace-nowrap border-l ${RULE}`}>
                  {name}
                </th>
              ))}
              <th className={`${headCell} text-success/70 border-l ${RULE}`}>OUTPUT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const byName = new Map(row.variables.map((v) => [v.name, v]));
              const prev = rowIdx > 0 ? rows[rowIdx - 1] : null;
              const prevByName = prev ? new Map(prev.variables.map((v) => [v.name, v])) : null;
              const isCurrent = isLive && rowIdx === rows.length - 1;
              const zebra = rowIdx % 2 === 1 ? 'bg-surface/20' : '';
              return (
                <tr
                  key={row.step}
                  ref={isCurrent ? lastRowRef : undefined}
                  className={`trace-row-in border-b ${RULE} transition-colors ${
                    isCurrent ? 'bg-primary/[0.08]' : zebra
                  } hover:bg-surface/40`}
                >
                  <td
                    className={`text-right py-1 pr-2 sticky left-0 z-[1] ${
                      isCurrent
                        ? 'bg-background text-primary font-semibold shadow-[inset_2px_0_0_0_var(--color-primary)]'
                        : 'bg-background text-dark-text/40'
                    }`}
                  >
                    {row.step}
                  </td>
                  <td className={`text-right py-1 px-2 text-dark-text/60 border-l ${RULE}`}>{row.line}</td>
                  {columns.map((name) => {
                    const v = byName.get(name);
                    if (!v) return <td key={name} className={`py-1 px-2 text-dark-text/20 border-l ${RULE}`}>·</td>;
                    const prevV = prevByName?.get(name);
                    const changed = !prevV || prevV.value !== v.value;
                    return (
                      <td
                        key={name}
                        className={`py-1 px-2 whitespace-nowrap border-l ${RULE} ${
                          changed ? 'text-info font-medium bg-primary/[0.12]' : 'text-light-text/70'
                        }`}
                      >
                        {formatVar(v.value, v.type)}
                      </td>
                    );
                  })}
                  <td className={`py-1 px-2 text-success/80 whitespace-pre-wrap border-l ${RULE}`}>{row.output.join('\n')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {truncated && (
        <div className="mx-3 mb-3 mt-2 flex items-center gap-1.5 text-[10px] text-warning bg-warning/5 border border-warning/20 rounded px-2.5 py-1.5 shrink-0">
          <AlertTriangle size={11} className="shrink-0" />
          Trace stopped after {maxRows} steps — check for a long or infinite loop.
        </div>
      )}
    </div>
  );
};

export default TraceTable;
