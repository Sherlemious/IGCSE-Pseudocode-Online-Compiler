import { RuntimeError } from './types';
import { FILE_PREFIX, FILES_CHANGED_EVENT } from '../../utils/constants';

type FileMode = 'READ' | 'WRITE' | 'APPEND' | 'RANDOM';

interface OpenFile {
  mode: FileMode;
  lines: string[];
  pointer: number;
  /** RANDOM mode only: record address → serialized record */
  records: Map<number, string> | null;
}

const RANDOM_FILE_MARKER = '__pseudoRandomFile';

function parseRandomFile(content: string): Map<number, string> | null {
  try {
    const parsed = JSON.parse(content) as { [RANDOM_FILE_MARKER]?: number; records?: Record<string, string> };
    if (parsed && parsed[RANDOM_FILE_MARKER] === 1) {
      return new Map(Object.entries(parsed.records ?? {}).map(([k, v]) => [Number(k), v]));
    }
  } catch {
    // not JSON → not a random-access file
  }
  return null;
}

function stringifyRandomFile(records: Map<number, string>): string {
  const obj: Record<string, string> = {};
  for (const [k, v] of records) obj[String(k)] = v;
  return JSON.stringify({ [RANDOM_FILE_MARKER]: 1, records: obj });
}

export class VirtualFileSystem {
  private openFiles = new Map<string, OpenFile>();
  /** Writable files touched since the last flush — coalesced into one storage write per frame. */
  private dirty = new Set<string>();
  /** Pending requestAnimationFrame handle for the batched flush, or null when none is scheduled. */
  private flushHandle: number | null = null;

  openFile(filename: string, mode: FileMode): void {
    if (this.openFiles.has(filename)) {
      throw new RuntimeError(`File '${filename}' is already open`);
    }

    if (mode === 'RANDOM') {
      const content = localStorage.getItem(FILE_PREFIX + filename);
      let records = new Map<number, string>();
      if (content !== null && content !== '') {
        const parsed = parseRandomFile(content);
        if (!parsed) {
          throw new RuntimeError(`File '${filename}' is a text file — open it FOR READ, WRITE or APPEND instead`);
        }
        records = parsed;
      }
      this.openFiles.set(filename, { mode, lines: [], pointer: 1, records });
      return;
    }

    if (mode === 'READ') {
      const content = localStorage.getItem(FILE_PREFIX + filename);
      if (content === null) {
        throw new RuntimeError(`File '${filename}' does not exist`);
      }
      if (parseRandomFile(content)) {
        throw new RuntimeError(`File '${filename}' is a random-access file — open it FOR RANDOM instead`);
      }
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: 0, records: null });
    } else if (mode === 'WRITE') {
      this.openFiles.set(filename, { mode, lines: [], pointer: 0, records: null });
    } else {
      // APPEND
      const content = localStorage.getItem(FILE_PREFIX + filename) ?? '';
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: lines.length, records: null });
    }
  }

  readFile(filename: string): string {
    const file = this.openFiles.get(filename);
    if (!file) {
      throw new RuntimeError(`File '${filename}' is not open`);
    }
    if (file.mode !== 'READ') {
      throw new RuntimeError(`File '${filename}' is not open for reading`);
    }
    if (file.pointer >= file.lines.length) {
      throw new RuntimeError(`End of file '${filename}' reached`);
    }
    return file.lines[file.pointer++];
  }

  writeFile(filename: string, data: string): void {
    const file = this.openFiles.get(filename);
    if (!file) {
      throw new RuntimeError(`File '${filename}' is not open`);
    }
    if (file.mode !== 'WRITE' && file.mode !== 'APPEND') {
      throw new RuntimeError(`File '${filename}' is not open for writing`);
    }
    file.lines.push(data);
    // Persist eagerly so an open Files panel updates live — coalesced to one write per frame.
    this.scheduleFlush(filename);
  }

  closeFile(filename: string): void {
    const file = this.openFiles.get(filename);
    if (!file) {
      throw new RuntimeError(`File '${filename}' is not open`);
    }
    // Flush synchronously on an explicit close so storage errors (e.g. quota) surface to the student.
    this.persist(filename, file);
    this.dirty.delete(filename);
    this.openFiles.delete(filename);
    this.emitChange([filename]);
  }

  eof(filename: string): boolean {
    const file = this.openFiles.get(filename);
    if (!file) {
      throw new RuntimeError(`File '${filename}' is not open`);
    }
    if (file.mode !== 'READ') {
      throw new RuntimeError(`EOF can only be checked for files open for reading`);
    }
    return file.pointer >= file.lines.length;
  }

  private randomFile(filename: string, operation: string): OpenFile {
    const file = this.openFiles.get(filename);
    if (!file) {
      throw new RuntimeError(`File '${filename}' is not open`);
    }
    if (file.mode !== 'RANDOM') {
      throw new RuntimeError(`${operation} needs the file to be open FOR RANDOM`);
    }
    return file;
  }

  seek(filename: string, address: number): void {
    const file = this.randomFile(filename, 'SEEK');
    if (!Number.isInteger(address) || address < 1) {
      throw new RuntimeError(`SEEK address must be a whole number of 1 or more (got ${address})`);
    }
    file.pointer = address;
  }

  getRecord(filename: string): string {
    const file = this.randomFile(filename, 'GETRECORD');
    const data = file.records!.get(file.pointer);
    if (data === undefined) {
      throw new RuntimeError(`No record at position ${file.pointer} of '${filename}' — write one with PUTRECORD first`);
    }
    return data;
  }

  putRecord(filename: string, data: string): void {
    const file = this.randomFile(filename, 'PUTRECORD');
    file.records!.set(file.pointer, data);
    this.scheduleFlush(filename);
  }

  /**
   * Flush every still-open writable file to storage and drop all handles. This is the
   * durability backstop the interpreter calls when a run ends — it guarantees data
   * survives even when the student forgot CLOSEFILE, and forces out the final rAF frame
   * that may still be pending. It runs inside the interpreter's `finally`, so it must
   * never throw (a throw here would mask the program's real error).
   */
  closeAll(): void {
    if (this.flushHandle !== null) {
      cancelAnimationFrame(this.flushHandle);
      this.flushHandle = null;
    }
    const changed: string[] = [];
    for (const [name, file] of this.openFiles) {
      try {
        this.persist(name, file);
        changed.push(name);
      } catch {
        // storage full / unavailable — swallow so we don't hide the program's outcome
      }
    }
    this.openFiles.clear();
    this.dirty.clear();
    if (changed.length) this.emitChange(changed);
  }

  reset(): void {
    if (this.flushHandle !== null) {
      cancelAnimationFrame(this.flushHandle);
      this.flushHandle = null;
    }
    this.openFiles.clear();
    this.dirty.clear();
  }

  // ─── persistence helpers ────────────────────────────────────────

  /** Write one open file's current buffer to localStorage. READ files are never persisted. */
  private persist(filename: string, file: OpenFile): void {
    if (file.mode === 'WRITE' || file.mode === 'APPEND') {
      localStorage.setItem(FILE_PREFIX + filename, file.lines.join('\n'));
    } else if (file.mode === 'RANDOM') {
      localStorage.setItem(FILE_PREFIX + filename, stringifyRandomFile(file.records!));
    }
  }

  /** Mark a file dirty and coalesce a storage flush into the next animation frame. */
  private scheduleFlush(filename: string): void {
    this.dirty.add(filename);
    if (typeof requestAnimationFrame === 'undefined') {
      // No rAF (SSR / non-browser) — persist immediately.
      this.flushDirty();
      return;
    }
    if (this.flushHandle === null) {
      this.flushHandle = requestAnimationFrame(() => this.flushDirty());
    }
  }

  /** Persist every dirty file in one batch, then notify listeners (live Files panel). */
  private flushDirty(): void {
    this.flushHandle = null;
    const changed: string[] = [];
    for (const name of this.dirty) {
      const file = this.openFiles.get(name);
      if (!file) continue; // closed before the frame fired — already persisted
      try {
        this.persist(name, file);
        changed.push(name);
      } catch {
        // storage full / unavailable — drop this frame's write silently
      }
    }
    this.dirty.clear();
    if (changed.length) this.emitChange(changed);
  }

  /** Tell any open Files panel which files just changed on disk. */
  private emitChange(files: string[]): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(FILES_CHANGED_EVENT, { detail: { files } }));
  }
}
