import { describe, it, expect } from 'vitest';
import { convertToPython } from './pythonConverter';
import { examples } from '../../data/examples';

function py(src: string): string {
  const { code, errors } = convertToPython(src);
  expect(errors).toEqual([]);
  return code;
}

describe('pythonConverter — statements', () => {
  it('assignment and OUTPUT', () => {
    const code = py('x <- 5\nOUTPUT x\n');
    expect(code).toContain('x = 5');
    expect(code).toContain('print(x)');
  });

  it('OUTPUT concatenates items with no separator', () => {
    expect(py('OUTPUT "Sum: ", x\n')).toContain('print("Sum: ", x, sep="")');
  });

  it('FOR maps to range with inclusive upper bound', () => {
    expect(py('FOR i <- 1 TO 5\nOUTPUT i\nNEXT i\n')).toContain('for i in range(1, 5 + 1):');
  });

  it('FOR with negative literal STEP counts down', () => {
    expect(py('FOR i <- 5 TO 1 STEP -1\nOUTPUT i\nNEXT i\n')).toContain('for i in range(5, 1 - 1, -1):');
  });

  it('WHILE maps to while', () => {
    expect(py('WHILE x < 3 DO\nx <- x + 1\nENDWHILE\n')).toContain('while x < 3:');
  });

  it('REPEAT/UNTIL maps to while True + guarded break', () => {
    const code = py('REPEAT\nx <- x + 1\nUNTIL x >= 3\n');
    expect(code).toContain('while True:');
    expect(code).toContain('if x >= 3:');
    expect(code).toContain('break');
  });

  it('IF / ELSEIF / ELSE', () => {
    const code = py('IF a > 1 THEN\nOUTPUT 1\nELSEIF a > 0 THEN\nOUTPUT 2\nELSE\nOUTPUT 3\nENDIF\n');
    expect(code).toContain('if a > 1:');
    expect(code).toContain('elif a > 0:');
    expect(code).toContain('else:');
  });

  it('ELSE IF (two words) also maps to elif', () => {
    const code = py('IF a > 1 THEN\nOUTPUT 1\nELSE IF a > 0 THEN\nOUTPUT 2\nELSE\nOUTPUT 3\nENDIF\n');
    expect(code).toContain('if a > 1:');
    expect(code).toContain('elif a > 0:');
    expect(code).toContain('else:');
  });

  it('CASE becomes if/elif chain, with TO ranges', () => {
    const code = py('CASE OF g\n90 TO 100 : OUTPUT "A"\nOTHERWISE : OUTPUT "C"\nENDCASE\n');
    expect(code).toContain('_case = g');
    expect(code).toContain('if 90 <= _case <= 100:');
    expect(code).toContain('else:');
  });
});

describe('pythonConverter — expressions and operators', () => {
  it('comparison and boolean operators', () => {
    expect(py('OUTPUT a = b\n')).toContain('print(a == b)');
    expect(py('OUTPUT a <> b\n')).toContain('print(a != b)');
    expect(py('OUTPUT a AND b OR c\n')).toContain('print(a and b or c)');
    expect(py('OUTPUT NOT a\n')).toContain('print(not a)');
  });

  it('DIV uses a truncating helper, MOD maps to %', () => {
    const code = py('OUTPUT 7 DIV 2\nOUTPUT 7 MOD 2\n');
    expect(code).toContain('DIV(7, 2)');
    expect(code).toContain('7 % 2');
    expect(code).toContain('def DIV(a, b):');
  });

  it('power maps to **', () => {
    expect(py('OUTPUT 2 ^ 10\n')).toContain('2 ** 10');
  });

  it('& concatenation coerces non-strings with str()', () => {
    expect(py('OUTPUT "n=" & x\n')).toContain('"n=" + str(x)');
  });

  it('adds parentheses to preserve precedence', () => {
    expect(py('OUTPUT (a + b) * c\n')).toContain('(a + b) * c');
  });
});

describe('pythonConverter — builtins', () => {
  it('string builtins', () => {
    expect(py('OUTPUT LENGTH(s)\n')).toContain('len(s)');
    expect(py('OUTPUT UCASE(s)\n')).toContain('s.upper()');
    expect(py('OUTPUT LCASE(s)\n')).toContain('s.lower()');
    const sub = py('OUTPUT SUBSTRING(s, 1, 3)\n');
    expect(sub).toContain('SUBSTRING(s, 1, 3)');
    expect(sub).toContain('def SUBSTRING(s, start, length):');
  });

  it('conversion builtins', () => {
    expect(py('OUTPUT NUM_TO_STRING(x)\n')).toContain('str(x)');
    expect(py('OUTPUT ASC("A")\n')).toContain('ord("A")');
    expect(py('OUTPUT CHR(65)\n')).toContain('chr(65)');
  });
});

describe('pythonConverter — declarations and arrays', () => {
  it('scalar DECLARE emits a typed default', () => {
    const code = py('DECLARE n : INTEGER\nDECLARE s : STRING\nDECLARE b : BOOLEAN\n');
    expect(code).toContain('n = 0');
    expect(code).toContain('s = ""');
    expect(code).toContain('b = False');
  });

  it('1-based array indices are offset to 0-based', () => {
    const code = py('DECLARE a : ARRAY[1:5] OF INTEGER\na[3] <- 9\nOUTPUT a[i]\n');
    expect(code).toContain('a = [0] * 5');
    expect(code).toContain('a[3 - 1] = 9');
    expect(code).toContain('a[i - 1]');
  });

  it('INPUT coerces by declared type', () => {
    expect(py('DECLARE n : INTEGER\nINPUT n\n')).toContain('n = int(input())');
    expect(py('DECLARE s : STRING\nINPUT s\n')).toContain('s = input()');
  });
});

describe('pythonConverter — A Level constructs', () => {
  it('record becomes a dataclass', () => {
    const code = py('TYPE Point\nDECLARE X : INTEGER\nDECLARE Y : INTEGER\nENDTYPE\nDECLARE p : Point\n');
    expect(code).toContain('@dataclass');
    expect(code).toContain('class Point:');
    expect(code).toContain('X: int = 0');
    expect(code).toContain('p = Point()');
  });

  it('records have value semantics (deep copy on assignment)', () => {
    const code = py('TYPE Point\nDECLARE X : INTEGER\nENDTYPE\nDECLARE a : Point\nDECLARE b : Point\nb <- a\n');
    expect(code).toContain('import copy');
    expect(code).toContain('b = copy.deepcopy(a)');
  });

  it('enum becomes an IntEnum and bare members qualify', () => {
    const code = py('TYPE Season = (Spring, Summer)\nDECLARE s : Season\ns <- Spring\n');
    expect(code).toContain('class Season(IntEnum):');
    expect(code).toContain('Spring = 0');
    expect(code).toContain('s = Season.Spring');
  });

  it('class maps to class with __init__, private fields, and super', () => {
    const code = py(
      'CLASS Pet\n' +
      '  PRIVATE Name : STRING\n' +
      '  PUBLIC PROCEDURE NEW(n : STRING)\n' +
      '    Name <- n\n' +
      '  ENDPROCEDURE\n' +
      'ENDCLASS\n' +
      'CLASS Cat INHERITS Pet\n' +
      '  PUBLIC PROCEDURE NEW(n : STRING)\n' +
      '    SUPER.NEW(n)\n' +
      '  ENDPROCEDURE\n' +
      'ENDCLASS\n'
    );
    expect(code).toContain('class Pet:');
    expect(code).toContain('def __init__(self, n):');
    expect(code).toContain('self._Name = n');
    expect(code).toContain('class Cat(Pet):');
    expect(code).toContain('super().__init__(n)');
  });

  it('procedures and functions become defs', () => {
    const code = py('FUNCTION Sq(n : INTEGER) RETURNS INTEGER\nRETURN n * n\nENDFUNCTION\nOUTPUT Sq(4)\n');
    expect(code).toContain('def Sq(n):');
    expect(code).toContain('return n * n');
    expect(code).toContain('Sq(4)');
  });
});

describe('pythonConverter — graceful degradation', () => {
  it('pointers convert best-effort with a note', () => {
    const code = py('TYPE IntPtr = ^INTEGER\nDECLARE x : INTEGER\nDECLARE p : IntPtr\np <- ^x\nOUTPUT p^\n');
    expect(code).toContain('# Pointers are approximated');
    expect(code).not.toContain('???');
  });

  it('sequential file handling uses an injected shim', () => {
    const code = py('OPENFILE "f.txt" FOR WRITE\nWRITEFILE "f.txt", "hi"\nCLOSEFILE "f.txt"\n');
    expect(code).toContain('def OPENFILE(name, mode):');
    expect(code).toContain('OPENFILE("f.txt", "WRITE")');
    expect(code).toContain('WRITEFILE("f.txt", "hi")');
  });

  it('random-access file ops become TODO comments', () => {
    const code = py('OPENFILE "f.dat" FOR RANDOM\nSEEK "f.dat", 3\n');
    expect(code).toContain('# TODO');
  });
});

describe('pythonConverter — errors', () => {
  it('returns parse errors and no code for invalid pseudocode', () => {
    const { code, errors } = convertToPython('IF x THEN\nOUTPUT 1\n'); // missing ENDIF
    expect(errors.length).toBeGreaterThan(0);
    expect(code).toBe('');
  });

  it('empty input yields empty output', () => {
    expect(convertToPython('   ')).toEqual({ code: '', errors: [] });
  });
});

describe('pythonConverter — examples corpus', () => {
  it('converts every built-in example without errors or unhandled nodes', () => {
    for (const ex of examples) {
      const { code, errors } = convertToPython(ex.code);
      expect(errors, `parse errors in "${ex.title}"`).toEqual([]);
      expect(code, `empty output for "${ex.title}"`).not.toBe('');
      expect(code, `unhandled node in "${ex.title}"`).not.toContain('???');
    }
  });
});
