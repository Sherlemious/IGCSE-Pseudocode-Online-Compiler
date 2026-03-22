'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Zap, ChevronDown, Minus, Plus, Lock } from 'lucide-react';

const SETTINGS_KEY = 'exam_last_settings';

interface Props {
  topics: string[];
  hasFullAccess: boolean;
  premiumGatingEnabled: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: '',       label: 'Any',    color: 'text-light-text',  activeBg: 'bg-primary/10 border-primary/40 text-primary' },
  { value: 'EASY',   label: 'Easy',   color: 'text-success',     activeBg: 'bg-success/10 border-success/40 text-success' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-warning',     activeBg: 'bg-warning/10 border-warning/40 text-warning' },
  { value: 'HARD',   label: 'Hard',   color: 'text-error',       activeBg: 'bg-error/10  border-error/40  text-error'  },
];

const QUESTION_PRESETS = [3, 5, 10, 15, 20];
const TIME_PRESETS     = [15, 30, 45, 60, 90, 120];

export default function ExamConfigForm({ topics, hasFullAccess, premiumGatingEnabled }: Props) {
  const router = useRouter();
  const [topic,         setTopic]         = useState('');
  const [difficulty,    setDifficulty]    = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimitMin,  setTimeLimitMin]  = useState(60);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  // Restore last-used settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (!saved) return;
      const s = JSON.parse(saved);
      if (s.topic      !== undefined && topics.includes(s.topic)) setTopic(s.topic);
      if (s.difficulty !== undefined) setDifficulty(s.difficulty);
      if (s.questionCount !== undefined) setQuestionCount(s.questionCount);
      if (s.timeLimitMin  !== undefined) setTimeLimitMin(s.timeLimitMin);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStart() {
    setLoading(true);
    setError('');
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ topic, difficulty, questionCount, timeLimitMin })); } catch { /* ignore */ }

    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic:         topic      || undefined,
          difficulty:    difficulty || undefined,
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

  const adjustCount = (delta: number) =>
    setQuestionCount((v) => Math.min(20, Math.max(1, v + delta)));

  return (
    <div className="space-y-6">
      {/* Banners */}
      {!premiumGatingEnabled && (
        <div className="text-xs text-primary bg-primary/8 border border-primary/20 rounded-lg px-3.5 py-2.5 animate-scale-in">
          Premium is coming soon — all exam difficulties are currently available.
        </div>
      )}
      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 animate-scale-in">
          {error}
        </div>
      )}

      {/* ── Topic ─────────────────────────────────────────── */}
      <div>
        <label className="mono-label text-dark-text mb-2 block">Topic</label>
        <div className="relative">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg bg-background border border-border
              text-sm text-light-text focus:outline-none focus:border-primary/50 transition-colors duration-200"
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dark-text/50"
          />
        </div>
      </div>

      {/* ── Difficulty ────────────────────────────────────── */}
      <div>
        <label className="mono-label text-dark-text mb-2 block">Difficulty</label>
        <div className="grid grid-cols-4 gap-2">
          {DIFFICULTY_OPTIONS.map(({ value, label, activeBg }) => {
            const locked = value !== '' && value !== 'EASY' && !hasFullAccess;
            const isActive = difficulty === value;
            return (
              <button
                key={value}
                onClick={() => !locked && setDifficulty(value)}
                disabled={locked}
                className={`relative flex items-center justify-center gap-1 py-2 rounded-lg border text-xs font-medium
                  transition-all duration-150
                  ${isActive
                    ? activeBg
                    : 'border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                  }
                  ${locked ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {locked && <Lock size={9} className="shrink-0" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Questions ─────────────────────────────────────── */}
      <div>
        <label className="mono-label text-dark-text mb-2 block">Questions</label>
        <div className="flex items-center gap-3 mb-2.5">
          <button
            onClick={() => adjustCount(-1)}
            disabled={questionCount <= 1}
            className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center
              hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>
          <span className="flex-1 text-center text-2xl font-bold font-mono text-light-text tabular-nums">
            {questionCount}
          </span>
          <button
            onClick={() => adjustCount(1)}
            disabled={questionCount >= 20}
            className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center
              hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex gap-1.5">
          {QUESTION_PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`flex-1 py-1 rounded-md border text-[11px] font-mono transition-colors duration-150
                ${questionCount === n
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ── Time Limit ────────────────────────────────────── */}
      <div>
        <label className="mono-label text-dark-text mb-2 block">Time Limit</label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_PRESETS.map((t) => (
            <button
              key={t}
              onClick={() => setTimeLimitMin(t)}
              className={`py-2 rounded-lg border text-xs font-mono font-medium transition-colors duration-150
                ${timeLimitMin === t
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                }`}
            >
              {t >= 60 ? `${Math.floor(t / 60)}h${t % 60 ? ` ${t % 60}m` : ''}` : `${t}m`}
            </button>
          ))}
        </div>
        {!TIME_PRESETS.includes(timeLimitMin) && (
          <p className="text-[10px] text-primary/60 font-mono mt-1.5 text-center">
            Custom: {timeLimitMin} min
          </p>
        )}
      </div>

      {/* ── Begin Exam ────────────────────────────────────── */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
          bg-primary text-on-primary text-sm font-semibold
          hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50
          shadow-[0_0_20px_-4px_rgba(var(--color-primary-rgb),0.4)]"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
        {loading ? 'Starting…' : 'Begin Exam'}
      </button>
    </div>
  );
}
