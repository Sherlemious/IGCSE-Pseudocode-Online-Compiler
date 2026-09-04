'use client';

import React, { forwardRef, useMemo } from 'react';
import highlightPseudocode from '@/shared/ui/highlightPseudocode';
import type { OutputEntry, TraceRow } from '@/modules/interpreter/core/types';
import { formatTraceVar, scalarTraceColumns } from '@/modules/compiler/traceTableModel';
import {
  EXPORT_CARD_WIDTH,
  MAX_EXPORT_CODE_LINES,
  MAX_EXPORT_TRACE_ROWS,
  MAX_EXPORT_TRACE_ROWS_WITH_CODE,
} from '@/modules/compiler/exportImage';
import { SITE_URL } from '@/shared/lib/seo';

export interface ExportCardProps {
  code: string;
  fileName: string;
  entries: OutputEntry[];
  traceRows: TraceRow[];
  showCode: boolean;
  showTerminal: boolean;
  showTrace: boolean;
}

const RULE = '1px solid rgba(var(--color-primary-rgb), 0.14)';
const CHANGED_BG = 'rgba(var(--color-primary-rgb), 0.16)';

/** Capture-safe type: explicit px so html-to-image cannot inherit editor zoom. */
const CARD_MONO: React.CSSProperties = {
  fontFamily: 'var(--editor-font-family)',
  fontSize: 13,
  lineHeight: '18px',
  letterSpacing: '0.01em',
};

function hostLabel(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, '');
  }
}

function cardTerminalText(entries: OutputEntry[]): string {
  return entries
    .map((entry) => {
      if (entry.kind === 'output') return entry.text;
      if (entry.kind === 'error') {
        const nl = entry.text.indexOf('\n');
        return `! ${nl === -1 ? entry.text : entry.text.slice(0, nl)}`;
      }
      if (entry.kind === 'input' && entry.submitted) {
        const prompt = entry.prompt ? `${entry.prompt}\n` : '';
        return `${prompt}← ${entry.variableName}: ${entry.value}`;
      }
      return null;
    })
    .filter((line) => line !== null)
    .join('\n');
}

const ExportCard = forwardRef<HTMLDivElement, ExportCardProps>(function ExportCard(
  { code, fileName, entries, traceRows, showCode, showTerminal, showTrace },
  ref,
) {
  const codeLines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code]);
  const codeTruncated = showCode && codeLines.length > MAX_EXPORT_CODE_LINES;
  const visibleCode = codeTruncated ? codeLines.slice(0, MAX_EXPORT_CODE_LINES) : codeLines;

  const terminalText = useMemo(() => cardTerminalText(entries), [entries]);
  const hasTerminalText = showTerminal && terminalText.length > 0;

  const traceCap = showCode ? MAX_EXPORT_TRACE_ROWS_WITH_CODE : MAX_EXPORT_TRACE_ROWS;
  const visibleTrace = useMemo(
    () => (showTrace ? traceRows.slice(0, traceCap) : []),
    [showTrace, traceRows, traceCap],
  );
  const traceTruncated = showTrace && traceRows.length > traceCap;
  const columns = useMemo(() => scalarTraceColumns(visibleTrace), [visibleTrace]);

  const showWindow = showCode || hasTerminalText;

  return (
    <div
      ref={ref}
      id="export-card"
      style={{
        width: EXPORT_CARD_WIDTH,
        height: 'fit-content',
        alignSelf: 'start',
        padding: '28px 28px 20px',
        backgroundColor: 'var(--color-background)',
        boxSizing: 'border-box',
      }}
    >
      {showWindow && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.32)',
          }}
        >
          <WindowChrome fileName={fileName} />
          {showCode && (
            <div style={{ padding: '12px 14px 14px', backgroundColor: 'var(--color-background)' }}>
              {visibleCode.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, ...CARD_MONO, color: 'var(--color-light-text)' }}>
                  <span
                    style={{
                      width: 22,
                      flexShrink: 0,
                      textAlign: 'right',
                      color: 'var(--color-dark-text)',
                      fontSize: 11,
                      lineHeight: '18px',
                      userSelect: 'none',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                    {line.length === 0 ? '\u00a0' : highlightPseudocode(line)}
                  </span>
                </div>
              ))}
              {codeTruncated && (
                <MutedNote>showing {MAX_EXPORT_CODE_LINES} of {codeLines.length} lines</MutedNote>
              )}
            </div>
          )}
          {hasTerminalText && (
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                padding: '10px 14px 12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--editor-font-family)',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-dark-text)',
                  marginBottom: 6,
                }}
              >
                Output
              </div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  color: 'var(--color-light-text)',
                  ...CARD_MONO,
                }}
              >
                {terminalText}
              </pre>
            </div>
          )}
        </div>
      )}

      {showTrace && (
        <div
          style={{
            marginTop: showWindow ? 14 : 0,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            overflow: 'hidden',
            padding: '12px 14px 14px',
            boxShadow: showWindow ? 'none' : '0 18px 40px rgba(0, 0, 0, 0.32)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span
              className="display-serif"
              style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-light-text)', lineHeight: '20px' }}
            >
              Trace table
            </span>
            <span style={{ ...CARD_MONO, fontSize: 11, color: 'var(--color-dark-text)' }}>
              {traceRows.length} step{traceRows.length === 1 ? '' : 's'}
            </span>
          </div>
          {visibleTrace.length === 0 ? (
            <div style={{ ...CARD_MONO, color: 'var(--color-dark-text)' }}>
              No trace yet — run the program first
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                ...CARD_MONO,
                fontSize: 12,
                lineHeight: '16px',
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
                      style={{ backgroundColor: zebra ? 'var(--color-background)' : 'transparent' }}
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
                      <Td color="var(--color-success)">
                        {row.output.join(' ')}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {traceTruncated && (
            <MutedNote>
              showing {traceCap} of {traceRows.length} steps
            </MutedNote>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          textAlign: 'center',
          fontSize: 11,
          lineHeight: '14px',
          color: 'var(--color-dark-text)',
          fontFamily: '"Inter Variable", Inter, sans-serif',
        }}
      >
        {hostLabel(SITE_URL)}
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
        height: 32,
        padding: '0 12px',
        backgroundColor: 'var(--color-header-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <Dot color="#FF5F56" />
        <Dot color="#FFBD2E" />
        <Dot color="#27C93F" />
      </div>
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'var(--editor-font-family)',
          fontSize: 11,
          lineHeight: '32px',
          color: 'var(--color-header-text)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 10px',
        }}
      >
        {fileName}
      </div>
      <div style={{ width: 36, flexShrink: 0 }} />
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
      }}
    />
  );
}

function MutedNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 8,
        fontSize: 11,
        lineHeight: '14px',
        color: 'var(--color-dark-text)',
        fontFamily: '"Inter Variable", Inter, sans-serif',
      }}
    >
      {children}
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
        padding: '4px 7px',
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
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  muted?: boolean;
  changed?: boolean;
  color?: string;
}) {
  return (
    <td
      style={{
        textAlign: align ?? 'left',
        padding: '3px 7px',
        borderBottom: RULE,
        borderLeft: RULE,
        whiteSpace: 'nowrap',
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
