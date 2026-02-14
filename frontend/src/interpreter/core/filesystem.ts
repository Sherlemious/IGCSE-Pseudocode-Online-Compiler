import { RuntimeError } from './types';

type FileMode = 'READ' | 'WRITE' | 'APPEND';

interface OpenFile {
  mode: FileMode;
  lines: string[];
  pointer: number;
}

const STORAGE_PREFIX = 'pseudocode_file_';
const MAX_FILES = 100;
const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB in characters

export class VirtualFileSystem {
  private openFiles = new Map<string, OpenFile>();

  openFile(filename: string, mode: FileMode): void {
    if (this.openFiles.has(filename)) {
      throw new RuntimeError(`File '${filename}' is already open`);
    }

    if (mode === 'READ') {
      const content = localStorage.getItem(STORAGE_PREFIX + filename);
      if (content === null) {
        throw new RuntimeError(`File '${filename}' does not exist`);
      }
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: 0 });
    } else if (mode === 'WRITE') {
      this.openFiles.set(filename, { mode, lines: [], pointer: 0 });
    } else {
      // APPEND
      const content = localStorage.getItem(STORAGE_PREFIX + filename) ?? '';
      const lines = content === '' ? [] : content.split('\n');
      this.openFiles.set(filename, { mode, lines, pointer: lines.length });
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
  }

  closeFile(filename: string): void {
    const file = this.openFiles.get(filename);
    if (!file) {
      throw new RuntimeError(`File '${filename}' is not open`);
    }

    try {
      if (file.mode === 'WRITE' || file.mode === 'APPEND') {
        const content = file.lines.join('\n');
        const key = STORAGE_PREFIX + filename;

        let currentFilesCount = 0;
        let currentTotalSize = 0;
        let isExistingFile = false;

        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            if (k === key) {
              isExistingFile = true;
            } else {
              currentFilesCount++;
              currentTotalSize += (localStorage.getItem(k) || '').length;
            }
          }
        }

        // Check file count limit (only for new files)
        if (!isExistingFile && currentFilesCount >= MAX_FILES) {
          throw new RuntimeError(`Storage quota exceeded: maximum of ${MAX_FILES} files reached`);
        }

        // Check total size limit
        if (currentTotalSize + content.length > MAX_TOTAL_SIZE) {
          throw new RuntimeError(`Storage quota exceeded: maximum total size of 5MB reached`);
        }

        try {
          localStorage.setItem(key, content);
        } catch (e) {
          throw new RuntimeError(
            `Failed to save file '${filename}' to storage: ${e instanceof Error ? e.message : 'Storage full'}`
          );
        }
      }
    } finally {
      this.openFiles.delete(filename);
    }
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

  reset(): void {
    this.openFiles.clear();
  }
}
