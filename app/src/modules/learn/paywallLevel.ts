import type { LearnLevel } from './types';
import { COURSE_ID } from './types';
import { levelStartHref } from './path';

/**
 * The paid level a student was blocked on, so the post-checkout page can send
 * them straight back to it. Per-browser only: the same level is also set as a
 * PostHog person property (`paywallPersonProps`) for the cross-device email.
 */
const KEY = 'learn_paywall_level_v3';
/** Written under earlier level numberings; mapped to today's slugs on read. */
const OLDER_KEYS: readonly [string, Readonly<Record<string, string>>][] = [
  // 16 Nov 2026, a few hours: drills 4-6, syllabus 7-13.
  ['learn_paywall_level_v2', { '4': 'd1', '5': 'd2', '6': 'd3', '7': '4', '8': '5', '9': '6', '10': '7', '11': '8', '12': '9', '13': '10' }],
  // Before that: drills 11-13, syllabus as today.
  ['learn_paywall_level', { '11': 'd1', '12': 'd2', '13': 'd3' }],
];

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
    if (!raw) {
      for (const [key, map] of OLDER_KEYS) {
        const older = localStorage.getItem(key);
        if (!older) continue;
        const split = older.indexOf(':');
        if (split !== -1) return { courseId: older.slice(0, split), slug: older.slice(split + 1) };
        return { courseId: COURSE_ID, slug: map[older] ?? older };
      }
      return null;
    }
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
