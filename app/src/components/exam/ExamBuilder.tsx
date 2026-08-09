'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2, Save, Search, ChevronDown, ArrowLeft, Check,
  ChevronUp, X, GripVertical,
} from 'lucide-react';

const TIME_PRESETS = [15, 30, 45, 60, 90, 120];

const DIFFICULTY_META: Record<string, { label: string; color: string }> = {
  EASY:   { label: 'Easy',   color: 'text-success' },
  MEDIUM: { label: 'Medium', color: 'text-warning' },
  HARD:   { label: 'Hard',   color: 'text-error' },
};

interface BankQuestion {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string | null;
  year: number | null;
  paper: string | null;
  testCaseCount: number;
}

interface Props {
  mode: 'create' | 'edit';
  examId?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialTimeLimitMin?: number;
  initialQuestionIds?: string[];
}

export default function ExamBuilder({
  mode,
  examId,
  initialTitle = '',
  initialDescription = '',
  initialTimeLimitMin = 60,
  initialQuestionIds = [],
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [timeLimitMin, setTimeLimitMin] = useState(initialTimeLimitMin);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialQuestionIds);

  const [bank, setBank] = useState<BankQuestion[]>([]);
  const [bankLoading, setBankLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/questions');
        const data = await res.json();
        if (cancelled) return;
        const mapped: BankQuestion[] = (data.questions ?? []).map(
          (q: {
            id: string; title: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD';
            topic: string | null; year: number | null; paper: string | null;
            _count?: { testCases: number };
          }) => ({
            id: q.id,
            title: q.title,
            difficulty: q.difficulty,
            topic: q.topic,
            year: q.year,
            paper: q.paper,
            testCaseCount: q._count?.testCases ?? 0,
          }),
        );
        setBank(mapped);
      } catch {
        if (!cancelled) setError('Failed to load the question bank.');
      } finally {
        if (!cancelled) setBankLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const byId = useMemo(() => new Map(bank.map((q) => [q.id, q])), [bank]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const topics = useMemo(
    () => [...new Set(bank.map((q) => q.topic).filter(Boolean) as string[])].sort(),
    [bank],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bank.filter((item) => {
      if (topicFilter && item.topic !== topicFilter) return false;
      if (difficultyFilter && item.difficulty !== difficultyFilter) return false;
      if (q && !item.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [bank, search, topicFilter, difficultyFilter]);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const move = (index: number, delta: number) =>
    setSelectedIds((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  async function handleSave() {
    setError('');
    if (!title.trim()) { setError('Please give the exam a title.'); return; }
    if (selectedIds.length === 0) { setError('Add at least one question.'); return; }

    setSaving(true);
    try {
      const url = mode === 'edit' && examId ? `/api/exams/${examId}` : '/api/exams';
      const method = mode === 'edit' ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          timeLimitMin,
          questionIds: selectedIds,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to save the exam.');
        setSaving(false);
        return;
      }
      const data = await res.json();
      const targetId = mode === 'edit' ? examId : data.examId;
      router.push(`/exams/${targetId}`);
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href={mode === 'edit' && examId ? `/exams/${examId}` : '/exams'}
        className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-light-text transition-colors mb-6 group"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
        {mode === 'edit' ? 'Back to exam' : 'Back to my exams'}
      </Link>

      <h1 className="display-serif text-2xl font-semibold text-light-text mb-6">
        {mode === 'edit' ? 'Edit exam' : 'Create a shareable exam'}
      </h1>

      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-4 animate-scale-in">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Details ─────────────────────────────────────── */}
        <div className="bg-surface rounded-xl border border-border p-6 space-y-5 h-fit">
          <div>
            <label className="mono-label text-dark-text mb-2 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Year 11 Mock — Arrays & Loops"
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-light-text
                placeholder:text-dark-text/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="mono-label text-dark-text mb-2 block">Description <span className="text-dark-text/40">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions or notes shown to students before they start."
              rows={3}
              maxLength={500}
              className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-light-text
                placeholder:text-dark-text/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="mono-label text-dark-text mb-2 block">Time Limit</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeLimitMin(t)}
                  className={`py-2 rounded-lg border text-xs font-mono font-medium transition-colors duration-150
                    ${timeLimitMin === t
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border text-dark-text hover:border-primary/30 hover:text-light-text'}`}
                >
                  {t >= 60 ? `${Math.floor(t / 60)}h${t % 60 ? ` ${t % 60}m` : ''}` : `${t}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Selected questions, ordered */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="mono-label text-dark-text">Selected ({selectedIds.length})</label>
            </div>
            {selectedIds.length === 0 ? (
              <p className="text-xs text-dark-text/60 py-4 text-center border border-dashed border-border rounded-lg">
                Pick questions from the bank to build your exam.
              </p>
            ) : (
              <ol className="space-y-1.5">
                {selectedIds.map((id, i) => {
                  const q = byId.get(id);
                  return (
                    <li
                      key={id}
                      className="flex items-center gap-2 bg-background border border-border rounded-lg pl-2 pr-1.5 py-1.5"
                    >
                      <GripVertical size={12} className="text-dark-text/30 shrink-0" />
                      <span className="text-[10px] font-mono text-dark-text w-4 shrink-0">{i + 1}</span>
                      <span className="flex-1 min-w-0 text-xs text-light-text truncate">
                        {q ? q.title : 'Unknown question'}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                          className="p-1 rounded hover:bg-surface text-dark-text hover:text-primary disabled:opacity-25 disabled:hover:bg-transparent transition-colors">
                          <ChevronUp size={13} />
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === selectedIds.length - 1}
                          className="p-1 rounded hover:bg-surface text-dark-text hover:text-primary disabled:opacity-25 disabled:hover:bg-transparent transition-colors">
                          <ChevronDown size={13} />
                        </button>
                        <button type="button" onClick={() => toggle(id)}
                          className="p-1 rounded hover:bg-error/10 text-dark-text hover:text-error transition-colors">
                          <X size={13} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-on-primary
              text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50
              shadow-[0_0_20px_-4px_rgba(var(--color-primary-rgb),0.4)]"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create exam'}
          </button>
        </div>

        {/* ── Question bank ───────────────────────────────── */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="mono-label text-light-text mb-4">Question Bank</h2>

          <div className="space-y-2.5 mb-4">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions…"
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-background border border-border text-sm text-light-text
                  placeholder:text-dark-text/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-background border border-border text-xs
                    text-light-text focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">All topics</option>
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-text/50" />
              </div>
              <div className="relative">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-background border border-border text-xs
                    text-light-text focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Any difficulty</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-text/50" />
              </div>
            </div>
          </div>

          <div className="max-h-[460px] overflow-y-auto scrollbar-pretty -mr-2 pr-2 space-y-1.5">
            {bankLoading ? (
              <div className="flex items-center justify-center py-10 text-dark-text">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-dark-text/60 py-10 text-center">No questions match.</p>
            ) : (
              filtered.map((q) => {
                const active = selectedSet.has(q.id);
                const meta = DIFFICULTY_META[q.difficulty];
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => toggle(q.id)}
                    className={`w-full flex items-center gap-3 text-left rounded-lg border px-3 py-2.5 transition-all duration-150
                      ${active
                        ? 'border-primary/40 bg-primary/8'
                        : 'border-border hover:border-primary/30 hover:bg-background'}`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors
                      ${active ? 'bg-primary border-primary text-on-primary' : 'border-border'}`}>
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-medium text-light-text truncate">{q.title}</span>
                      <span className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono ${meta?.color ?? 'text-dark-text'}`}>
                          {meta?.label ?? q.difficulty}
                        </span>
                        {q.topic && <span className="text-[10px] text-dark-text truncate">{q.topic}</span>}
                        <span className="text-[10px] text-dark-text/50 font-mono">
                          {q.testCaseCount} test{q.testCaseCount === 1 ? '' : 's'}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
