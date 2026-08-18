'use client';

import React, { forwardRef, useMemo } from 'react';
import highlightPseudocode from '../../common/highlightPseudocode';
import type { OutputEntry, TraceRow } from '../../../interpreter/core/types';
import { formatTraceVar, traceColumns } from '../../../lib/traceTableModel';
import {
  EXPORT_CARD_WIDTH,
  MAX_EXPORT_CODE_LINES,
  MAX_EXPORT_TRACE_ROWS,
} from '../../../lib/exportImage';
import { SITE_URL } from '../../../lib/seo';

export interface ExportCardProps {
  code: string;
  fileName: string;
  entries: OutputEntry[];
  traceRows: TraceRow[];
  showCode: boolean;
  showTerminal: boolean;
  showTrace: boolean;
}

const RULE = '1px solid rgba(var(--color-primary-rgb), 0.12)';
const CHANGED_BG = 'rgba(var(--color-primary-rgb), 0.15)';

const mono: React.CSSProperties = {
  fontFamily: 'var(--editor-font-family)',
  fontSize: 'var(--editor-font-size)',
  letterSpacing: 'var(--editor-letter-spacing)',
  lineHeight: 'var(--editor-line-height)',
};

function hostLabel(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, '');
  }
}

const ExportCard = forwardRef<HTMLDivElement, ExportCardProps>(function ExportCard(
  { code, fileName, entries, traceRows, showCode, showTerminal, showTrace },
  ref,
) {
  const codeLines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code]);
  const codeTruncated = showCode && codeLines.length > MAX_EXPORT_CODE_LINES;
  const visibleCode = codeTruncated ? codeLines.slice(0, MAX_EXPORT_CODE_LINES) : codeLines;

  const terminalEntries = useMemo(
    () =>
      entries.filter(
        (e) => e.kind === 'output' || e.kind === 'error' || (e.kind === 'input' && e.submitted),
      ),
    [entries],
  );

  const visibleTrace = useMemo(
    () => (showTrace ? traceRows.slice(0, MAX_EXPORT_TRACE_ROWS) : []),
    [showTrace, traceRows],
  );
  const traceTruncated = showTrace && traceRows.length > MAX_EXPORT_TRACE_ROWS;
  const columns = useMemo(() => traceColumns(visibleTrace), [visibleTrace]);

  const sections: React.ReactNode[] = [];

  if (showCode) {
    sections.push(
      <div key="code" style={{ padding: '14px 16px 16px' }}>
        {visibleCode.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, ...mono, color: 'var(--color-light-text)' }}>
            <span
              style={{
                width: 28,
                flexShrink: 0,
                textAlign: 'right',
                color: 'var(--color-dark-text)',
                userSelect: 'none',
                opacity: 0.7,
              }}
            >
              {i + 1}
            </span>
            <span style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', minHeight: '1.2em' }}>
              {line.length === 0 ? '\u00a0' : highlightPseudocode(line)}
            </span>
          </div>
        ))}
        {codeTruncated && (
          <Footnote>
            showing {MAX_EXPORT_CODE_LINES} of {codeLines.length} lines
          </Footnote>
        )}
      </div>,
    );
  }

  if (showTerminal) {
    sections.push(
      <div key="terminal" style={{ padding: '12px 16px 16px' }}>
        <SectionLabel>Terminal</SectionLabel>
        {terminalEntries.length === 0 ? (
          <div style={{ ...mono, color: 'var(--color-dark-text)', fontSize: 12 }}>
            No output yet — run the program first
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {terminalEntries.map((entry, i) => (
              <TerminalLine key={i} entry={entry} />
            ))}
          </div>
        )}
      </div>,
    );
  }

  if (showTrace) {
    sections.push(
      <div key="trace" style={{ padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span
            className="display-serif"
            style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-light-text)' }}
          >
            Trace Table
          </span>
          <span
            className="mono-label"
            style={{ color: 'var(--color-dark-text)', opacity: 0.7 }}
          >
            dry run
          </span>
          {traceRows.length > 0 && (
            <span style={{ fontSize: 11, color: 'var(--color-dark-text)' }}>
              · {traceRows.length} steps
            </span>
          )}
        </div>
        {visibleTrace.length === 0 ? (
          <div style={{ ...mono, color: 'var(--color-dark-text)', fontSize: 12 }}>
            No trace yet — run the program first
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              ...mono,
              fontSize: 12,
            }}
          >
            <thead>
              <tr>
                <Th align="right">#</Th>
                <Th align="right">Line</Th>
                {columns.map((name) => (
                  <Th key={name}>{name}</Th>
                ))}
                <Th color="var(--color-success)">OUTPUT</Th>
              </tr>
            </thead>
            <tbody>
              {visibleTrace.map((row, rowIdx) => {
                const byName = new Map(row.variables.map((v) => [v.name, v]));
                const prev = rowIdx > 0 ? visibleTrace[rowIdx - 1] : null;
                const prevByName = prev ? new Map(prev.variables.map((v) => [v.name, v])) : null;
                const zebra = rowIdx % 2 === 1;
                return (
                  <tr
                    key={row.step}
                    style={{
                      backgroundColor: zebra ? 'var(--color-surface)' : 'transparent',
                    }}
                  >
                    <Td align="right" muted>
                      {row.step}
                    </Td>
                    <Td align="right" muted>
                      {row.line}
                    </Td>
                    {columns.map((name) => {
                      const v = byName.get(name);
                      if (!v) {
                        return (
                          <Td key={name} muted>
                            ·
                          </Td>
                        );
                      }
                      const prevV = prevByName?.get(name);
                      const changed = !prevV || prevV.value !== v.value;
                      return (
                        <Td key={name} changed={changed}>
                          {formatTraceVar(v.value, v.type)}
                        </Td>
                      );
                    })}
                    <Td color="var(--color-success)" pre>
                      {row.output.join('\n')}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {traceTruncated && (
          <Footnote>
            showing {MAX_EXPORT_TRACE_ROWS} of {traceRows.length} steps
          </Footnote>
        )}
      </div>,
    );
  }

  return (
    <div
      ref={ref}
      id="export-card"
      style={{
        width: EXPORT_CARD_WIDTH,
        padding: '40px 36px 28px',
        backgroundColor: 'var(--color-background)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)',
        }}
      >
        <WindowChrome fileName={fileName} />
        {sections.map((section, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ height: 1, backgroundColor: 'var(--color-border)' }} />
            )}
            {section}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          padding: '0 4px',
          fontSize: 11,
          color: 'var(--color-dark-text)',
          fontFamily: '"Inter Variable", Inter, sans-serif',
        }}
      >
        <span>{hostLabel(SITE_URL)}</span>
        <span>Open in compiler</span>
      </div>
    </div>
  );
});

ExportCard.displayName = 'ExportCard';

function WindowChrome({ fileName }: { fileName: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 36,
        padding: '0 14px',
        backgroundColor: 'var(--color-header-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <Dot color="#FF5F56" />
        <Dot color="#FFBD2E" />
        <Dot color="#27C93F" />
      </div>
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'var(--editor-font-family)',
          fontSize: 12,
          color: 'var(--color-header-text)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 12px',
        }}
      >
        {fileName}
      </div>
      <div style={{ width: 42, flexShrink: 0 }} />
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
      }}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mono-label"
      style={{ color: 'var(--color-dark-text)', marginBottom: 8 }}
    >
      {children}
    </div>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 10,
        fontSize: 11,
        color: 'var(--color-dark-text)',
        fontFamily: '"Inter Variable", Inter, sans-serif',
      }}
    >
      {children}
    </div>
  );
}

function TerminalLine({ entry }: { entry: OutputEntry }) {
  if (entry.kind === 'output') {
    return (
      <div style={{ display: 'flex', gap: 8, ...mono, color: 'var(--color-light-text)', whiteSpace: 'pre-wrap' }}>
        <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>›</span>
        <span>{entry.text}</span>
      </div>
    );
  }
  if (entry.kind === 'error') {
    const newlineIdx = entry.text.indexOf('\n');
    const summary = newlineIdx === -1 ? entry.text : entry.text.slice(0, newlineIdx);
    return (
      <div style={{ display: 'flex', gap: 8, ...mono, color: 'var(--color-error)', whiteSpace: 'pre-wrap' }}>
        <span style={{ flexShrink: 0, fontWeight: 700 }}>!</span>
        <span>{summary}</span>
      </div>
    );
  }
  // submitted input
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...mono }}>
      {entry.prompt && (
        <span style={{ color: 'var(--color-primary)', whiteSpace: 'pre-wrap' }}>{entry.prompt}</span>
      )}
      <div style={{ display: 'flex', gap: 8, whiteSpace: 'pre-wrap' }}>
        <span style={{ color: 'var(--color-info)', flexShrink: 0 }}>←</span>
        <span style={{ color: 'var(--color-dark-text)' }}>{entry.variableName}:</span>
        <span style={{ color: 'var(--color-info)' }}>{entry.value}</span>
      </div>
    </div>
  );
}

function Th({
  children,
  align,
  color,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  color?: string;
}) {
  return (
    <th
      style={{
        textAlign: align ?? 'left',
        fontWeight: 500,
        padding: '6px 8px',
        borderBottom: RULE,
        borderLeft: RULE,
        color: color ?? 'var(--color-dark-text)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  muted,
  changed,
  color,
  pre,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  muted?: boolean;
  changed?: boolean;
  color?: string;
  pre?: boolean;
}) {
  return (
    <td
      style={{
        textAlign: align ?? 'left',
        padding: '5px 8px',
        borderBottom: RULE,
        borderLeft: RULE,
        whiteSpace: pre ? 'pre-wrap' : 'nowrap',
        color: color ?? (muted ? 'var(--color-dark-text)' : 'var(--color-light-text)'),
        backgroundColor: changed ? CHANGED_BG : undefined,
        fontWeight: changed ? 500 : undefined,
      }}
    >
      {children}
    </td>
  );
}

export default ExportCard;
