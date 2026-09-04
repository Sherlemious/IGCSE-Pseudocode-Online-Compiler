import { Resend } from 'resend';

// Sends from the monitored support inbox so replies land somewhere real.
// NOTE: for mail to actually deliver, sherlemious.com must be a verified sending
// domain in Resend (Resend isn't wired up yet — getResend() returns null without
// RESEND_API_KEY — so this is inert until that's set up).
export const FROM_ADDRESS = 'IGCSE Pseudocode Compiler <sherlemious@sherlemious.com>';
export const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

// Lazy singleton — avoids build-time throw when RESEND_API_KEY is not set
let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
