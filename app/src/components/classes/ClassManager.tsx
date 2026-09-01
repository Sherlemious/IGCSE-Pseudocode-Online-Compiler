'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Pencil, Archive, UserMinus, Loader2, Users } from 'lucide-react';

interface Member {
  userId: string;
  name: string | null;
  email: string | null;
  joinedAt: string;
}

interface Props {
  classId: string;
  initialName: string;
  joinUrl: string;
  joinCode: string;
  maxStudents: number | null; // null = unlimited
  members: Member[];
}

export default function ClassManager({ classId, initialName, joinUrl, joinCode, maxStudents, members: initialMembers }: Props) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

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
        <div className="flex items-center gap-2 mb-3 px-1">
          <Users size={14} className="text-dark-text" />
          <h2 className="mono-label text-dark-text">
            {members.length} student{members.length === 1 ? '' : 's'}
            {maxStudents != null && ` / ${maxStudents}`}
          </h2>
        </div>

        {members.length === 0 ? (
          <p className="text-sm text-dark-text/70 px-1 py-6 text-center">
            No students yet — share the invite link above to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.userId} className="flex items-center justify-between gap-3 bg-surface border border-border rounded-lg px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                    {(m.name || m.email || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-light-text truncate">{m.name || m.email || 'Student'}</p>
                    {m.name && m.email && <p className="text-[11px] text-dark-text/60 truncate">{m.email}</p>}
                  </div>
                </div>
                <button
                  onClick={() => removeStudent(m.userId)}
                  disabled={busy === m.userId}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-dark-text
                    hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                  aria-label="Remove student"
                >
                  {busy === m.userId ? <Loader2 size={12} className="animate-spin" /> : <UserMinus size={12} />}
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
