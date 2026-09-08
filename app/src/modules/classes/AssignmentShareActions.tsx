'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, GraduationCap } from 'lucide-react';
import { SITE_URL } from '@/shared/lib/seo';
import { captureEvent } from '@/modules/interpreter/analytics';
import { assignmentStudentPath, classroomShareUrl } from './assignmentLinks';

export default function AssignmentShareActions({ classId, assignmentId, joinCode, disabled = false }: {
  classId: string;
  assignmentId: string;
  joinCode: string;
  disabled?: boolean;
}) {
  const [origin, setOrigin] = useState(SITE_URL);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setOrigin(window.location.origin); }, []);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  const studentUrl = origin + assignmentStudentPath(joinCode, assignmentId);
  const shareUrl = classroomShareUrl(origin + assignmentStudentPath(joinCode, assignmentId, true));
  const style = 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-light-text hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary';
  async function copy() {
    try {
      await navigator.clipboard.writeText(studentUrl);
      setError('');
      setCopied(true);
      captureEvent('assignment_link_copied', { assignment_id: assignmentId, class_id: classId });
    } catch { setError('Could not copy the link. Please try again.'); }
  }
  return (
    <div className="space-y-1.5" data-ph-capture-attribute-feature="assignment-sharing">
      <div className="flex flex-wrap gap-2">
        {disabled ? (
          <button type="button" disabled className={`${style} opacity-50`}>
            <GraduationCap size={14} aria-hidden="true" />Share to Classroom
          </button>
        ) : (
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className={`${style} ph-no-capture`}
            onClick={() => captureEvent('share_clicked', { method: 'google_classroom', context: 'assignment', assignment_id: assignmentId, class_id: classId })}>
            <GraduationCap size={14} aria-hidden="true" />Share to Classroom<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <button type="button" disabled={disabled} onClick={copy} className={`${style} disabled:opacity-50`}>
          {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy student link'}
        </button>
      </div>
      {disabled && <p className="text-[11px] text-dark-text">Publish an exam with questions to share this assignment.</p>}
      <p role="status" className="sr-only">{copied ? 'Student link copied.' : ''}</p>
      {error && <p role="alert" className="text-xs text-error">{error}</p>}
    </div>
  );
}
