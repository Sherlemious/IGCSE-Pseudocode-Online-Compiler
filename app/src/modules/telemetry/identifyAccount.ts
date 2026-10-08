'use client';

import posthog from 'posthog-js';

/** The session fields PostHog needs in order to email this person. */
export type AccountPerson = {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  plan?: string | null;
  role?: string | null;
};

/**
 * Link the signed-in account to the PostHog person, including email.
 * Call this before a workflow trigger (`learn_gate_blocked`, and so on):
 * those workflows only send when `person.properties.email` is already set,
 * and a capture that races ahead of identify never qualifies.
 */
export function identifyAccount(user: AccountPerson | null | undefined): void {
  if (!user?.id || typeof window === 'undefined') return;
  const properties: Record<string, string> = {};
  if (user.email) properties.email = user.email;
  if (user.name) properties.name = user.name;
  if (user.plan) properties.plan = user.plan;
  if (user.role) properties.role = user.role;
  try {
    posthog.identify(user.id, properties);
  } catch {
    /* analytics must not break the page */
  }
}
