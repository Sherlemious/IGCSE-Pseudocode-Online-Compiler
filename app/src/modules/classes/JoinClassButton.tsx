'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { safeCallback } from '@/modules/auth/callback';
import { captureEvent } from '@/modules/interpreter/analytics';
import { assignmentProperties, type AssignmentContext } from './assignmentTelemetry';

interface Props {
  joinCode: string;
  returnTo?: string;
  assignment?: AssignmentContext;
}

export default function JoinClassButton({ joinCode, returnTo, assignment }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleJoin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/classes/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode, assignmentId: assignment?.assignmentId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not join this class.');
        setLoading(false);
        return;
      }
      if (!data.alreadyMember) {
        captureEvent('class_joined', assignment ? assignmentProperties(assignment) : { class_id: data.classId, source: 'direct' });
      }
      router.push(safeCallback(returnTo, '/classes'));
      router.refresh();
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
        onClick={handleJoin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-on-primary
          text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50
          shadow-[0_0_20px_-4px_rgba(var(--color-primary-rgb),0.4)]"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
        {loading ? 'Joining…' : 'Join class'}
      </button>
    </div>
  );
}
