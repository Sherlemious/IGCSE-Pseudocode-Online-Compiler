import { toBlob } from 'html-to-image';

export const EXPORT_CARD_WIDTH = 680;
export const MAX_EXPORT_CODE_LINES = 80;
export const MAX_EXPORT_TRACE_ROWS = 40;
/** Tighter cap when the card also includes code, so Lab exports stay shareable. */
export const MAX_EXPORT_TRACE_ROWS_WITH_CODE = 24;

export async function captureExportCard(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, {
    pixelRatio: 2,
    cacheBust: true,
    width: node.scrollWidth,
    height: node.scrollHeight,
    style: { transform: 'none' },
  });
  if (!blob) throw new Error('Failed to capture image');
  return blob;
}

export async function copyImageBlob(blobOrPromise: Blob | Promise<Blob>): Promise<void> {
  // Pass a Promise so ClipboardItem is constructed inside the click gesture;
  // Safari (and some Chromium builds) reject write() after an await.
  const item = new ClipboardItem({
    'image/png': blobOrPromise,
  });
  await navigator.clipboard.write([item]);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function pngFileName(tabName: string): string {
  const base = tabName.replace(/\.[^.]+$/, '') || 'code';
  return `${base}-run.png`;
}

export function canNativeShareFiles(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.canShare !== 'function') return false;
  try {
    const probe = new File(['x'], 'probe.png', { type: 'image/png' });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

export async function shareImageBlob(
  blob: Blob,
  filename: string,
  title: string,
): Promise<void> {
  const file = new File([blob], filename, { type: 'image/png' });
  await navigator.share({ files: [file], title });
}
