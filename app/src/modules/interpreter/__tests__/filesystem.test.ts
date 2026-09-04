import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FILE_PREFIX, FILES_CHANGED_EVENT } from '../storage';
import { ServerVirtualFileSystem, VirtualFileSystem } from '../core/filesystem';
import { LocalStorageFileStore } from '../core/fileStore';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class MemoryCustomEvent<T> extends Event {
  readonly detail: T;

  constructor(type: string, init?: CustomEventInit<T>) {
    super(type);
    this.detail = init?.detail as T;
  }
}

describe('browser virtual filesystem persistence', () => {
  let storage: MemoryStorage;
  let browserWindow: EventTarget;
  let animationFrames: FrameRequestCallback[];

  beforeEach(() => {
    storage = new MemoryStorage();
    browserWindow = new EventTarget();
    animationFrames = [];

    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('window', browserWindow);
    vi.stubGlobal('CustomEvent', MemoryCustomEvent);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates and announces a file as soon as it is opened FOR WRITE', () => {
    const changed: string[][] = [];
    browserWindow.addEventListener(FILES_CHANGED_EVENT, (event) => {
      changed.push((event as CustomEvent<{ files: string[] }>).detail.files);
    });

    const fs = new VirtualFileSystem();
    fs.openFile('created.txt', 'WRITE');

    expect(storage.getItem(FILE_PREFIX + 'created.txt')).toBe('');
    expect(changed).toEqual([['created.txt']]);
  });

  it('persists and announces the first WRITEFILE on the next frame', () => {
    const changed: string[][] = [];
    browserWindow.addEventListener(FILES_CHANGED_EVENT, (event) => {
      changed.push((event as CustomEvent<{ files: string[] }>).detail.files);
    });

    const fs = new VirtualFileSystem();
    fs.openFile('live.txt', 'WRITE');
    changed.length = 0;

    fs.writeFile('live.txt', 'first line');
    expect(animationFrames).toHaveLength(1);

    animationFrames.shift()?.(0);

    expect(storage.getItem(FILE_PREFIX + 'live.txt')).toBe('first line');
    expect(changed).toEqual([['live.txt']]);
  });
});

describe.each([
  ['memory (autograder)', () => new ServerVirtualFileSystem()],
  [
    'localStorage (playground)',
    () => {
      const storage = new MemoryStorage();
      return new VirtualFileSystem({
        store: new LocalStorageFileStore(storage),
        livePersist: false,
      });
    },
  ],
])('VFS file semantics — %s', (_label, createFs) => {
  it('round-trips WRITEFILE then READFILE after CLOSEFILE', () => {
    const fs = createFs();
    fs.openFile('notes.txt', 'WRITE');
    fs.writeFile('notes.txt', 'hello');
    fs.closeFile('notes.txt');

    fs.openFile('notes.txt', 'READ');
    expect(fs.readFile('notes.txt')).toBe('hello');
    expect(fs.eof('notes.txt')).toBe(true);
    fs.closeFile('notes.txt');
  });

  it('throws when READFILE targets a missing file', () => {
    const fs = createFs();
    expect(() => fs.openFile('missing.txt', 'READ')).toThrow("File 'missing.txt' does not exist");
  });

  it('rejects opening a text file FOR RANDOM and a random file FOR READ', () => {
    const fs = createFs();
    fs.openFile('text.txt', 'WRITE');
    fs.writeFile('text.txt', 'plain');
    fs.closeFile('text.txt');
    expect(() => fs.openFile('text.txt', 'RANDOM')).toThrow(/text file/);

    fs.openFile('rand.dat', 'RANDOM');
    fs.putRecord('rand.dat', '{"n":1}');
    fs.closeFile('rand.dat');
    expect(() => fs.openFile('rand.dat', 'READ')).toThrow(/random-access file/);
  });

  it('SEEK / GETRECORD / PUTRECORD share the same record layout', () => {
    const fs = createFs();
    fs.openFile('recs.dat', 'RANDOM');
    fs.seek('recs.dat', 3);
    fs.putRecord('recs.dat', 'alpha');
    fs.closeFile('recs.dat');

    fs.openFile('recs.dat', 'RANDOM');
    fs.seek('recs.dat', 3);
    expect(fs.getRecord('recs.dat')).toBe('alpha');
    fs.closeFile('recs.dat');
  });

  it('closeAll flushes a forgotten CLOSEFILE so the next open can read it', () => {
    const fs = createFs();
    fs.openFile('kept.txt', 'WRITE');
    fs.writeFile('kept.txt', 'kept');
    fs.closeAll();

    fs.openFile('kept.txt', 'READ');
    expect(fs.readFile('kept.txt')).toBe('kept');
    fs.closeFile('kept.txt');
  });
});
