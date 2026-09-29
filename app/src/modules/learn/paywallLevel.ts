import type { LearnLevel } from './types';
import { COURSE_ID } from './types';
import { levelStartHref } from './path';

/**
 * The paid level a student was blocked on, so the post-checkout page can send
 * them straight back to it. Per-browser only: the same level is also set as a
 * PostHog person property (`paywallPersonProps`) for the cross-device email.
 */
const KEY = 'learn_paywall_level';

export type StoredPaywallLevel = { courseId: string; slug: string };

export function rememberPaywallLevel(level: LearnLevel, courseId: string = COURSE_ID): void {
  try {
    const value = courseId === COURSE_ID ? level.slug : `${courseId}:${level.slug}`;
    localStorage.setItem(KEY, value);
  } catch {
    /* unavailable */
  }
}

export function readPaywallLevel(): StoredPaywallLevel | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const split = raw.indexOf(':');
    if (split === -1) return { courseId: COURSE_ID, slug: raw };
    return { courseId: raw.slice(0, split), slug: raw.slice(split + 1) };
  } catch {
    return null;
  }
}

export function paywallPersonProps(level: LearnLevel, basePath = '/learn'): Record<string, unknown> {
  return {
    learn_paywall_level: level.number,
    learn_paywall_level_name: level.name,
    learn_paywall_topics: level.leaveWith,
    learn_paywall_path: levelStartHref(level, basePath),
  };
}
