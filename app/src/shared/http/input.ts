import { badRequest } from './errors';

export type JsonObject = Record<string, unknown>;

/** The request body as a JSON object; a 400 for anything else. */
export async function readJson(req: Request, message = 'Invalid request.'): Promise<JsonObject> {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw badRequest(message);
  return body as JsonObject;
}

/** Like `readJson`, but an empty or malformed body reads as `{}` (field checks report the problem). */
export async function readJsonOrEmpty(req: Request): Promise<JsonObject> {
  const body: unknown = await req.json().catch(() => null);
  return body && typeof body === 'object' && !Array.isArray(body) ? (body as JsonObject) : {};
}

/** A trimmed string capped at `max` characters, or null when missing or blank. */
export function optionalText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

/** A trimmed, non-blank string capped at `max`, or a 400 with `message`. */
export function requiredText(value: unknown, max: number, message: string): string {
  const text = optionalText(value, max);
  if (!text) throw badRequest(message);
  return text;
}

/** `value` when it is one of `allowed`, otherwise null. */
export function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/** A finite number clamped to [min, max], or `fallback` when not a number. */
export function clampedNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  return Math.min(Math.max(Number.isFinite(n) && n !== 0 ? n : fallback, min), max);
}

/** The string members of an array, deduped in order; [] for non-arrays. */
export function stringList(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === 'string'))] : [];
}

/** A parseable date string, or null. */
export function optionalDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
