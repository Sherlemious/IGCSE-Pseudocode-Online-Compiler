'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Zap } from 'lucide-react';

interface Props {
  examId: string;
  hasInProgress: boolean;
}

export default function StartSharedExam({ examId, hasInProgress }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleStart() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/exams/${examId}/start`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not start this exam.');
        setLoading(false);
        return;
      }
      const { attemptId } = await res.json();
      router.push(`/exam/${attemptId}`);
    } catch {
      setError('Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-3 animate-scale-in">
          {error}
        </div>
      )}
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-on-primary
          text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50
          shadow-[0_0_20px_-4px_rgba(var(--color-primary-rgb),0.4)]"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
        {loading ? 'Starting…' : hasInProgress ? 'Resume exam' : 'Start exam'}
      </button>
    </div>
  );
}
