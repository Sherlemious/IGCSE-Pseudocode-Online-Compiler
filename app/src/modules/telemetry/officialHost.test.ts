import { describe, expect, it } from 'vitest';
import { hostToReport, isOfficialHost } from './officialHost';

describe('hostToReport', () => {
  it('stays quiet on the official site and on localhost', () => {
    expect(hostToReport('pseudocode-compiler.sherlemious.com', 'https://pseudocode-compiler.sherlemious.com/practice')).toBeNull();
    expect(hostToReport('www.pseudocode-compiler.sherlemious.com', 'https://www.pseudocode-compiler.sherlemious.com/')).toBeNull();
    expect(hostToReport('localhost', 'http://localhost:3000/')).toBeNull();
    expect(hostToReport('127.0.0.1', 'http://127.0.0.1:3000/')).toBeNull();
    expect(isOfficialHost('staging.sherlemious.com')).toBe(true);
  });

  it('reports a copy served somewhere else, including a school network', () => {
    expect(hostToReport('compiler.example.com', 'https://compiler.example.com/practice')).toBe('compiler.example.com');
    expect(hostToReport('Compiler.Example.com', 'https://compiler.example.com/')).toBe('compiler.example.com');
    expect(hostToReport('192.168.1.20', 'http://192.168.1.20:3000/')).toBe('192.168.1.20');
    expect(hostToReport('classroom-pc', 'http://classroom-pc/')).toBe('classroom-pc');
  });

  it('ignores a report that names a different host than the page it came from', () => {
    expect(hostToReport('compiler.example.com', 'https://pseudocode-compiler.sherlemious.com/')).toBeNull();
    expect(hostToReport('not a host', 'https://not a host/')).toBeNull();
    expect(hostToReport('compiler.example.com', null)).toBeNull();
    expect(hostToReport('notsherlemious.com', 'https://notsherlemious.com/')).toBe('notsherlemious.com');
  });
});
