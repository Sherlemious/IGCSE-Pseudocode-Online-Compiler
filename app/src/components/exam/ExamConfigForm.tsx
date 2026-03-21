'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Zap } from 'lucide-react';

interface Props {
  topics: string[];
  hasFullAccess: boolean;
  premiumGatingEnabled: boolean;
}

export default function ExamConfigForm({ topics, hasFullAccess, premiumGatingEnabled }: Props) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimitMin, setTimeLimitMin] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleStart() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || undefined,
          difficulty: difficulty || undefined,
          questionCount,
          timeLimitMin,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to start exam');
        setLoading(false);
        return;
      }

      const { examId } = await res.json();
      router.push(`/exam/${examId}`);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {!premiumGatingEnabled && (
        <div className="text-xs text-primary bg-primary/8 border border-primary/20 rounded-lg px-3.5 py-2.5 animate-scale-in">
          Premium is coming soon. All exam difficulties are currently available.
        </div>
      )}

      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 animate-scale-in">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mono-label text-dark-text mb-1.5 block">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-light-text text-sm
              focus:outline-none input-glow transition-all duration-200 appearance-none
              bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23828997%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mono-label text-dark-text mb-1.5 block">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-light-text text-sm
              focus:outline-none input-glow transition-all duration-200 appearance-none
              bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23828997%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
          >
            <option value="">Any</option>
            <option value="EASY">Easy</option>
            {hasFullAccess && <option value="MEDIUM">Medium</option>}
            {hasFullAccess && <option value="HARD">Hard</option>}
          </select>
        </div>

        <div>
          <label className="mono-label text-dark-text mb-1.5 block">Questions</label>
          <input
            type="number"
            min={1}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-light-text text-sm font-mono
              focus:outline-none input-glow transition-all duration-200"
          />
        </div>

        <div>
          <label className="mono-label text-dark-text mb-1.5 block">Time Limit</label>
          <div className="relative">
            <input
              type="number"
              min={10}
              max={180}
              step={5}
              value={timeLimitMin}
              onChange={(e) => setTimeLimitMin(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-light-text text-sm font-mono
                focus:outline-none input-glow transition-all duration-200 pr-12"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-dark-text/50 font-mono">
              min
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
          bg-primary text-on-primary text-sm font-semibold
          hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50
          shadow-[0_0_20px_-4px_rgba(var(--color-primary-rgb),0.4)]"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
        {loading ? 'Starting...' : 'Begin Exam'}
      </button>
    </div>
  );
}
