import { FILE_PREFIX } from '../storage';

/** Backing store for the virtual filesystem. `undefined` means the file does not exist. */
export interface FileStore {
  get(filename: string): string | undefined;
  set(filename: string, content: string): void;
  /** Wipe the store. Memory (grading) implements this; browser localStorage does not. */
  clear?(): void;
}

/** In-memory store used by the autograder and vitest. */
export class MemoryFileStore implements FileStore {
  private readonly values = new Map<string, string>();

  get(filename: string): string | undefined {
    return this.values.get(filename);
  }

  set(filename: string, content: string): void {
    this.values.set(filename, content);
  }

  clear(): void {
    this.values.clear();
  }
}

/** Browser localStorage store. Keys are prefixed so they don't collide with other app data. */
export class LocalStorageFileStore implements FileStore {
  constructor(private readonly storage?: Storage) {}

  get(filename: string): string | undefined {
    // Resolve browser storage only for file I/O; it may be blocked or absent.
    const value = (this.storage ?? localStorage).getItem(FILE_PREFIX + filename);
    return value === null ? undefined : value;
  }

  set(filename: string, content: string): void {
    (this.storage ?? localStorage).setItem(FILE_PREFIX + filename, content);
  }
}

const RANDOM_FILE_MARKER = '__pseudoRandomFile';

export function parseRandomFile(content: string): Map<number, string> | null {
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

export function stringifyRandomFile(records: Map<number, string>): string {
  const obj: Record<string, string> = {};
  for (const [k, v] of records) obj[String(k)] = v;
  return JSON.stringify({ [RANDOM_FILE_MARKER]: 1, records: obj });
}
