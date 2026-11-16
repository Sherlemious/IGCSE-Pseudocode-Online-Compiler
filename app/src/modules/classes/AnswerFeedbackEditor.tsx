'use client';

import { useState } from 'react';
import { Check, Loader2, MessageSquare } from 'lucide-react';

const MAX_CHARS = 5000;

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/** Teacher's written feedback on one assignment answer. Empty + Save clears it. */
export default function AnswerFeedbackEditor({
  classId,
  answerId,
  initialFeedback,
  initialFeedbackAt,
}: {
  classId: string;
  answerId: string;
  initialFeedback: string | null;
  initialFeedbackAt: string | null;
}) {
  const [open, setOpen] = useState(Boolean(initialFeedback));
  const [text, setText] = useState(initialFeedback ?? '');
  const [saved, setSaved] = useState(initialFeedback ?? '');
  const [savedAt, setSavedAt] = useState(initialFeedbackAt);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dirty = text.trim() !== saved.trim();
  const tooLong = text.trim().length > MAX_CHARS;

  async function save() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/classes/${classId}/answers/${answerId}/feedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not save feedback.');
        return;
      }
      const next: string = data.feedback ?? '';
      setSaved(next);
      setText(next);
      setSavedAt(data.feedbackAt ?? null);
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] text-dark-text hover:text-primary transition-colors"
      >
        <MessageSquare size={12} />
        Add feedback
      </button>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] text-dark-text">
        <MessageSquare size={12} />
        Feedback for the student
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={MAX_CHARS + 200}
        placeholder="What went well, and what to fix next time…"
        className="w-full resize-y bg-background border border-border rounded-lg p-2.5 text-xs text-light-text placeholder:text-dark-text/50 focus:outline-none focus:border-primary/60"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono text-dark-text/60" role="status">
          {error ? (
            <span className="text-error">{error}</span>
          ) : tooLong ? (
            <span className="text-error">{text.trim().length}/{MAX_CHARS} characters</span>
          ) : dirty ? (
            'Unsaved changes'
          ) : saved && savedAt ? (
            <span className="inline-flex items-center gap-1"><Check size={11} className="text-success" />Saved {formatSavedAt(savedAt)}</span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty || tooLong}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-on-primary disabled:opacity-40"
        >
          {saving && <Loader2 size={12} className="animate-spin" />}
          {text.trim() || !saved ? 'Save' : 'Clear feedback'}
        </button>
      </div>
    </div>
  );
}
