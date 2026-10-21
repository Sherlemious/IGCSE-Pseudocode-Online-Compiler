'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Play, Plus, Save, Trash2 } from 'lucide-react';
import { CodeMirrorEditor } from '@/modules/compiler/editor';
import { inputLines } from './validate';
import QuestionMarkdown from './QuestionMarkdown';
import UpgradeCard from './UpgradeCard';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

export interface EditorTest {
  key: string;
  inputs: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface EditorQuestion {
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  starterCode: string;
  solution: string;
  testCases: EditorTest[];
}

interface Failure {
  index: number;
  hint: string;
  actualOutput: string;
}

const fieldClass = `w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-light-text
  placeholder:text-dark-text/50 focus:outline-none focus:border-primary/50 transition-colors`;

function payload(question: EditorQuestion) {
  return {
    title: question.title,
    description: question.description,
    difficulty: question.difficulty,
    topic: question.topic,
    starterCode: question.starterCode,
    solution: question.solution,
    answerFormat: 'CODE' as const,
    testCases: question.testCases.map((test) => ({
      inputs: inputLines(test.inputs),
      expectedOutput: test.expectedOutput,
      isHidden: test.isHidden,
    })),
  };
}

export default function QuestionEditor({
  mode,
  questionId,
  canWrite,
  initial,
}: {
  mode: 'new' | 'edit';
  questionId?: string;
  canWrite: boolean;
  initial: EditorQuestion;
}) {
  const router = useRouter();
  const [question, setQuestion] = useState(initial);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [failures, setFailures] = useState<Failure[]>([]);
  const [passed, setPassed] = useState<number | null>(null);
  const busy = running || saving || deleting;

  function patch(partial: Partial<EditorQuestion>) {
    setPassed(null);
    setQuestion((current) => ({ ...current, ...partial }));
  }

  function patchTest(key: string, partial: Partial<EditorTest>) {
    setPassed(null);
    setQuestion((current) => ({
      ...current,
      testCases: current.testCases.map((test) => (test.key === key ? { ...test, ...partial } : test)),
    }));
  }

  async function post(url: string, method: string) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload(question)),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.error === 'string' ? data.error : 'Something went wrong.');
      setFailures(Array.isArray(data.failures) ? data.failures as Failure[] : []);
      setPassed(null);
      return null;
    }
    setError('');
    setFailures([]);
    return data as { id?: string; test_count?: number };
  }

  async function runSolution() {
    if (!canWrite) return;
    setRunning(true);
    try {
      const data = await post('/api/questions/mine/check', 'POST');
      if (data) setPassed(data.test_count ?? question.testCases.length);
    } catch {
      setError('Something went wrong.');
    } finally {
      setRunning(false);
    }
  }

  async function save() {
    if (!canWrite) return;
    setSaving(true);
    try {
      const url = mode === 'edit' && questionId ? `/api/questions/mine/${questionId}` : '/api/questions/mine';
      const data = await post(url, mode === 'edit' ? 'PUT' : 'POST');
      if (!data?.id) return;
      router.push('/questions/mine');
      router.refresh();
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!questionId || !canWrite) return;
    if (!window.confirm('Delete this question? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/questions/mine/${questionId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not delete this question.');
        setDeleting(false);
        return;
      }
      router.push('/questions/mine');
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/questions/mine"
        className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-light-text transition-colors mb-6 group"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
        My questions
      </Link>

      <h1 className="display-serif text-2xl font-semibold text-light-text mb-2">
        {mode === 'edit' ? 'Edit question' : 'New question'}
      </h1>
      <p className="text-xs text-dark-text mb-6">
        Students see the description, starter and visible tests. The solution and hidden tests stay on the server.
      </p>

      {!canWrite && <UpgradeCard />}

      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-4">
          <p>{error}</p>
          {failures.length > 0 && (
            <ul className="mt-2 space-y-1">
              {failures.map((failure) => (
                <li key={failure.index}>
                  Test {failure.index + 1}: {failure.hint}
                  {failure.actualOutput ? ` Printed: ${failure.actualOutput}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {passed !== null && (
        <div className="text-xs text-success bg-success/10 border border-success/20 rounded-lg px-3.5 py-2.5 mb-4">
          Solution passed all {passed} test{passed === 1 ? '' : 's'}.
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="mono-label text-dark-text mb-2 block" htmlFor="question-title">Title</label>
          <input
            id="question-title"
            value={question.title}
            onChange={(event) => patch({ title: event.target.value })}
            maxLength={200}
            className={fieldClass}
            placeholder="e.g. Double the input"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mono-label text-dark-text mb-2 block" htmlFor="question-difficulty">Difficulty</label>
            <select
              id="question-difficulty"
              value={question.difficulty}
              onChange={(event) => patch({ difficulty: event.target.value as Difficulty })}
              className={fieldClass}
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty[0] + difficulty.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mono-label text-dark-text mb-2 block" htmlFor="question-topic">Topic</label>
            <input
              id="question-topic"
              value={question.topic}
              onChange={(event) => patch({ topic: event.target.value })}
              maxLength={80}
              className={fieldClass}
              placeholder="e.g. Arrays"
            />
          </div>
        </div>

        <div>
          <label className="mono-label text-dark-text mb-2 block" htmlFor="question-description">Description</label>
          <textarea
            id="question-description"
            value={question.description}
            onChange={(event) => patch({ description: event.target.value })}
            rows={6}
            maxLength={10_000}
            className={`${fieldClass} resize-y font-sans`}
            placeholder="Markdown, same as a practice question."
          />
          {question.description.trim() && (
            <div className="mt-3 rounded-lg border border-border bg-background px-4 py-3 max-h-64 overflow-y-auto scrollbar-pretty">
              <QuestionMarkdown markdown={question.description} />
            </div>
          )}
        </div>

        <div>
          <label className="mono-label text-dark-text mb-2 block">Starter code</label>
          <div className="h-40 rounded-lg border border-border overflow-hidden">
            <CodeMirrorEditor
              value={question.starterCode}
              onChange={(starterCode) => patch({ starterCode })}
              historyScope={questionId ? `starter-${questionId}` : 'starter-new'}
              ariaLabel="Starter code"
            />
          </div>
        </div>

        <div>
          <label className="mono-label text-dark-text mb-2 block">Solution</label>
          <div className="h-48 rounded-lg border border-border overflow-hidden">
            <CodeMirrorEditor
              value={question.solution}
              onChange={(solution) => patch({ solution })}
              historyScope={questionId ? `solution-${questionId}` : 'solution-new'}
              ariaLabel="Solution"
            />
          </div>
          <p className="text-[11px] text-dark-text mt-1.5">The solution must pass every test before the question can be saved.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="mono-label text-dark-text">Tests ({question.testCases.length})</label>
            <button
              type="button"
              disabled={question.testCases.length >= 30}
              onClick={() => patch({
                testCases: [...question.testCases, { key: `t${Date.now()}`, inputs: '', expectedOutput: '', isHidden: false }],
              })}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-40 disabled:no-underline"
            >
              <Plus size={12} /> Add test
            </button>
          </div>
          <div className="space-y-3">
            {question.testCases.map((test, index) => (
              <div key={test.key} className="rounded-lg border border-border bg-background p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-dark-text">Test {index + 1}</span>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-dark-text">
                    <input
                      type="checkbox"
                      checked={test.isHidden}
                      onChange={(event) => patchTest(test.key, { isHidden: event.target.checked })}
                    />
                    Hidden
                  </label>
                </div>
                <textarea
                  value={test.inputs}
                  onChange={(event) => patchTest(test.key, { inputs: event.target.value })}
                  rows={3}
                  aria-label={`Test ${index + 1} inputs`}
                  placeholder="Inputs, one per line (up to 50)"
                  className={`${fieldClass} font-mono text-xs resize-y`}
                />
                <textarea
                  value={test.expectedOutput}
                  onChange={(event) => patchTest(test.key, { expectedOutput: event.target.value })}
                  rows={2}
                  aria-label={`Test ${index + 1} expected output`}
                  placeholder="Expected output"
                  className={`${fieldClass} font-mono text-xs resize-y`}
                />
                {question.testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => patch({ testCases: question.testCases.filter((row) => row.key !== test.key) })}
                    className="text-[11px] text-dark-text hover:text-error"
                  >
                    Remove test
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={runSolution}
            disabled={!canWrite || busy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-light-text
              hover:border-primary/40 disabled:opacity-50"
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run solution against tests
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canWrite || busy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold
              hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save question
          </button>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-dark-text hover:text-error disabled:opacity-50 ml-auto"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
