'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Pencil, Archive, UserMinus, Loader2, Users, ChevronRight } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import StudentProgressLink from './StudentProgressLink';
import { formatLastActive, rosterHeadlineStats } from './rosterStats';

export interface ClassMember {
  userId: string;
  name: string | null;
  email: string | null;
  joinedAt: string;
  solvedCount: number;
  attemptedCount: number;
  lastActiveAt: string | null;
  assignmentsSubmitted: number;
}

export type RosterSort = 'name' | 'solved' | 'last_active';

interface Props {
  classId: string;
  initialName: string;
  joinUrl: string;
  joinCode: string;
  maxStudents: number | null; // null = unlimited
  assignmentCount: number;
  members: ClassMember[];
}

function displayName(m: ClassMember): string {
  return m.name || m.email || 'Student';
}

function sortMembers(members: ClassMember[], sort: RosterSort): ClassMember[] {
  const copy = [...members];
  copy.sort((a, b) => {
    if (sort === 'solved') {
      const delta = b.solvedCount - a.solvedCount;
      return delta !== 0 ? delta : displayName(a).localeCompare(displayName(b), undefined, { sensitivity: 'base' });
    }
    if (sort === 'last_active') {
      const at = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
      const bt = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
      const delta = bt - at;
      return delta !== 0 ? delta : displayName(a).localeCompare(displayName(b), undefined, { sensitivity: 'base' });
    }
    return displayName(a).localeCompare(displayName(b), undefined, { sensitivity: 'base' });
  });
  return copy;
}

const SORTS: { id: RosterSort; label: string }[] = [
  { id: 'name', label: 'Name' },
  { id: 'solved', label: 'Solved' },
  { id: 'last_active', label: 'Last active' },
];

export default function ClassManager({
  classId,
  initialName,
  joinUrl,
  joinCode,
  maxStudents,
  assignmentCount,
  members: initialMembers,
}: Props) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [sort, setSort] = useState<RosterSort>('name');
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    const headline = rosterHeadlineStats(initialMembers);
    captureEvent('class_progress_viewed', {
      class_id: classId,
      roster_size: initialMembers.length,
      assignment_count: assignmentCount,
      ...headline,
    });
  }, [assignmentCount, classId, initialMembers]);

  const sorted = useMemo(() => sortMembers(members, sort), [members, sort]);

  function changeSort(next: RosterSort) {
    if (next === sort) return;
    setSort(next);
    captureEvent('class_roster_sorted', { class_id: classId, sort: next });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  async function saveName() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === initialName) {
      setEditing(false);
      setName(initialName);
      return;
    }
    setBusy('rename');
    await fetch(`/api/classes/${classId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });
    setBusy(null);
    setEditing(false);
    router.refresh();
  }

  async function archive() {
    if (!confirm('Archive this class? Students will lose access to it.')) return;
    setBusy('archive');
    await fetch(`/api/classes/${classId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: true }),
    });
    router.push('/classes');
  }

  async function removeStudent(userId: string) {
    setBusy(userId);
    const res = await fetch(`/api/classes/${classId}/members/${userId}`, { method: 'DELETE' });
    setBusy(null);
    if (res.ok) {
      setMembers((m) => m.filter((x) => x.userId !== userId));
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Title + actions */}
      <div className="flex items-center justify-between gap-3">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            maxLength={80}
            className="flex-1 min-w-0 rounded-lg bg-background border border-primary/50 px-3 py-2 text-lg font-semibold
              text-light-text focus:outline-none"
          />
        ) : (
          <h1 className="display-serif text-2xl font-semibold text-light-text truncate flex items-center gap-2">
            {name}
            <button onClick={() => setEditing(true)} className="text-dark-text/50 hover:text-primary transition-colors" aria-label="Rename class">
              <Pencil size={15} />
            </button>
          </h1>
        )}
        <button
          onClick={archive}
          disabled={busy === 'archive'}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs
            text-dark-text hover:text-error hover:border-error/40 transition-colors disabled:opacity-50"
        >
          {busy === 'archive' ? <Loader2 size={13} className="animate-spin" /> : <Archive size={13} />}
          Archive
        </button>
      </div>

      {/* Join link */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-5 card-glow">
        <h2 className="mono-label text-light-text mb-3">Invite students</h2>
        <div className="flex items-center gap-2">
          <code className="flex-1 min-w-0 truncate rounded-lg bg-background border border-border px-3 py-2.5 text-xs text-dark-text font-mono">
            {joinUrl}
          </code>
          <button
            onClick={copyLink}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-primary/10 text-primary
              text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-[11px] text-dark-text/60 mt-2">
          Students open this link, sign in, and are added to the class. Code: <span className="font-mono text-dark-text">{joinCode}</span>
        </p>
      </div>

      {/* Roster */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-dark-text" />
            <h2 className="mono-label text-dark-text">
              {members.length} student{members.length === 1 ? '' : 's'}
              {maxStudents != null && ` / ${maxStudents}`}
            </h2>
          </div>
          {members.length > 0 && (
            <div className="flex items-center gap-1">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => changeSort(s.id)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono transition-colors ${
                    sort === s.id
                      ? 'bg-primary/15 text-primary'
                      : 'text-dark-text/60 hover:text-light-text hover:bg-surface'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {members.length === 0 ? (
          <p className="text-sm text-dark-text/70 px-1 py-6 text-center">
            No students yet — share the invite link above to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {sorted.map((m) => {
              const assignLabel = assignmentCount === 0 ? '—' : `${m.assignmentsSubmitted}/${assignmentCount}`;
              const lastLabel = formatLastActive(m.lastActiveAt);
              return (
                <div key={m.userId} className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-3 sm:px-4">
                  <StudentProgressLink
                    classId={classId}
                    studentId={m.userId}
                    source="roster"
                    className="flex-1 min-w-0 flex items-center gap-3 group"
                  >
                    <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                      {displayName(m).charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-light-text truncate group-hover:text-primary transition-colors">
                        {displayName(m)}
                      </p>
                      {m.name && m.email && <p className="text-[11px] text-dark-text/60 truncate">{m.email}</p>}
                      <p className="sm:hidden text-[10px] font-mono text-dark-text/70 mt-0.5">
                        {m.solvedCount} solved · {assignLabel} assigned · {lastLabel}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 shrink-0 text-[11px] font-mono tabular-nums">
                      <span className="text-dark-text w-16 text-right">
                        <span className="text-light-text">{m.solvedCount}</span> solved
                      </span>
                      <span className="text-dark-text w-14 text-right" title="Assignments submitted">
                        {assignLabel}
                      </span>
                      <span className="text-dark-text/70 w-[4.5rem] text-right">{lastLabel}</span>
                    </div>
                    <ChevronRight size={14} className="shrink-0 text-dark-text/30 group-hover:text-primary transition-colors" />
                  </StudentProgressLink>
                  <button
                    onClick={() => removeStudent(m.userId)}
                    disabled={busy === m.userId}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-dark-text
                      hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                    aria-label="Remove student"
                  >
                    {busy === m.userId ? <Loader2 size={12} className="animate-spin" /> : <UserMinus size={12} />}
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
