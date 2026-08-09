'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Link2, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Props {
  examId: string;
  code: string;
  isPublished: boolean;
}

export default function ExamShareCard({ examId, code, isPublished: initialPublished }: Props) {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [published, setPublished] = useState(initialPublished);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  const shareUrl = origin ? `${origin}/e/${code}` : `/e/${code}`;

  async function copy(value: string, which: 'link' | 'code') {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1800);
    } catch { /* clipboard unavailable */ }
  }

  async function togglePublished() {
    setToggling(true);
    const next = !published;
    try {
      const res = await fetch(`/api/exams/${examId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: next }),
      });
      if (res.ok) {
        setPublished(next);
        router.refresh();
      }
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Link2 size={14} className="text-primary" />
        <h2 className="mono-label text-light-text">Share with students</h2>
      </div>

      {/* Share link */}
      <label className="mono-label text-dark-text mb-1.5 block">Link</label>
      <div className="flex items-center gap-2 mb-4">
        <input
          readOnly
          value={shareUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono
            text-light-text focus:outline-none focus:border-primary/50 truncate"
        />
        <button
          type="button"
          onClick={() => copy(shareUrl, 'link')}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs
            text-dark-text hover:text-primary hover:border-primary/40 transition-colors"
        >
          {copied === 'link' ? <Check size={13} className="text-success" /> : <Copy size={13} />}
          {copied === 'link' ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Join code */}
      <label className="mono-label text-dark-text mb-1.5 block">Join code</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => copy(code, 'code')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-background border border-border
            font-mono text-base font-bold tracking-[0.2em] text-light-text hover:border-primary/40 transition-colors"
        >
          {code}
          {copied === 'code' ? <Check size={13} className="text-success" /> : <Copy size={13} className="text-dark-text" />}
        </button>
        <span className="text-[11px] text-dark-text">Students can enter this at the exam page.</span>
      </div>

      {/* Publish toggle */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/60">
        <div className="text-xs">
          <span className={published ? 'text-success' : 'text-dark-text'}>
            {published ? 'Live — anyone with the link can take it' : 'Disabled — the link is closed'}
          </span>
        </div>
        <button
          type="button"
          onClick={togglePublished}
          disabled={toggling}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs
            text-dark-text hover:text-light-text hover:border-primary/40 transition-colors disabled:opacity-50"
        >
          {toggling ? <Loader2 size={12} className="animate-spin" /> : published ? <EyeOff size={12} /> : <Eye size={12} />}
          {published ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
