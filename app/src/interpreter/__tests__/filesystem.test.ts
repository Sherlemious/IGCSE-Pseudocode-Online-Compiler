import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FILE_PREFIX, FILES_CHANGED_EVENT } from '../../utils/constants';
import { VirtualFileSystem } from '../core/filesystem';

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
