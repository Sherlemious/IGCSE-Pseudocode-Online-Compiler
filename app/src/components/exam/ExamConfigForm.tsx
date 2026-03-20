'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Play } from 'lucide-react';

interface Props {
  topics: string[];
  isPremium: boolean;
}

export default function ExamConfigForm({ topics, isPremium }: Props) {
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
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-dark-text mb-1">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-light-text text-sm
              focus:outline-none focus:border-primary/60 transition-colors"
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-text mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-light-text text-sm
              focus:outline-none focus:border-primary/60 transition-colors"
          >
            <option value="">Any</option>
            <option value="EASY">Easy</option>
            {isPremium && <option value="MEDIUM">Medium</option>}
            {isPremium && <option value="HARD">Hard</option>}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-text mb-1">Questions</label>
          <input
            type="number"
            min={1}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-light-text text-sm
              focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-dark-text mb-1">Time (minutes)</label>
          <input
            type="number"
            min={10}
            max={180}
            step={5}
            value={timeLimitMin}
            onChange={(e) => setTimeLimitMin(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-light-text text-sm
              focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
          bg-primary/15 text-primary text-sm font-medium
          hover:bg-primary/25 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        Start Exam
      </button>
    </div>
  );
}
