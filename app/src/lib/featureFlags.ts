const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

function isEnabled(value: string | undefined): boolean {
  if (!value) return false;
  return TRUE_VALUES.has(value.trim().toLowerCase());
}

// Premium gating is OFF by default. Set NEXT_PUBLIC_PREMIUM_GATING_ENABLED=true to enforce plan restrictions.
export const PREMIUM_GATING_ENABLED = isEnabled(process.env.NEXT_PUBLIC_PREMIUM_GATING_ENABLED);
