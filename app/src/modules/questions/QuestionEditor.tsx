'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Play, Plus, Save, Trash2 } from 'lucide-react';
import { CodeMirrorEditor } from '@/modules/compiler/editor';
import { captureEvent } from '@/modules/interpreter/analytics';
import { QUESTION_INPUTS_MAX, QUESTION_TEST_MAX } from './limits';
import CustomQuestionsUpgrade from './CustomQuestionsUpgrade';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface TestDraft {
  inputsText: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface CheckResult {
  index: number;
  passed: boolean;
  hint: string | null;
  actualOutput: string;
}

interface Props {
  mode: 'create' | 'edit';
  questionId?: string;
  canAuthor: boolean;
  initial?: {
    title: string;
    description: string;
    difficulty: Difficulty;
    topic: string;
    starterCode: string;
    solution: string;
    testCases: { inputs: string[]; expectedOutput: string; isHidden: boolean }[];
  };
}

const FIELD =
  'w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-light-text placeholder:text-dark-text/50 focus:outline-none focus:border-primary/50 transition-colors';

function blankTest(): TestDraft {
  return { inputsText: '', expectedOutput: '', isHidden: false };
}

function inputsFromLines(text: string): string[] {
  if (text === '') return [];
  const lines = text.split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

export default function QuestionEditor({ mode, questionId, canAuthor, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? 'MEDIUM');
  const [topic, setTopic] = useState(initial?.topic ?? '');
  const [starterCode, setStarterCode] = useState(initial?.starterCode ?? '');
  const [solution, setSolution] = useState(initial?.solution ?? '');
  const [tests, setTests] = useState<TestDraft[]>(
    initial?.testCases.length
      ? initial.testCases.map((test) => ({
          inputsText: test.inputs.join('\n'),
          expectedOutput: test.expectedOutput,
          isHidden: test.isHidden,
        }))
      : [blankTest()],
  );
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'check' | 'save' | 'delete' | null>(null);

  function payload() {
    return {
      title,
      description,
      difficulty,
      topic,
      starterCode,
      solution,
      testCases: tests.map((test) => ({
        inputs: inputsFromLines(test.inputsText),
        expectedOutput: test.expectedOutput,
        isHidden: test.isHidden,
      })),
    };
  }

  function counts() {
    const body = payload();
    return {
      test_count: body.testCases.length,
      hidden_count: body.testCases.filter((test) => test.isHidden).length,
      difficulty: body.difficulty,
    };
  }

  async function runCheck() {
    setError('');
    setBusy('check');
    try {
      const res = await fetch('/api/questions/mine/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload()),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.code === 'SOLUTION_FAILED') {
          captureEvent('custom_question_solution_failed', { failed_count: data.failedCount ?? data.failures?.length ?? 0 });
          setResults(data.failures ?? []);
        }
        setError(data.error || 'Could not run the solution.');
        return;
      }
      setResults(data.results ?? []);
      if (typeof data.passCount === 'number' && data.passCount < data.totalCount) {
        captureEvent('custom_question_solution_failed', { failed_count: data.totalCount - data.passCount });
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    setError('');
    setBusy('save');
    try {
      const body = payload();
      const res = await fetch(mode === 'edit' && questionId ? `/api/questions/mine/${questionId}` : '/api/questions/mine', {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.code === 'SOLUTION_FAILED') {
          captureEvent('custom_question_solution_failed', { failed_count: data.failedCount ?? data.failures?.length ?? 0 });
          setResults(data.failures ?? []);
        }
        setError(data.error || 'Could not save the question.');
        setBusy(null);
        return;
      }
      const stats = counts();
      captureEvent(mode === 'edit' ? 'custom_question_updated' : 'custom_question_created', stats);
      router.push('/questions/mine');
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setBusy(null);
    }
  }

  async function remove() {
    if (!questionId || !window.confirm('Delete this question? If a student has already started an exam that includes it, delete is blocked.')) return;
    setError('');
    setBusy('delete');
    try {
      const res = await fetch(`/api/questions/mine/${questionId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not delete the question.');
        setBusy(null);
        return;
      }
      router.push('/questions/mine');
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setBusy(null);
    }
  }

  const locked = !canAuthor;

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/questions/mine"
        className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-light-text transition-colors mb-6 group"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
        My questions
      </Link>

      <h1 className="display-serif text-2xl font-semibold text-light-text mb-6">
        {mode === 'edit' ? 'Edit question' : 'New question'}
      </h1>

      {locked && (
        <div className="mb-4">
          <CustomQuestionsUpgrade surface="editor" />
        </div>
      )}

      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="mono-label text-dark-text mb-2 block" htmlFor="q-title">Title</label>
          <input id="q-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
            placeholder="e.g. Average of a list" className={FIELD} />
        </div>

        <div>
          <label className="mono-label text-dark-text mb-2 block" htmlFor="q-description">Description</label>
          <textarea id="q-description" value={description} onChange={(e) => setDescription(e.target.value)}
            rows={6} maxLength={10000}
            placeholder="What the student should write. Markdown works the same way as on a practice question."
            className={`${FIELD} resize-y`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mono-label text-dark-text mb-2 block" htmlFor="q-difficulty">Difficulty</label>
            <select id="q-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={FIELD}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <label className="mono-label text-dark-text mb-2 block" htmlFor="q-topic">Topic <span className="text-dark-text/40">(optional)</span></label>
            <input id="q-topic" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={80}
              placeholder="e.g. Arrays" className={FIELD} />
          </div>
        </div>

        <div>
          <label className="mono-label text-dark-text mb-2 block">Starter code <span className="text-dark-text/40">(optional)</span></label>
          <div className="h-48 flex rounded-lg border border-border overflow-hidden">
            <CodeMirrorEditor value={starterCode} onChange={setStarterCode} wordWrap
              ariaLabel="Starter code" historyScope={`starter-${questionId ?? 'new'}`} />
          </div>
        </div>

        <div>
          <label className="mono-label text-dark-text mb-2 block">Solution</label>
          <p className="text-[11px] text-dark-text/70 mb-2">
            Students never see this. It has to pass every test before the question can be saved.
          </p>
          <div className="h-56 flex rounded-lg border border-border overflow-hidden">
            <CodeMirrorEditor value={solution} onChange={setSolution} wordWrap
              ariaLabel="Solution" historyScope={`solution-${questionId ?? 'new'}`} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="mono-label text-dark-text">Tests ({tests.length}/{QUESTION_TEST_MAX})</label>
            <button type="button" disabled={tests.length >= QUESTION_TEST_MAX}
              onClick={() => setTests((prev) => [...prev, blankTest()])}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-40 disabled:no-underline">
              <Plus size={12} /> Add test
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-background text-dark-text">
                <tr>
                  <th className="text-left font-medium px-3 py-2 w-[34%]">Inputs (one per line)</th>
                  <th className="text-left font-medium px-3 py-2">Expected output</th>
                  <th className="text-left font-medium px-3 py-2 w-16">Hidden</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {tests.map((test, index) => (
                  <tr key={index} className="border-t border-border align-top">
                    <td className="p-2">
                      <textarea value={test.inputsText}
                        onChange={(e) => setTests((prev) => prev.map((row, i) => i === index ? { ...row, inputsText: e.target.value } : row))}
                        rows={3} placeholder="Leave empty if the program does not read input"
                        className={`${FIELD} font-mono text-xs resize-y`} />
                      {inputsFromLines(test.inputsText).length > QUESTION_INPUTS_MAX && (
                        <p className="text-error mt-1">Max {QUESTION_INPUTS_MAX} inputs.</p>
                      )}
                    </td>
                    <td className="p-2">
                      <textarea value={test.expectedOutput}
                        onChange={(e) => setTests((prev) => prev.map((row, i) => i === index ? { ...row, expectedOutput: e.target.value } : row))}
                        rows={3} className={`${FIELD} font-mono text-xs resize-y`} />
                    </td>
                    <td className="p-2 text-center">
                      <input type="checkbox" checked={test.isHidden} aria-label={`Hide test ${index + 1}`}
                        onChange={(e) => setTests((prev) => prev.map((row, i) => i === index ? { ...row, isHidden: e.target.checked } : row))}
                        className="mt-3 accent-primary" />
                    </td>
                    <td className="p-2">
                      <button type="button" aria-label={`Remove test ${index + 1}`}
                        onClick={() => setTests((prev) => prev.filter((_, i) => i !== index))}
                        className="p-1.5 rounded text-dark-text hover:text-error hover:bg-error/10">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-dark-text/60 mt-2">
            Hidden tests still grade the answer. Students see that they passed or failed, not the input or expected output.
          </p>
        </div>

        {results && (
          <ul className="space-y-1.5">
            {results.map((result) => (
              <li key={result.index} className={`rounded-lg border px-3 py-2 text-xs ${result.passed ? 'border-success/30 text-success' : 'border-error/30 text-error'}`}>
                <span className="font-medium">Test {result.index + 1}: {result.passed ? 'Passed' : 'Failed'}</span>
                {!result.passed && result.hint && <p className="mt-1 text-light-text/80">{result.hint}</p>}
                {!result.passed && (
                  <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px] text-light-text/70">{result.actualOutput || '(nothing printed)'}</pre>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={runCheck} disabled={locked || busy != null}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-border text-sm text-light-text hover:border-primary/40 disabled:opacity-50">
            {busy === 'check' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run solution against tests
          </button>
          <button type="button" onClick={save} disabled={locked || busy != null}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 disabled:opacity-50">
            {busy === 'save' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save question
          </button>
          {mode === 'edit' && (
            <button type="button" onClick={remove} disabled={busy != null}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-error/10 disabled:opacity-50">
              {busy === 'delete' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
