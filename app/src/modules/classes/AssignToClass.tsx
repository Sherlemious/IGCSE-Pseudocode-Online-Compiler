'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Loader2, School } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import Combobox from '@/shared/ui/Combobox';
import DatePicker from '@/shared/ui/DatePicker';
import Modal from '@/shared/ui/Modal';
import AssignmentShareActions from './AssignmentShareActions';
import { useOwnedClasses, type OwnedClassOption } from './useOwnedClasses';

export type AssignSurface = 'practice_question' | 'practice_list' | 'class_quick_start';

export interface AssignResult {
  assignmentId: string;
  examId: string;
  classId: string;
  joinCode: string;
  title: string;
  questionCount: number;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AssignToClassButton({
  questionIds,
  surface,
  classes,
  fixedClass,
  label = 'Assign to class',
  disabled = false,
  variant = 'primary',
  onAssigned,
  onOpenChange,
}: {
  questionIds: string[];
  surface: AssignSurface;
  /** Pass when the caller already loaded classes, so this button does not fetch again. */
  classes?: OwnedClassOption[];
  /** The class page already knows which class. Skips the picker. */
  fixedClass?: OwnedClassOption;
  label?: string;
  disabled?: boolean;
  variant?: 'primary' | 'quiet';
  /** Fired as soon as the assignment exists, before the dialog is dismissed. */
  onAssigned?: (result: AssignResult, dueDate: string) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const owned = useOwnedClasses(classes === undefined && !fixedClass);
  const options = useMemo(
    () => (fixedClass ? [fixedClass] : (classes ?? owned.classes)),
    [classes, fixedClass, owned.classes],
  );
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState(fixedClass?.id ?? '');
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AssignResult | null>(null);

  useEffect(() => {
    if (fixedClass) {
      setClassId(fixedClass.id);
      return;
    }
    if (!classId && options.length === 1) setClassId(options[0].id);
  }, [classId, fixedClass, options]);

  if (!fixedClass && options.length === 0) return null;

  const chosen = options.find((cls) => cls.id === classId) ?? null;
  const trigger = variant === 'quiet'
    ? 'mb-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-light-text hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50'
    : 'inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-on-primary hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50';

  function setDialog(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
  }

  function close() {
    setDialog(false);
    setError('');
    setResult(null);
    setDue('');
    setTitle('');
  }

  function openPicker() {
    setDialog(true);
  }

  async function assign() {
    if (!classId || busy || questionIds.length === 0) return;
    setBusy(true);
    setError('');
    const res = await fetch(`/api/classes/${classId}/assign-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionIds, dueDate: due || undefined, title: title.trim() || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(typeof data.error === 'string' ? data.error : 'Could not assign those questions.');
      return;
    }
    const assigned = data as AssignResult;
    captureEvent('assignment_quick_created', {
      class_id: classId,
      question_count: assigned.questionCount,
      surface,
    });
    onAssigned?.(assigned, due);
    setResult(assigned);
    if (fixedClass) router.refresh();
  }

  return (
    <>
      <button type="button" className={trigger} disabled={disabled || questionIds.length === 0 || busy} onClick={openPicker}>
        {busy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <School size={14} aria-hidden="true" />}
        {label}
      </button>
      <Modal
        open={open}
        onClose={close}
        title={result ? 'Assigned' : 'Assign to class'}
        icon={result ? <Check size={14} className="text-success" /> : <School size={14} className="text-primary" />}
        widthClass="max-w-md"
      >
        {result ? (
          <div className="space-y-3">
            <p className="text-sm text-light-text">
              <span className="font-medium">{result.title}</span>
              {' '}is on {chosen?.name ?? 'the class'}.
            </p>
            {fixedClass ? (
              <p className="text-xs text-dark-text">It&apos;s in Assigned work on this page.</p>
            ) : (
              <Link href={`/classes/${result.classId}`} className="inline-flex text-sm font-semibold text-primary hover:underline">
                Open class
              </Link>
            )}
            <AssignmentShareActions classId={result.classId} assignmentId={result.assignmentId} joinCode={result.joinCode} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-dark-text">
              {questionIds.length === 1 ? '1 question' : `${questionIds.length} questions`}
              {' '}will be assigned as a short piece of work. Students open it from the class link.
            </p>
            {error && (
              <div className="rounded-lg border border-error/15 bg-error/8 px-3.5 py-2.5 text-xs text-error">
                {error}
              </div>
            )}
            {fixedClass ? (
              <p className="text-sm font-medium text-light-text">{fixedClass.name}</p>
            ) : (
              <Combobox
                options={options.map((cls) => ({ value: cls.id, label: cls.name }))}
                value={classId}
                onChange={setClassId}
                placeholder="Choose a class…"
                searchPlaceholder="Search your classes…"
                emptyText="No classes match."
                ariaLabel="Choose a class"
              />
            )}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Name (optional)"
              aria-label="Assignment name"
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-light-text placeholder:text-dark-text/50 focus:outline-none focus:border-primary/50"
            />
            <DatePicker value={due || null} onChange={(value) => setDue(value ?? '')} min={todayISO()} ariaLabel="Optional due date" />
            <button
              type="button"
              onClick={() => void assign()}
              disabled={!classId || busy}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-50"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <School size={15} />}
              Assign
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
