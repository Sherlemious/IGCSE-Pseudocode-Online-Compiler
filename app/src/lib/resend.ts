import { Resend } from 'resend';

// Singleton — safe to call at module level (only instantiated server-side)
export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_ADDRESS = 'IGCSE Pseudocode Compiler <hello@pseudocode-compiler.sherlemious.com>';
export const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';
