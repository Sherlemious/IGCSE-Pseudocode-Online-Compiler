import { normalizeShareCode } from '@/shared/lib/shareCode';

export function assignmentStudentPath(code: string, assignmentId: string, classroom = false): string {
  const path = `/c/${encodeURIComponent(normalizeShareCode(code))}/assignments/${encodeURIComponent(assignmentId)}`;
  return classroom ? `${path}?utm_source=google_classroom&utm_medium=assignment` : path;
}

/** Uses the documented URL-only composer; a click does not confirm a Classroom post. */
export function classroomShareUrl(studentUrl: string): string {
  return `https://classroom.google.com/share?${new URLSearchParams({ url: studentUrl })}`;
}
