// Runtime helper snippets for the pseudocode → Python converter.
//
// The converter emits *idiomatic* Python and only pulls in these helpers where
// Python's built-in semantics differ from Cambridge pseudocode (1-based string
// ops, truncating DIV, round-half-away-from-zero, sequential file handling).
// Each helper is injected at the top of the generated program only when used.

export interface HelperDef {
  /** Python source for the helper definition. */
  code: string;
  /** `import` lines this helper depends on. */
  imports?: string[];
}

/** Helpers keyed by the name the converter references them by. */
export const PY_HELPERS: Record<string, HelperDef> = {
  DIV: {
    code: [
      'def DIV(a, b):',
      '    """Integer division truncated toward zero (Cambridge DIV)."""',
      '    q = a // b',
      '    if a % b != 0 and (a < 0) != (b < 0):',
      '        q += 1',
      '    return q',
    ].join('\n'),
  },

  ROUND: {
    imports: ['import math'],
    code: [
      'def ROUND(x, places=0):',
      '    """Round half away from zero (Cambridge ROUND)."""',
      '    factor = 10 ** places',
      '    return math.floor(x * factor + 0.5) / factor',
    ].join('\n'),
  },

  SUBSTRING: {
    code: [
      'def SUBSTRING(s, start, length):',
      '    """1-based substring (Cambridge SUBSTRING)."""',
      '    return s[start - 1:start - 1 + length]',
    ].join('\n'),
  },

  MID: {
    code: [
      'def MID(s, start, length):',
      '    """1-based substring (Cambridge MID)."""',
      '    return s[start - 1:start - 1 + length]',
    ].join('\n'),
  },

  LEFT: {
    code: [
      'def LEFT(s, length):',
      '    return s[:length]',
    ].join('\n'),
  },

  RIGHT: {
    code: [
      'def RIGHT(s, length):',
      '    start = len(s) - length',
      '    return s[start:] if start > 0 else s',
    ].join('\n'),
  },

  STRING_TO_NUM: {
    code: [
      'def STRING_TO_NUM(s):',
      '    n = float(s)',
      '    return int(n) if n.is_integer() else n',
    ].join('\n'),
  },

  IS_NUM: {
    code: [
      'def IS_NUM(s):',
      '    try:',
      '        float(s)',
      '        return str(s).strip() != ""',
      '    except ValueError:',
      '        return False',
    ].join('\n'),
  },
};

/**
 * Sequential file-handling shim. Cambridge file I/O is statement-based
 * (OPENFILE/READFILE/WRITEFILE/CLOSEFILE) and keyed by filename, so we keep a
 * registry of open handles rather than passing file objects around.
 */
export const FILE_HELPERS: Record<string, string> = {
  OPENFILE: [
    'def OPENFILE(name, mode):',
    '    _files[name] = open(name, {"READ": "r", "WRITE": "w", "APPEND": "a"}[mode])',
  ].join('\n'),

  READFILE: [
    'def READFILE(name):',
    '    return _files[name].readline().rstrip("\\n")',
  ].join('\n'),

  WRITEFILE: [
    'def WRITEFILE(name, data):',
    '    _files[name].write(str(data) + "\\n")',
  ].join('\n'),

  CLOSEFILE: [
    'def CLOSEFILE(name):',
    '    _files[name].close()',
    '    del _files[name]',
  ].join('\n'),

  EOF: [
    'def EOF(name):',
    '    f = _files[name]',
    '    pos = f.tell()',
    '    at_end = f.readline() == ""',
    '    f.seek(pos)',
    '    return at_end',
  ].join('\n'),
};

/** Module-level state the file helpers share. Emitted once if any file op is used. */
export const FILE_REGISTRY = '_files = {}';
