/**
 * Server-safe virtual file system backed by an in-memory Map.
 * Identical API to VirtualFileSystem but uses no localStorage.
 * Used by the autograder in API routes.
 */
import { RuntimeError } from './types';

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

export class ServerVirtualFileSystem {
  private store = new Map<string, string>();
  private openFiles = new Map<string, OpenFile>();

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
      this.openFiles.set(filename, { mode, lines: [], pointer: 1, records });
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
      this.openFiles.set(filename, { mode, lines: [], pointer: 0, records: null });
    } else {
      // APPEND
      const content = this.store.get(filename) ?? '';
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: lines.length, records: null });
    }
  }

  readFile(filename: string): string {
    const file = this.openFiles.get(filename);
    if (!file) throw new RuntimeError(`File '${filename}' is not open`);
    if (file.mode !== 'READ') throw new RuntimeError(`File '${filename}' is not open for reading`);
    if (file.pointer >= file.lines.length) throw new RuntimeError(`End of file '${filename}' reached`);
    return file.lines[file.pointer++];
  }

  writeFile(filename: string, data: string): void {
    const file = this.openFiles.get(filename);
    if (!file) throw new RuntimeError(`File '${filename}' is not open`);
    if (file.mode !== 'WRITE' && file.mode !== 'APPEND') {
      throw new RuntimeError(`File '${filename}' is not open for writing`);
    }
    file.lines.push(data);
  }

  closeFile(filename: string): void {
    const file = this.openFiles.get(filename);
    if (!file) throw new RuntimeError(`File '${filename}' is not open`);
    if (file.mode === 'WRITE' || file.mode === 'APPEND') {
      this.store.set(filename, file.lines.join('\n'));
    } else if (file.mode === 'RANDOM') {
      this.store.set(filename, stringifyRandomFile(file.records!));
    }
    this.openFiles.delete(filename);
  }

  eof(filename: string): boolean {
    const file = this.openFiles.get(filename);
    if (!file) throw new RuntimeError(`File '${filename}' is not open`);
    if (file.mode !== 'READ') throw new RuntimeError(`EOF can only be checked for files open for reading`);
    return file.pointer >= file.lines.length;
  }

  private randomFile(filename: string, operation: string): OpenFile {
    const file = this.openFiles.get(filename);
    if (!file) throw new RuntimeError(`File '${filename}' is not open`);
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
  }

  preloadFile(filename: string, content: string): void {
    this.store.set(filename, content);
  }

  reset(): void {
    this.openFiles.clear();
    this.store.clear();
  }
}
