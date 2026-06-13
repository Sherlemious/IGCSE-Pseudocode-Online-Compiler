'use client';

import React, { useMemo, useState } from 'react';
import { Table2, Copy, Check, AlertTriangle } from 'lucide-react';
import type { TraceRow } from '../../interpreter/core/types';

interface TraceTableProps {
  rows: TraceRow[];
  maxRows: number;
}

/**
 * Renders a Cambridge-style trace ("dry run") table: one row per executed
 * statement, a column per variable (in first-appearance order), and an OUTPUT
 * column. Cells whose value changed from the previous row are highlighted so
 * the flow of execution is easy to follow.
 */
const TraceTable: React.FC<TraceTableProps> = ({ rows, maxRows }) => {
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

  return (
    <div className="h-full flex flex-col" style={{ fontSize: 'var(--editor-font-size)' }}>
      {/* Copy control — stays pinned above the scrolling table */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-dark-text">
          <Table2 className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold tracking-wider uppercase">Trace Table</span>
          <span className="text-dark-text/50">({rows.length} steps)</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-dark-text hover:text-light-text px-1.5 py-1 rounded hover:bg-surface transition-colors"
          title="Copy as table (tab-separated)"
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto px-3 pb-3 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            {/* Sticky header — inset box-shadow (not border-b) so the divider
                stays put; collapsed borders detach from a sticky cell on scroll. */}
            <tr className="text-dark-text/60">
              <th className="text-right py-1 pr-2 font-normal sticky top-0 left-0 z-20 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]">#</th>
              <th className="text-right py-1 px-2 font-normal sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]">Line</th>
              {columns.map((name) => (
                <th key={name} className="text-left py-1 px-2 font-normal text-light-text/80 whitespace-nowrap sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]">
                  {name}
                </th>
              ))}
              <th className="text-left py-1 px-2 font-normal sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]">OUTPUT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const byName = new Map(row.variables.map((v) => [v.name, v]));
              const prev = rowIdx > 0 ? rows[rowIdx - 1] : null;
              const prevByName = prev ? new Map(prev.variables.map((v) => [v.name, v])) : null;
              return (
                <tr key={row.step} className="border-b border-border/10 hover:bg-surface/40">
                  <td className="text-right py-1 pr-2 text-dark-text/40 sticky left-0 z-[1] bg-background">{row.step}</td>
                  <td className="text-right py-1 px-2 text-dark-text/60">{row.line}</td>
                  {columns.map((name) => {
                    const v = byName.get(name);
                    if (!v) return <td key={name} className="py-1 px-2 text-dark-text/20">·</td>;
                    const prevV = prevByName?.get(name);
                    const changed = !prevV || prevV.value !== v.value;
                    return (
                      <td
                        key={name}
                        className={`py-1 px-2 whitespace-nowrap ${
                          changed ? 'text-info bg-info/5 rounded' : 'text-light-text/70'
                        }`}
                      >
                        {formatVar(v.value, v.type)}
                      </td>
                    );
                  })}
                  <td className="py-1 px-2 text-success/80 whitespace-pre-wrap">{row.output.join('\n')}</td>
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
