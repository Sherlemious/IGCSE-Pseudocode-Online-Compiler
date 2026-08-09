'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, Loader2, Pencil } from 'lucide-react';
import Link from 'next/link';

interface Props {
  examId: string;
}

export default function ExamManageActions({ examId }: Props) {
  const router = useRouter();
  const [cloning, setCloning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  async function handleClone() {
    setCloning(true);
    setError('');
    try {
      const res = await fetch(`/api/exams/${examId}/clone`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to clone.');
        setCloning(false);
        return;
      }
      const { examId: newId } = await res.json();
      router.push(`/exams/${newId}`);
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setCloning(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/exams/${examId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to delete.');
        setDeleting(false);
        return;
      }
      router.push('/exams');
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setDeleting(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5 mb-3">
          {error}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/exams/${examId}/edit`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-xs
            text-light-text hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Pencil size={13} />
          Edit
        </Link>

        <button
          type="button"
          onClick={handleClone}
          disabled={cloning}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-xs
            text-light-text hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50"
        >
          {cloning ? <Loader2 size={13} className="animate-spin" /> : <Copy size={13} />}
          Duplicate
        </button>

        <div className="ml-auto">
          {confirming ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-text">Delete this exam?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-error/90 text-white text-xs
                  font-medium hover:bg-error transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="px-3 py-2 rounded-lg border border-border text-xs text-dark-text hover:text-light-text transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-xs
                text-dark-text hover:border-error/40 hover:text-error transition-colors"
            >
              <Trash2 size={13} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
