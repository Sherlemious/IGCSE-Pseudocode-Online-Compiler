'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  currentName: string;
}

export default function ProfileNameEditor({ currentName }: Props) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    const trimmed = name.trim();
    if (trimmed === currentName.trim() || trimmed.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? 'Failed to save');
        return;
      }
      toast.success('Name updated');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs text-dark-text">Display name</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-light-text placeholder-dark-text/40 outline-none focus:border-primary/50 transition-colors"
          placeholder="Your name"
          onKeyDown={(e) => { if (e.key === 'Enter') void handleSave(); }}
        />
        <button
          onClick={() => void handleSave()}
          disabled={saving || name.trim() === currentName.trim() || name.trim().length === 0}
          className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
