'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Plus, Loader2, X, Users, CalendarClock, Pencil } from 'lucide-react';
import Combobox from '@/shared/ui/Combobox';
import DatePicker from '@/shared/ui/DatePicker';
import AssignmentShareActions from './AssignmentShareActions';
import ClassQuickStart from './ClassQuickStart';
import type { AssignResult } from './AssignToClass';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface AssignmentRow {
  id: string;
  examId: string;
  examTitle: string;
  dueDate: string | null;
  questionCount: number;
  submittedCount: number;
  rosterSize: number;
  isPublished: boolean;
}

interface Props {
  classId: string;
  className: string;
  joinCode: string;
  rosterSize: number;
  assignments: AssignmentRow[];
  availableExams: { id: string; title: string }[];
  starterQuestions?: { id: string; title: string }[];
}

function formatDue(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function dueInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : '';
}

export default function ClassAssignments({ classId, className, joinCode, rosterSize, assignments, availableExams, starterQuestions = [] }: Props) {
  const router = useRouter();
  const [examId, setExamId] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<AssignmentRow | null>(null);
  const [edits, setEdits] = useState<Record<string, { examTitle: string; dueDate: string | null }>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickStartOpen, setQuickStartOpen] = useState(false);
  // The server drops the suggestion list once an assignment exists. Keep it while
  // the dialog is still open, or that dialog unmounts before the teacher dismisses it.
  const [rememberedStarters, setRememberedStarters] = useState(starterQuestions);
  useEffect(() => {
    if (starterQuestions.length > 0) setRememberedStarters(starterQuestions);
  }, [starterQuestions]);
  const starters = starterQuestions.length > 0 ? starterQuestions : rememberedStarters;

  const rows = (pending && !assignments.some((a) => a.id === pending.id) ? [pending, ...assignments] : assignments)
    .map((row) => (edits[row.id] ? { ...row, ...edits[row.id] } : row));

  async function assign() {
    if (!examId || busy) return;
    setBusy('assign');
    setError('');
    const res = await fetch(`/api/classes/${classId}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, dueDate: due || undefined }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not assign that exam.');
      return;
    }
    setExamId('');
    setDue('');
    router.refresh();
  }

  function handleQuickAssigned(result: AssignResult, dueDate: string) {
    setPending({
      id: result.assignmentId,
      examId: result.examId,
      examTitle: result.title,
      dueDate: dueDate ? new Date(`${dueDate}T00:00:00.000Z`).toISOString() : null,
      questionCount: result.questionCount,
      submittedCount: 0,
      rosterSize,
      isPublished: true,
    });
  }

  async function saveEdit(row: AssignmentRow, title: string, dueDate: string) {
    const trimmed = title.trim();
    if (!trimmed || busy) return;
    setBusy(row.id);
    setError('');
    const res = await fetch(`/api/classes/${classId}/assignments/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmed, dueDate: dueDate || null }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not save that assignment.');
      return;
    }
    setEdits((prev) => ({
      ...prev,
      [row.id]: {
        examTitle: trimmed,
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00.000Z`).toISOString() : null,
      },
    }));
    setEditingId(null);
    router.refresh();
  }

  async function unassign(id: string) {
    setBusy(id);
    const res = await fetch(`/api/classes/${classId}/assignments/${id}`, { method: 'DELETE' });
    setBusy(null);
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-1">
        <ClipboardList size={14} className="text-dark-text" />
        <h2 className="mono-label text-dark-text">Assigned work{assignments.length > 0 && ` · ${assignments.length}`}</h2>
      </div>

      {/* Assign an exam */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-4 mb-4">
        {error && (
          <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-3 animate-scale-in">
            {error}
          </div>
        )}
        {availableExams.length === 0 ? (
          <p className="text-xs text-dark-text/70">
            {assignments.length > 0 ? 'All your exams are already assigned here. ' : ''}
            <Link href="/exams/new" className="text-primary hover:underline">Create an exam</Link> to assign work.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 min-w-0">
              <Combobox
                options={availableExams.map((e) => ({ value: e.id, label: e.title }))}
                value={examId}
                onChange={setExamId}
                placeholder="Choose an exam…"
                searchPlaceholder="Search your exams…"
                emptyText="No exams match."
                ariaLabel="Choose an exam to assign"
              />
            </div>
            <DatePicker value={due || null} onChange={(v) => setDue(v ?? '')} min={todayISO()} ariaLabel="Optional due date" />
            <button
              onClick={assign}
              disabled={!examId || busy === 'assign'}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {busy === 'assign' ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Assign
            </button>
          </div>
        )}
      </div>

      {/* Assignment list */}
      {(rows.length === 0 || quickStartOpen) && starters.length > 0 && (
        <div className={rows.length > 0 ? 'hidden' : undefined}>
          <ClassQuickStart
            classId={classId}
            className={className}
            joinCode={joinCode}
            questions={starters}
            onAssigned={handleQuickAssigned}
            onOpenChange={setQuickStartOpen}
          />
        </div>
      )}
      {rows.length === 0 && starters.length === 0 ? (
        <p className="text-sm text-dark-text/70 px-1 py-4">No work assigned yet. Assign one of your exams above.</p>
      ) : rows.length > 0 ? (
        <div className="space-y-2">
          {rows.map((a) => {
            const dueLabel = formatDue(a.dueDate);
            const editing = editingId === a.id;
            return (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border rounded-lg px-4 py-3">
                {editing ? (
                  <AssignmentEditForm
                    row={a}
                    busy={busy === a.id}
                    onCancel={() => setEditingId(null)}
                    onSave={(title, dueDate) => saveEdit(a, title, dueDate)}
                  />
                ) : (
                  <>
                    <div className="min-w-0">
                      <Link href={`/classes/${classId}/assignments/${a.id}`} className="text-sm font-medium text-light-text truncate hover:text-primary transition-colors block">
                        {a.examTitle}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-dark-text font-mono">
                        <span className="flex items-center gap-1 text-primary/90">
                          <Users size={11} />{a.submittedCount}/{a.rosterSize} submitted
                        </span>
                        {dueLabel && <span className="flex items-center gap-1"><CalendarClock size={11} />due {dueLabel}</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => { setEditingId(a.id); setError(''); }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-dark-text hover:text-primary hover:bg-primary/10 transition-colors"
                        aria-label={`Edit ${a.examTitle}`}
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => unassign(a.id)}
                        disabled={busy === a.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-dark-text hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                        aria-label="Unassign"
                      >
                        {busy === a.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                        Remove
                      </button>
                    </div>
                    <div className="w-full border-t border-border/50 pt-3">
                      <AssignmentShareActions classId={classId} assignmentId={a.id} joinCode={joinCode} disabled={!a.isPublished || a.questionCount === 0} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function AssignmentEditForm({
  row,
  busy,
  onCancel,
  onSave,
}: {
  row: AssignmentRow;
  busy: boolean;
  onCancel: () => void;
  onSave: (title: string, dueDate: string) => void;
}) {
  const [title, setTitle] = useState(row.examTitle);
  const [dueDate, setDueDate] = useState(dueInputValue(row.dueDate));
  return (
    <div className="w-full space-y-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        aria-label="Assignment name"
        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-light-text focus:outline-none focus:border-primary/50"
      />
      <DatePicker value={dueDate || null} onChange={(value) => setDueDate(value ?? '')} min={todayISO()} ariaLabel="Due date" />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSave(title, dueDate)}
          disabled={busy || !title.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-on-primary hover:opacity-90 disabled:opacity-50"
        >
          {busy && <Loader2 size={13} className="animate-spin" />}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-2 text-xs text-dark-text hover:text-light-text"
        >
          Cancel
        </button>
        <Link href={`/exams/${row.examId}/edit`} className="text-xs text-primary hover:underline">
          Edit questions
        </Link>
      </div>
    </div>
  );
}
