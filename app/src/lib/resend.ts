import { Resend } from 'resend';

export const FROM_ADDRESS = 'IGCSE Pseudocode Compiler <hello@pseudocode-compiler.sherlemious.com>';
export const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

// Lazy singleton — avoids build-time throw when RESEND_API_KEY is not set
let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
