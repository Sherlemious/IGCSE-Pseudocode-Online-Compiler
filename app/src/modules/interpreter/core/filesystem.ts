import { RuntimeError } from './types';
import { FILES_CHANGED_EVENT } from '../storage';
import {
  type FileStore,
  LocalStorageFileStore,
  MemoryFileStore,
  parseRandomFile,
  stringifyRandomFile,
} from './fileStore';

type FileMode = 'READ' | 'WRITE' | 'APPEND' | 'RANDOM';

interface OpenFile {
  mode: FileMode;
  lines: string[];
  pointer: number;
  /** RANDOM mode only: record address → serialized record */
  records: Map<number, string> | null;
}

export interface VfsOptions {
  store?: FileStore;
  /**
   * When true (browser playground), WRITEFILE/PUTRECORD flush to the store on
   * the next animation frame so an open Files panel can refresh live.
   * When false (autograder / vitest), writes stay buffered until CLOSEFILE or end-of-run.
   */
  livePersist?: boolean;
  onFilesChanged?: (files: string[]) => void;
}

function emitBrowserChange(files: string[]): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(FILES_CHANGED_EVENT, { detail: { files } }));
}

/**
 * Pseudocode virtual filesystem. Persistence is injected via {@link FileStore};
 * the OPENFILE / READFILE / WRITEFILE / RANDOM semantics live here once.
 */
export class VirtualFileSystem {
  private readonly store: FileStore;
  private readonly livePersist: boolean;
  private readonly onFilesChanged?: (files: string[]) => void;
  private openFiles = new Map<string, OpenFile>();
  /** Writable files touched since the last flush — coalesced into one storage write per frame. */
  private dirty = new Set<string>();
  /** Pending requestAnimationFrame handle for the batched flush, or null when none is scheduled. */
  private flushHandle: number | null = null;

  constructor(options: VfsOptions = {}) {
    this.store = options.store ?? new LocalStorageFileStore();
    this.livePersist = options.livePersist ?? true;
    this.onFilesChanged =
      options.onFilesChanged ?? (this.livePersist ? emitBrowserChange : undefined);
  }

  openFile(filename: string, mode: FileMode): void {
    if (this.openFiles.has(filename)) {
      throw new RuntimeError(`File '${filename}' is already open`);
    }

    if (mode === 'RANDOM') {
      const content = this.store.get(filename);
      let records = new Map<number, string>();
      if (content !== undefined && content !== '') {
        const parsed = parseRandomFile(content);
        if (!parsed) {
          throw new RuntimeError(`File '${filename}' is a text file — open it FOR READ, WRITE or APPEND instead`);
        }
        records = parsed;
      }
      const file = { mode, lines: [], pointer: 1, records } satisfies OpenFile;
      this.openFiles.set(filename, file);
      if (content === undefined) {
        this.persist(filename, file);
        this.emitChange([filename]);
      }
      return;
    }

    if (mode === 'READ') {
      const content = this.store.get(filename);
      if (content === undefined) {
        throw new RuntimeError(`File '${filename}' does not exist`);
      }
      if (parseRandomFile(content)) {
        throw new RuntimeError(`File '${filename}' is a random-access file — open it FOR RANDOM instead`);
      }
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: 0, records: null });
    } else if (mode === 'WRITE') {
      const file = { mode, lines: [], pointer: 0, records: null } satisfies OpenFile;
      this.openFiles.set(filename, file);
      // FOR WRITE creates (or truncates) the file as soon as OPENFILE succeeds.
      this.persist(filename, file);
      this.emitChange([filename]);
    } else {
      // APPEND
      const stored = this.store.get(filename);
      const content = stored ?? '';
      const lines = content === '' ? [] : content.split('\n');
      const file = { mode, lines, pointer: lines.length, records: null } satisfies OpenFile;
      this.openFiles.set(filename, file);
      if (stored === undefined) {
        this.persist(filename, file);
        this.emitChange([filename]);
      }
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
    if (this.livePersist) this.scheduleFlush(filename);
  }

  /**
   * Pre-populate a file's stored content before the program runs, without
   * going through OPENFILE. Used to seed TestCase.initialFiles for questions
   * that read from a file the student didn't create (e.g. "names.txt").
   */
  seedFile(filename: string, content: string): void {
    this.store.set(filename, content);
  }

  /** @deprecated Use {@link seedFile}. Kept for older call sites. */
  preloadFile(filename: string, content: string): void {
    this.seedFile(filename, content);
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
    if (this.livePersist) this.scheduleFlush(filename);
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
    this.store.clear?.();
  }

  private persist(filename: string, file: OpenFile): void {
    if (file.mode === 'WRITE' || file.mode === 'APPEND') {
      this.store.set(filename, file.lines.join('\n'));
    } else if (file.mode === 'RANDOM') {
      this.store.set(filename, stringifyRandomFile(file.records!));
    }
  }

  private scheduleFlush(filename: string): void {
    this.dirty.add(filename);
    if (typeof requestAnimationFrame === 'undefined') {
      this.flushDirty();
      return;
    }
    if (this.flushHandle === null) {
      this.flushHandle = requestAnimationFrame(() => this.flushDirty());
    }
  }

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

  private emitChange(files: string[]): void {
    try {
      this.onFilesChanged?.(files);
    } catch {
      // Viewer failures must not interrupt file I/O or mask errors during cleanup.
    }
  }
}

/** In-memory VFS used by the autograder and vitest. Same API, no localStorage. */
export class ServerVirtualFileSystem extends VirtualFileSystem {
  constructor() {
    super({ store: new MemoryFileStore(), livePersist: false });
  }
}
