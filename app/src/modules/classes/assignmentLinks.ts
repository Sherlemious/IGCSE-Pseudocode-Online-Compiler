import { normalizeShareCode } from '@/shared/lib/shareCode';

export type AssignmentLinkSource = 'google_classroom' | 'microsoft_teams';

export function assignmentStudentPath(
  code: string,
  assignmentId: string,
  source: boolean | AssignmentLinkSource = false,
): string {
  const path = `/c/${encodeURIComponent(normalizeShareCode(code))}/assignments/${encodeURIComponent(assignmentId)}`;
  const utm =
    source === true || source === 'google_classroom'
      ? 'google_classroom'
      : source === 'microsoft_teams'
        ? 'microsoft_teams'
        : null;
  return utm ? `${path}?utm_source=${utm}&utm_medium=assignment` : path;
}

/** Uses the documented URL-only composer; a click does not confirm a Classroom post. */
export function classroomShareUrl(studentUrl: string): string {
  return `https://classroom.google.com/share?${new URLSearchParams({ url: studentUrl })}`;
}

/** Teams unfurls `href` with the same OG card as WhatsApp and Classroom. */
export function teamsShareUrl(pageUrl: string): string {
  return `https://teams.microsoft.com/share?${new URLSearchParams({ href: pageUrl, preview: 'true' })}`;
}
