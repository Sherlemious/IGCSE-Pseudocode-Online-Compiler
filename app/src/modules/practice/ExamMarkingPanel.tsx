'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, GraduationCap, XCircle } from 'lucide-react';
import { useFeatureFlagEnabled } from 'posthog-js/react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { EXAM_MARKING_FLAG } from '@/modules/billing/featureFlags';
import { studentCheckoutHref, studentCheckoutLabel } from '@/modules/billing/paddle/passes';
import type { MarkingResult } from './examMarking/prompt';

interface MarkingResponse {
  result: MarkingResult;
  cached: boolean;
  remaining: number;
  plan: 'free' | 'paid';
}

/**
 * "Mark it like an examiner" under the test results of a 15-mark question.
 * Tests say whether the program works; this says what a Paper 2 examiner
 * would give it, point by point, and which fixes are worth the most marks.
 */
export default function ExamMarkingPanel({ questionId, code }: { questionId: string; code: string }) {
  const [state, setState] = useState<'idle' | 'marking'>('idle');
  const [data, setData] = useState<MarkingResponse | null>(null);
  // `done`: today's free marking allowance is used up (comes back at `resetsAt`).
  const [error, setError] = useState<{ message: string; kind: 'plain' | 'upgrade' | 'done' } | null>(null);
  const [showPoints, setShowPoints] = useState(false);
  // PostHog decides who sees it; the route checks the same flag again.
  const enabled = useFeatureFlagEnabled(EXAM_MARKING_FLAG);

  const mark = async () => {
    setState('marking');
    setError(null);
    captureEvent('exam_marking_clicked', { question_id: questionId });
    try {
      const res = await fetch(`/api/questions/${questionId}/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        if (body?.code === 'AI_DONE_FOR_TODAY') {
          const resets = new Date(body.resetsAt);
          const when = Number.isNaN(resets.getTime())
            ? '00:00 UTC'
            : resets.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          captureEvent('exam_marking_done_shown', { question_id: questionId });
          setError({
            message: `Examiner marking is done for today. The free allowance is used up, and it comes back at ${when} your time.`,
            kind: 'done',
          });
          return;
        }
        setError({
          message:
            res.status === 404
              ? "Examiner marking isn't available right now."
              : typeof body?.error === 'string'
                ? body.error
                : "Couldn't mark this right now.",
          kind: body?.code === 'FREE_LIMIT_REACHED' ? 'upgrade' : 'plain',
        });
        return;
      }
      setData(body as MarkingResponse);
    } catch {
      setError({ message: "Couldn't mark this right now.", kind: 'plain' });
    } finally {
      setState('idle');
    }
  };

  if (!enabled) return null;

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-primary shrink-0" />
        <span className="font-semibold text-light-text">Examiner marking</span>
        {data && (
          <span className="ml-auto text-base font-bold text-light-text">
            {data.result.total}/{data.result.outOf}
          </span>
        )}
      </div>

      {!data && error?.kind !== 'done' && (
        <>
          <p className="mt-1.5 text-dark-text">
            Passing the tests isn&apos;t the same as full marks. Get this answer marked against a 15-point scheme, with
            the fixes worth the most marks.
          </p>
          <button
            type="button"
            onClick={mark}
            disabled={state === 'marking' || !code.trim()}
            className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {state === 'marking' ? 'Marking…' : 'Mark it like an examiner'}
          </button>
        </>
      )}

      {error && (
        <div className="mt-2 text-dark-text">
          <p className={error.kind === 'plain' ? 'text-error' : 'text-light-text'}>{error.message}</p>
          {error.kind === 'done' && (
            <p className="mt-1 text-[11px]">
              Answers that were marked before still show straight away. Your test results above don&apos;t depend on it.
            </p>
          )}
          {error.kind === 'upgrade' && (
            <Link
              href={studentCheckoutHref('exam_marking')}
              onClick={() => captureEvent('exam_marking_upgrade_clicked', { question_id: questionId })}
              className="mt-1.5 inline-block font-semibold text-warning hover:underline"
            >
              {studentCheckoutLabel()}
            </Link>
          )}
        </div>
      )}

      {data && (
        <div className="mt-2 space-y-2">
          <p className="text-light-text">{data.result.summary}</p>
          {data.result.fixes.length > 0 && (
            <ol className="list-decimal space-y-1 pl-4 text-dark-text">
              {data.result.fixes.map((fix) => (
                <li key={fix}>{fix}</li>
              ))}
            </ol>
          )}
          <button type="button" onClick={() => setShowPoints((v) => !v)} className="text-primary hover:underline">
            {showPoints ? 'Hide the mark scheme' : 'See every mark point'}
          </button>
          {showPoints && (
            <ul className="space-y-1.5">
              {data.result.points.map((p) => (
                <li key={p.id} className="flex gap-1.5">
                  {p.awarded ? (
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
                  )}
                  <span>
                    <span className="text-light-text">{p.text}.</span> <span className="text-dark-text">{p.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-[10px] text-dark-text">
            {data.plan === 'free'
              ? `${data.remaining} free marking${data.remaining === 1 ? '' : 's'} left.`
              : `${data.remaining} left today.`}{' '}
            Marked by AI against our own scheme, so treat it as practice, not a grade. Change your code and press Check
            again to re-mark.
          </p>
        </div>
      )}
    </div>
  );
}
