/** Encode a program so the compiler homepage can open it via `?code=`. */
export function encodeEditorCode(code: string) {
  const encoded = encodeURIComponent(code);
  const base64 =
    typeof btoa === 'function'
      ? btoa(encoded)
      : Buffer.from(encoded, 'latin1').toString('base64');
  return encodeURIComponent(base64);
}

export function editorCodeHref(code: string) {
  return `/?code=${encodeEditorCode(code)}`;
}
