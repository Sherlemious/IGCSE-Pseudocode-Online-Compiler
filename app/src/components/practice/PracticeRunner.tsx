'use client';

import React, { useState, useCallback } from 'react';
import CodeMirrorEditor from '../compiler/CodeMirrorEditor';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import type { GradeResult } from '../../lib/autograder';

interface TestCase {
  id: string;
  inputs: string[];
  expectedOutput: string;
  description: string | null;
}

interface TestResult {
  testCaseId: string;
  result: GradeResult;
}

interface Props {
  starterCode: string;
  testCases: TestCase[];
}

export default function PracticeRunner({ starterCode, testCases }: Props) {
  const [code, setCode] = useState(starterCode);
  const [isGrading, setIsGrading] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);

  const handleGrade = useCallback(async () => {
    if (!code.trim() || isGrading) return;
    setIsGrading(true);
    setResults(null);

    try {
      const resultList: TestResult[] = [];
      for (const tc of testCases) {
        const res = await fetch('/api/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            inputs: tc.inputs,
            expectedOutput: tc.expectedOutput,
          }),
        });
        const data: GradeResult = await res.json();
        resultList.push({ testCaseId: tc.id, result: data });
      }
      setResults(resultList);
    } catch (e) {
      console.error('Grading error:', e);
    } finally {
      setIsGrading(false);
    }
  }, [code, testCases, isGrading]);

  const passCount = results?.filter((r) => r.result.passed).length ?? 0;
  const totalCount = testCases.length;
  const allPassed = results !== null && passCount === totalCount;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Editor */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
          <span className="text-xs font-semibold tracking-wider text-dark-text uppercase">Editor</span>
          <button
            onClick={handleGrade}
            disabled={isGrading || !code.trim()}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded
              bg-primary/15 text-primary hover:bg-primary/25 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3 w-3" />
            {isGrading ? 'Grading…' : 'Run & Grade'}
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <CodeMirrorEditor
            value={code}
            onChange={setCode}
            isRunning={isGrading}
          />
        </div>
      </div>

      {/* Results panel */}
      {results !== null && (
        <div className="shrink-0 border-t border-border bg-surface max-h-64 overflow-y-auto">
          <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-3">
            <span className="text-xs font-semibold tracking-wider text-dark-text uppercase">Results</span>
            <span className={`text-xs font-semibold ${allPassed ? 'text-success' : 'text-error'}`}>
              {passCount}/{totalCount} passed
            </span>
          </div>
          <div className="p-3 space-y-2">
            {results.map((r, i) => {
              const tc = testCases.find((t) => t.id === r.testCaseId);
              return (
                <div
                  key={r.testCaseId}
                  className={`rounded border p-3 text-xs ${
                    r.result.passed
                      ? 'border-success/30 bg-success/5'
                      : 'border-error/30 bg-error/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {r.result.passed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-error shrink-0" />
                    )}
                    <span className="font-medium text-light-text">
                      Test {i + 1}{tc?.description ? `: ${tc.description}` : ''}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-dark-text">
                      <Clock className="h-3 w-3" />
                      {r.result.executionMs}ms
                    </span>
                  </div>

                  {!r.result.passed && r.result.error && (
                    <div className="flex gap-1 text-error mt-1">
                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                      <span>{r.result.error.message}</span>
                    </div>
                  )}

                  {!r.result.passed && !r.result.error && (
                    <div className="mt-1 space-y-1 font-mono">
                      <div>
                        <span className="text-dark-text">Got: </span>
                        <span className="text-error whitespace-pre-wrap">{r.result.actualOutput || '(empty)'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
