'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Download, Loader2, Lock } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import StudentProgressLink from './StudentProgressLink';
import {
  formatMarkPercent,
  MARK_STATUS_LABEL,
  type MarkPreviewCell,
  type MarkPreviewColumn,
  type MarkPreviewRow,
  type MarkStatus,
} from './markBook';

const UPGRADE_HREF = '/pricing?view=teacher&from=mark_book';

const STATUS_TONE: Record<MarkStatus, string> = {
  submitted: 'text-primary',
  late: 'text-warning',
  missing: 'text-error',
  in_progress: 'text-dark-text',
  not_started: 'text-dark-text/50',
};

type SortKey = 'name' | 'average';

interface Props {
  classId: string;
  tier: string;
  exportAllowed: boolean;
  columns: MarkPreviewColumn[];
  rows: MarkPreviewRow[];
}

function studentName(row: Pick<MarkPreviewRow, 'name' | 'email'>): string {
  return row.name?.trim() || row.email || 'Student';
}

function sortRows(rows: MarkPreviewRow[], sort: SortKey): MarkPreviewRow[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    if (sort === 'average') {
      if (a.averagePercent == null && b.averagePercent == null) {
        return studentName(a).localeCompare(studentName(b), undefined, { sensitivity: 'base' });
      }
      if (a.averagePercent == null) return 1;
      if (b.averagePercent == null) return -1;
      const delta = b.averagePercent - a.averagePercent;
      if (delta !== 0) return delta;
    }
    return studentName(a).localeCompare(studentName(b), undefined, { sensitivity: 'base' });
  });
  return copy;
}

function mean(values: Array<number | null>): number | null {
  let sum = 0;
  let count = 0;
  for (const value of values) {
    if (value == null || !Number.isFinite(value)) continue;
    sum += value;
    count += 1;
  }
  return count === 0 ? null : sum / count;
}

function filenameFromDisposition(header: string | null): string | null {
  if (!header) return null;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1]);
    } catch {
      return null;
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  return quoted?.[1] ?? null;
}

function ScoreCell({ cell }: { cell: MarkPreviewCell }) {
  if (cell.locked || !cell.status) {
    return (
      <span className="inline-flex items-center justify-center text-dark-text/40" aria-label="Included with Starter">
        <Lock size={13} />
      </span>
    );
  }
  const raw = cell.score != null && cell.totalTests != null ? `${cell.score}/${cell.totalTests}` : null;
  return (
    <span className="block">
      <span className="block font-mono tabular-nums text-light-text">
        {cell.percent == null ? '—' : formatMarkPercent(cell.percent)}
        {raw && <span className="text-dark-text/70"> {raw}</span>}
      </span>
      <span className={`block text-[10px] font-mono ${STATUS_TONE[cell.status]}`}>{MARK_STATUS_LABEL[cell.status]}</span>
    </span>
  );
}

export default function MarkBookTable({ classId, tier, exportAllowed, columns, rows }: Props) {
  const viewed = useRef(false);
  const [sort, setSort] = useState<SortKey>('name');
  const [downloading, setDownloading] = useState(false);
  const [exportError, setExportError] = useState('');
  const averageLocked = rows.some((row) => row.averageLocked) || columns.some((column) => column.locked);
  const sorted = useMemo(() => sortRows(rows, averageLocked ? 'name' : sort), [averageLocked, rows, sort]);
  const classAverage = mean(rows.map((row) => row.averagePercent));

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    captureEvent('class_marks_viewed', {
      class_id: classId,
      roster_size: rows.length,
      assignment_count: columns.length,
      tier,
    });
    if (!exportAllowed) {
      captureEvent('nudge_shown', { nudge: 'mark_book_upgrade', class_id: classId });
    }
  }, [classId, columns.length, exportAllowed, rows.length, tier]);

  function clickUpgrade() {
    captureEvent('nudge_clicked', { nudge: 'mark_book_upgrade', class_id: classId });
  }

  async function download() {
    if (downloading) return;
    setDownloading(true);
    setExportError('');
    try {
      const res = await fetch(`/api/classes/${classId}/marks.csv`);
      if (res.status === 403) {
        setExportError('CSV export is included with Starter.');
        return;
      }
      if (!res.ok) {
        setExportError('Could not download the mark book.');
        return;
      }
      const blob = await res.blob();
      const filename = filenameFromDisposition(res.headers.get('Content-Disposition')) ?? 'marks.csv';
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
      captureEvent('class_marks_exported', {
        class_id: classId,
        row_count: rows.length,
        assignment_count: columns.length,
      });
    } catch {
      setExportError('Could not download the mark book.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="display-serif text-2xl font-semibold text-light-text">Mark book</h1>
          <p className="text-[11px] text-dark-text/60 mt-1 font-mono">
            {rows.length} student{rows.length === 1 ? '' : 's'}
            {' · '}
            {columns.length} assignment{columns.length === 1 ? '' : 's'}
          </p>
        </div>
        {exportAllowed ? (
          <button
            type="button"
            onClick={() => void download()}
            disabled={downloading}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Download CSV
          </button>
        ) : (
          <Link
            href={UPGRADE_HREF}
            onClick={clickUpgrade}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-dark-text hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Lock size={13} />
            Download CSV
          </Link>
        )}
      </div>

      {exportError && (
        <p className="text-xs text-error mb-4">{exportError}</p>
      )}

      {!exportAllowed && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3.5 mb-6">
          <p className="text-sm text-light-text">
            The full mark book and CSV export are included with Starter.
            {columns.length > 1 ? ' This preview shows the latest assignment.' : ' Download unlocks on Starter.'}
          </p>
          <Link href={UPGRADE_HREF} onClick={clickUpgrade} className="mt-2 inline-flex text-sm font-semibold text-primary hover:underline">
            See teacher plans
          </Link>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-dark-text/70 px-1 py-6 text-center">
          No students yet. Share the class invite link and their marks will show up here.
        </p>
      ) : columns.length === 0 ? (
        <p className="text-sm text-dark-text/70 px-1 py-6 text-center">
          No assignments yet. Assign an exam and this grid fills in as students submit.
        </p>
      ) : (
        <>
          {rows.length > 1 && !averageLocked && (
            <div className="flex items-center justify-end gap-1 mb-3">
              {(['name', 'average'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono transition-colors ${
                    sort === key ? 'bg-primary/15 text-primary' : 'text-dark-text/60 hover:text-light-text hover:bg-surface'
                  }`}
                >
                  {key === 'name' ? 'Name' : 'Average'}
                </button>
              ))}
            </div>
          )}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-30 bg-surface border-b border-r border-border px-3 py-2.5 text-[10px] font-mono text-dark-text min-w-[11rem]"
                    >
                      Student
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column.id}
                        scope="col"
                        className="border-b border-r border-border px-3 py-2.5 text-[10px] font-mono text-dark-text min-w-[8.5rem] max-w-[12rem] bg-surface"
                      >
                        {column.locked ? (
                          <span className="inline-flex items-center gap-1 max-w-full">
                            <Lock size={11} className="shrink-0 text-dark-text/40" aria-hidden />
                            <span className="truncate" title={column.title}>{column.title}</span>
                          </span>
                        ) : (
                          <Link
                            href={`/classes/${classId}/assignments/${column.id}`}
                            className="block truncate hover:text-primary transition-colors"
                            title={column.title}
                          >
                            {column.title}
                          </Link>
                        )}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="border-b border-border px-3 py-2.5 text-[10px] font-mono text-dark-text min-w-[6.5rem] bg-surface"
                    >
                      Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row) => (
                    <tr key={row.userId}>
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-surface border-b border-r border-border px-3 py-2.5 font-normal"
                      >
                        <StudentProgressLink classId={classId} studentId={row.userId} source="mark_book" className="block min-w-0 group">
                          <span className="block text-sm text-light-text truncate group-hover:text-primary transition-colors">
                            {studentName(row)}
                          </span>
                          {row.name && row.email && (
                            <span className="block text-[11px] text-dark-text/60 truncate">{row.email}</span>
                          )}
                        </StudentProgressLink>
                      </th>
                      {row.cells.map((cell, index) => {
                        const column = columns[index];
                        if (!column) return null;
                        return (
                          <td key={column.id} className="border-b border-r border-border px-3 py-2.5 align-top bg-background">
                            {cell.locked ? (
                              <ScoreCell cell={cell} />
                            ) : (
                              <Link
                                href={`/classes/${classId}/assignments/${column.id}`}
                                className="block rounded-md hover:bg-primary/5 transition-colors"
                              >
                                <ScoreCell cell={cell} />
                              </Link>
                            )}
                          </td>
                        );
                      })}
                      <td className="border-b border-border px-3 py-2.5 align-top bg-background">
                        {row.averageLocked ? (
                          <span className="inline-flex text-dark-text/40" aria-label="Included with Starter">
                            <Lock size={13} />
                          </span>
                        ) : (
                          <span className="block">
                            <span className="block font-mono tabular-nums text-light-text">
                              {row.averagePercent == null ? '—' : formatMarkPercent(row.averagePercent)}
                            </span>
                            <span className="block text-[10px] font-mono text-dark-text/60">
                              {row.submittedCount ?? 0}/{columns.length} submitted
                            </span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-surface border-r border-border px-3 py-2.5 text-[10px] font-mono text-dark-text font-normal"
                    >
                      Class
                    </th>
                    {columns.map((column) => (
                      <td key={column.id} className="border-r border-border px-3 py-2.5 bg-surface">
                        {column.locked ? (
                          <span className="inline-flex text-dark-text/40" aria-label="Included with Starter">
                            <Lock size={13} />
                          </span>
                        ) : (
                          <span className="block text-[10px] font-mono text-dark-text/70">
                            <span className="block text-light-text">{column.submittedCount ?? 0} submitted</span>
                            <span className="block">
                              {column.averagePercent == null ? '—' : formatMarkPercent(column.averagePercent)} avg
                            </span>
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2.5 bg-surface">
                      {averageLocked ? (
                        <span className="inline-flex text-dark-text/40" aria-label="Included with Starter">
                          <Lock size={13} />
                        </span>
                      ) : (
                        <span className="block text-[10px] font-mono text-light-text">
                          {classAverage == null ? '—' : formatMarkPercent(classAverage)}
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
