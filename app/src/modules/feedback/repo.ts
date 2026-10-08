import type { BugStatus, ContactStatus } from '@prisma/client';
import { prisma } from '@/shared/db';

/** Inbox data access: survey feedback, bug reports and contact messages, plus their admin status. */

export function createFeedback(data: {
  userId: string | null;
  email: string | null;
  rating: number;
  tier: string;
  tags: string[];
  comment: string | null;
}) {
  return prisma.feedbackSubmission.create({ data });
}

export function createBugReport(data: {
  userId: string | null;
  email: string | null;
  category: string;
  description: string;
  code: string | null;
  output: string | null;
  pageUrl: string | null;
  userAgent: string | null;
}) {
  return prisma.bugReport.create({ data });
}

export function createContactMessage(data: {
  userId: string | null;
  email: string;
  name: string | null;
  subject: string | null;
  message: string;
  pageUrl: string | null;
}) {
  return prisma.contactMessage.create({ data });
}

const RESOLVED_BUG: BugStatus[] = ['FIXED', 'WONT_FIX'];
const RESOLVED_CONTACT: ContactStatus[] = ['RESOLVED', 'ARCHIVED'];

/** Sets the status and stamps (or clears) resolvedAt to match. */
export function setBugStatus(id: string, status: BugStatus) {
  return prisma.bugReport.update({
    where: { id },
    data: { status, resolvedAt: RESOLVED_BUG.includes(status) ? new Date() : null },
    select: { id: true, status: true },
  });
}

export function setContactStatus(id: string, status: ContactStatus) {
  return prisma.contactMessage.update({
    where: { id },
    data: { status, resolvedAt: RESOLVED_CONTACT.includes(status) ? new Date() : null },
    select: { id: true, status: true },
  });
}
