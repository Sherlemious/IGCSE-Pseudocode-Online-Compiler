// Short, human-friendly share codes for exams.
// Unambiguous alphabet: no 0/O/1/I/L to avoid transcription errors.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

/** Generate a random share code (uniqueness is enforced by the DB + retry). */
export function generateShareCode(length: number = CODE_LENGTH): string {
  let code = '';
  const buf = new Uint32Array(1);
  // Rejection sampling keeps the index uniform. `Math.random` is predictable.
  const limit = Math.floor(0x1_0000_0000 / ALPHABET.length) * ALPHABET.length;
  for (let i = 0; i < length; i++) {
    let value = 0;
    do {
      crypto.getRandomValues(buf);
      value = buf[0];
    } while (value >= limit);
    code += ALPHABET[value % ALPHABET.length];
  }
  return code;
}

/** Normalize user-entered codes (uppercase, strip whitespace). */
export function normalizeShareCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}
