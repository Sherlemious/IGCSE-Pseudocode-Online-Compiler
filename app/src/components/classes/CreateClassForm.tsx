'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Lock } from 'lucide-react';

const UPGRADE_EMAIL = 'abd.moh.yousef@gmail.com';

interface Props {
  canCreate: boolean;
  maxClasses: number;
}

export default function CreateClassForm({ canCreate, maxClasses }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!canCreate) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 px-4 py-3">
        <span className="flex items-center gap-2 text-xs text-dark-text">
          <Lock size={13} />
          You&apos;ve reached your {maxClasses}-class limit on the free plan.
        </span>
        <a
          href={`mailto:${UPGRADE_EMAIL}?subject=${encodeURIComponent('Interested in Teacher Pro')}`}
          className="shrink-0 text-xs font-medium text-primary hover:underline"
        >
          Upgrade →
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not create the class.');
        setLoading(false);
        return;
      }
      router.push(`/classes/${data.id}`);
    } catch {
      setError('Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-3 animate-scale-in">
          {error}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          placeholder="Class name, e.g. Year 10 Computer Science"
          className="flex-1 min-w-0 rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm text-light-text
            placeholder:text-dark-text/50 focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary
            text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Create
        </button>
      </div>
    </form>
  );
}
