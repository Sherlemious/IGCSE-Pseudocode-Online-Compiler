// Short, human-friendly share codes for exams.
// Unambiguous alphabet: no 0/O/1/I/L to avoid transcription errors.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

/** Generate a random share code (uniqueness is enforced by the DB + retry). */
export function generateShareCode(length: number = CODE_LENGTH): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

/** Normalize user-entered codes (uppercase, strip whitespace). */
export function normalizeShareCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}
