import { RuntimeValue, mkInteger, mkReal, mkString, mkChar, mkBoolean, toNumber, toString } from './values';
import { RuntimeError } from './types';

type BuiltinFn = (args: RuntimeValue[]) => RuntimeValue;

const builtins = new Map<string, BuiltinFn>();

builtins.set('LENGTH', (args) => {
  if (args.length !== 1) throw new RuntimeError('LENGTH expects 1 argument');
  return mkInteger(toString(args[0]).length);
});

builtins.set('LCASE', (args) => {
  if (args.length !== 1) throw new RuntimeError('LCASE expects 1 argument');
  return mkString(toString(args[0]).toLowerCase());
});

builtins.set('UCASE', (args) => {
  if (args.length !== 1) throw new RuntimeError('UCASE expects 1 argument');
  return mkString(toString(args[0]).toUpperCase());
});

builtins.set('SUBSTRING', (args) => {
  if (args.length !== 3) throw new RuntimeError('SUBSTRING expects 3 arguments (string, start, length)');
  const str = toString(args[0]);
  const start = toNumber(args[1]);
  const len = toNumber(args[2]);
  // IGCSE SUBSTRING is 1-based
  return mkString(str.substring(start - 1, start - 1 + len));
});

builtins.set('RANDOM', (_args) => {
  return mkReal(Math.random());
});

builtins.set('ROUND', (args) => {
  if (args.length < 1 || args.length > 2) throw new RuntimeError('ROUND expects 1 or 2 arguments');
  const num = toNumber(args[0]);
  const places = args.length === 2 ? toNumber(args[1]) : 0;
  const factor = Math.pow(10, places);
  return mkReal(Math.round(num * factor) / factor);
});

builtins.set('INT', (args) => {
  if (args.length !== 1) throw new RuntimeError('INT expects 1 argument');
  return mkInteger(Math.trunc(toNumber(args[0])));
});

builtins.set('NUM_TO_STRING', (args) => {
  if (args.length !== 1) throw new RuntimeError('NUM_TO_STRING expects 1 argument');
  return mkString(String(toNumber(args[0])));
});

builtins.set('STRING_TO_NUM', (args) => {
  if (args.length !== 1) throw new RuntimeError('STRING_TO_NUM expects 1 argument');
  const n = Number(toString(args[0]));
  if (isNaN(n)) throw new RuntimeError(`Cannot convert '${toString(args[0])}' to a number`);
  return Number.isInteger(n) ? mkInteger(n) : mkReal(n);
});

builtins.set('ASC', (args) => {
  if (args.length !== 1) throw new RuntimeError('ASC expects 1 argument');
  const s = toString(args[0]);
  if (s.length === 0) throw new RuntimeError('ASC expects a non-empty string');
  return mkInteger(s.charCodeAt(0));
});

builtins.set('CHR', (args) => {
  if (args.length !== 1) throw new RuntimeError('CHR expects 1 argument');
  return mkChar(String.fromCharCode(toNumber(args[0])));
});

builtins.set('MID', (args) => {
  if (args.length !== 3) throw new RuntimeError('MID expects 3 arguments (string, start, length)');
  const str = toString(args[0]);
  const start = toNumber(args[1]);
  const len = toNumber(args[2]);
  return mkString(str.substring(start - 1, start - 1 + len));
});

builtins.set('LEFT', (args) => {
  if (args.length !== 2) throw new RuntimeError('LEFT expects 2 arguments (string, length)');
  const str = toString(args[0]);
  const len = toNumber(args[1]);
  return mkString(str.substring(0, len));
});

builtins.set('RIGHT', (args) => {
  if (args.length !== 2) throw new RuntimeError('RIGHT expects 2 arguments (string, length)');
  const str = toString(args[0]);
  const len = toNumber(args[1]);
  return mkString(str.substring(str.length - len));
});

builtins.set('IS_NUM', (args) => {
  if (args.length !== 1) throw new RuntimeError('IS_NUM expects 1 argument');
  const s = toString(args[0]);
  return mkBoolean(!isNaN(Number(s)) && s.trim() !== '');
});

export function getBuiltin(name: string): BuiltinFn | undefined {
  return builtins.get(name.toUpperCase());
}

export function registerFileBuiltins(eof: (filename: string) => boolean): void {
  builtins.set('EOF', (args) => {
    if (args.length !== 1) throw new RuntimeError('EOF expects 1 argument (filename)');
    return mkBoolean(eof(toString(args[0])));
  });
}
