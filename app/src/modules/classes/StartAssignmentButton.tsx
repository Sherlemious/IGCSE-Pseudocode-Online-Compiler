'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { captureAssignmentStart } from './assignmentTelemetry';

interface Props {
  assignmentId: string;
  classId: string;
  attemptId?: string;
  status: 'none' | 'in_progress' | 'completed';
  score?: number | null;
  totalTests?: number | null;
}

export default function StartAssignmentButton({ assignmentId, classId, attemptId, status, score, totalTests }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'completed') {
    if (attemptId) {
      return <Link href={`/exam/${attemptId}/results`} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 px-3.5 py-2 text-xs text-primary hover:bg-primary/10"><CheckCircle2 size={14} />View results</Link>;
    }
    return (
      <span className="shrink-0 inline-flex items-center gap-1.5 text-xs text-primary font-medium">
        <CheckCircle2 size={14} />
        Submitted
        {typeof score === 'number' && typeof totalTests === 'number' && totalTests > 0 && (
          <span className="text-dark-text/70 font-mono">{score}/{totalTests}</span>
        )}
      </span>
    );
  }

  async function start() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/start`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not start.');
        setLoading(false);
        return;
      }
      captureAssignmentStart({ assignmentId, classId }, data.attemptId, data.resumed !== false);
      router.push(`/exam/${data.attemptId}`);
    } catch {
      setError('Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <span className="shrink-0 flex flex-col items-end gap-1">
      <button
        onClick={start}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : status === 'in_progress' ? <RotateCcw size={13} /> : <Play size={13} />}
        {status === 'in_progress' ? 'Resume' : 'Start'}
      </button>
      {error && <span className="text-[10px] text-error">{error}</span>}
    </span>
  );
}
