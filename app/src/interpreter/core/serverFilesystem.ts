/**
 * Server-safe virtual file system backed by an in-memory Map.
 * Identical API to VirtualFileSystem but uses no localStorage.
 * Used by the autograder in API routes.
 */
import { RuntimeError } from './types';

type FileMode = 'READ' | 'WRITE' | 'APPEND';

interface OpenFile {
  mode: FileMode;
  lines: string[];
  pointer: number;
}

export class ServerVirtualFileSystem {
  private store = new Map<string, string>();
  private openFiles = new Map<string, OpenFile>();

  openFile(filename: string, mode: FileMode): void {
    if (this.openFiles.has(filename)) {
      throw new RuntimeError(`File '${filename}' is already open`);
    }

    if (mode === 'READ') {
      const content = this.store.get(filename);
      if (content === undefined) {
        throw new RuntimeError(`File '${filename}' does not exist`);
      }
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: 0 });
    } else if (mode === 'WRITE') {
      this.openFiles.set(filename, { mode, lines: [], pointer: 0 });
    } else {
      // APPEND
      const content = this.store.get(filename) ?? '';
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: lines.length });
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
    }
    this.openFiles.delete(filename);
  }

  eof(filename: string): boolean {
    const file = this.openFiles.get(filename);
    if (!file) throw new RuntimeError(`File '${filename}' is not open`);
    if (file.mode !== 'READ') throw new RuntimeError(`EOF can only be checked for files open for reading`);
    return file.pointer >= file.lines.length;
  }

  preloadFile(filename: string, content: string): void {
    this.store.set(filename, content);
  }

  reset(): void {
    this.openFiles.clear();
    this.store.clear();
  }
}
