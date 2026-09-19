'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Crown, Lock } from 'lucide-react';
import { authHref } from '@/modules/auth/callback';
import PracticeWorkspace from './PracticeWorkspace';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export default function PracticeQuestionPane({
  questionId,
  starterCode,
  difficulty,
  isPremium,
  gatingEnabled,
  preloadedFileNames,
}: {
  questionId: string;
  starterCode: string;
  difficulty: Difficulty;
  isPremium: boolean;
  gatingEnabled: boolean;
  preloadedFileNames?: string[];
}) {
  const { status } = useSession();
  const [premiumAccess, setPremiumAccess] = useState(!gatingEnabled);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      setPremiumAccess(!gatingEnabled);
      setSavedCode(null);
      setReady(true);
      return;
    }
    let cancelled = false;
    void fetch(`/api/questions/${questionId}/progress`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { lastCode?: string | null; premiumAccess?: boolean; status?: string | null; attempts?: number } | null) => {
        if (cancelled) return;
        setPremiumAccess(Boolean(data?.premiumAccess) || !gatingEnabled);
        setSavedCode(typeof data?.lastCode === 'string' ? data.lastCode : null);
        window.dispatchEvent(
          new CustomEvent('practice:progress', {
            detail: {
              questionId,
              isSolved: data?.status === 'SOLVED',
              attemptCount: data?.attempts ?? 0,
            },
          }),
        );
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [gatingEnabled, questionId, status]);

  const isLocked = isPremium && gatingEnabled && !premiumAccess;

  if (!ready) {
    return <div className="flex-1 bg-background" />;
  }

  if (isLocked) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-7 w-7 text-warning" />
          </div>
          <h2 className="text-lg font-bold text-light-text mb-2">Premium Question</h2>
          <p className="text-sm text-dark-text mb-6">
            This question needs a paid plan — upgrade, or join a class from a teacher who has one. You can read the
            description and sample tests, but grading is locked.
          </p>
          {status !== 'authenticated' ? (
            <Link
              href={authHref('signin', `/practice/${questionId}`)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 text-primary
                font-medium text-sm hover:bg-primary/25 transition-colors"
            >
              Sign in to get started
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/15 text-warning
                font-medium text-sm hover:bg-warning/25 transition-colors"
            >
              <Crown size={15} />
              See plans
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <PracticeWorkspace
      questionId={questionId}
      starterCode={starterCode}
      savedCode={savedCode}
      preloadedFileNames={preloadedFileNames}
      difficulty={difficulty}
    />
  );
}
