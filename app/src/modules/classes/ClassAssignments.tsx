'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Plus, Loader2, X, Users, CalendarClock } from 'lucide-react';
import Combobox from '@/shared/ui/Combobox';
import DatePicker from '@/shared/ui/DatePicker';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface AssignmentRow {
  id: string;
  examTitle: string;
  dueDate: string | null;
  questionCount: number;
  submittedCount: number;
  rosterSize: number;
}

interface Props {
  classId: string;
  assignments: AssignmentRow[];
  availableExams: { id: string; title: string }[];
}

function formatDue(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ClassAssignments({ classId, assignments, availableExams }: Props) {
  const router = useRouter();
  const [examId, setExamId] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

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
      {assignments.length === 0 ? (
        <p className="text-sm text-dark-text/70 px-1 py-4">No work assigned yet. Assign one of your exams above.</p>
      ) : (
        <div className="space-y-2">
          {assignments.map((a) => {
            const dueLabel = formatDue(a.dueDate);
            return (
              <div key={a.id} className="flex items-center justify-between gap-3 bg-surface border border-border rounded-lg px-4 py-3">
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
                <button
                  onClick={() => unassign(a.id)}
                  disabled={busy === a.id}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-dark-text hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                  aria-label="Unassign"
                >
                  {busy === a.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
