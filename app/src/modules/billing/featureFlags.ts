const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

function isEnabled(value: string | undefined): boolean {
  if (!value) return false;
  return TRUE_VALUES.has(value.trim().toLowerCase());
}

// Premium gating is OFF by default. Set PREMIUM_GATING_ENABLED=true to enforce plan
// restrictions on premium-flagged questions. This is a *server-only* env var — every
// gating check runs in a server component or API route, so it never needs to reach
// the client bundle (keep it out of NEXT_PUBLIC_* so the toggle stays server-side).
export const PREMIUM_GATING_ENABLED = isEnabled(process.env.PREMIUM_GATING_ENABLED);

// "Mark it like an examiner" (practice/examMarking) is OFF unless
// EXAM_MARKING_ENABLED=true and ANTHROPIC_API_KEY is set (a Cloudflare Worker
// secret in production). Server-only, like the gate above.
export const EXAM_MARKING_ENABLED = isEnabled(process.env.EXAM_MARKING_ENABLED) && Boolean(process.env.ANTHROPIC_API_KEY);
