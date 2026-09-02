'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Loader2, Check, ArrowRight } from 'lucide-react';
import Combobox from '@/components/ui/Combobox';
import DatePicker from '@/components/ui/DatePicker';

interface Props {
  examId: string;
  highlight?: boolean; // subtle emphasis right after exam creation
}

interface OwnedClass {
  id: string;
  name: string;
  _count: { memberships: number };
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AssignExamToClass({ examId, highlight }: Props) {
  const [classes, setClasses] = useState<OwnedClass[] | null>(null);
  const [classId, setClassId] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [assigned, setAssigned] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    let live = true;
    fetch('/api/classes')
      .then((r) => (r.ok ? r.json() : { owned: [] }))
      .then((d) => live && setClasses(d.owned ?? []))
      .catch(() => live && setClasses([]));
    return () => {
      live = false;
    };
  }, []);

  async function assign() {
    if (!classId || busy) return;
    setBusy(true);
    setError('');
    const res = await fetch(`/api/classes/${classId}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, dueDate: due || undefined }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Could not assign to that class.');
      return;
    }
    const cls = classes?.find((c) => c.id === classId);
    setAssigned({ id: classId, name: cls?.name ?? 'your class' });
  }

  const cardBase =
    'rounded-xl border p-5 transition-colors ' +
    (highlight ? 'border-primary/40 bg-primary/[0.04]' : 'border-border bg-surface/80 backdrop-blur-sm');

  if (assigned) {
    return (
      <div className={cardBase}>
        <div className="flex items-center gap-2 text-sm text-primary mb-2">
          <Check size={15} />
          Assigned to <span className="font-semibold">{assigned.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/classes/${assigned.id}`} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            View class <ArrowRight size={12} />
          </Link>
          <button onClick={() => setAssigned(null)} className="text-xs text-dark-text hover:text-light-text transition-colors">
            Assign to another class
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cardBase}>
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap size={14} className="text-primary" />
        <h2 className="mono-label text-light-text">Assign to a class</h2>
      </div>

      {classes === null ? (
        <p className="text-xs text-dark-text/60">Loading your classes…</p>
      ) : classes.length === 0 ? (
        <p className="text-xs text-dark-text/70">
          You don&apos;t have a class yet.{' '}
          <Link href="/classes" className="text-primary hover:underline">Create one</Link> to assign this exam as work.
        </p>
      ) : (
        <>
          {error && (
            <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-3 animate-scale-in">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 min-w-0">
              <Combobox
                options={classes.map((c) => ({ value: c.id, label: c.name, hint: `${c._count.memberships}` }))}
                value={classId}
                onChange={setClassId}
                placeholder="Choose a class…"
                searchPlaceholder="Search your classes…"
                emptyText="No classes match."
                ariaLabel="Choose a class to assign to"
              />
            </div>
            <DatePicker value={due || null} onChange={(v) => setDue(v ?? '')} min={todayISO()} ariaLabel="Optional due date" />
            <button
              onClick={assign}
              disabled={!classId || busy}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <GraduationCap size={15} />}
              Assign
            </button>
          </div>
        </>
      )}
    </div>
  );
}
