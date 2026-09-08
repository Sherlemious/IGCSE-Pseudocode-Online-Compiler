import { captureEvent } from '@/modules/interpreter/analytics';

export interface AssignmentContext {
  assignmentId: string;
  classId: string;
}

export type AssignmentSource = 'google_classroom' | 'direct';
const sources = new Map<string, AssignmentSource>();

/** Attribution only: never used for identity, enrollment, or paid access. */
export function rememberAssignmentSource(assignmentId: string, source: AssignmentSource): void {
  sources.set(assignmentId, source);
  try { sessionStorage.setItem(`assignment_source:${assignmentId}`, source); } catch { /* storage is optional */ }
}

export function assignmentSource(assignmentId: string): AssignmentSource {
  try {
    const stored = sessionStorage.getItem(`assignment_source:${assignmentId}`);
    if (stored === 'google_classroom' || stored === 'direct') return stored;
  } catch { /* storage is optional */ }
  return sources.get(assignmentId) ?? 'direct';
}

export function assignmentProperties(context: AssignmentContext) {
  return { assignment_id: context.assignmentId, class_id: context.classId, source: assignmentSource(context.assignmentId) };
}

export function captureAssignmentStart(context: AssignmentContext, attemptId: string, resumed: boolean): void {
  if (resumed) return;
  const properties = { ...assignmentProperties(context), exam_id: attemptId };
  captureEvent('assignment_started', properties);
  captureEvent('exam_started', properties);
}
