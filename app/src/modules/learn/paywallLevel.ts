import type { LearnLevel } from './types';
import { levelStartHref } from './path';

/**
 * The paid level a student was blocked on, so the post-checkout page can send
 * them straight back to it. Per-browser only: the same level is also set as a
 * PostHog person property (`paywallPersonProps`) for the cross-device email.
 */
const KEY = 'learn_paywall_level';

export function rememberPaywallLevel(level: LearnLevel): void {
  try {
    localStorage.setItem(KEY, level.slug);
  } catch {
    /* unavailable */
  }
}

export function readPaywallLevel(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function paywallPersonProps(level: LearnLevel): Record<string, unknown> {
  return {
    learn_paywall_level: level.number,
    learn_paywall_level_name: level.name,
    learn_paywall_topics: level.leaveWith,
    learn_paywall_path: levelStartHref(level),
  };
}
