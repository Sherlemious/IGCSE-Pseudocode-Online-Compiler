/** Shared built-in function signatures for typo hints and editor autocomplete. */

export const BUILTIN_SIGNATURES: Record<string, string> = {
  LENGTH: 'LENGTH(str)',
  LCASE: 'LCASE(str)',
  UCASE: 'UCASE(str)',
  SUBSTRING: 'SUBSTRING(str, startPos, length)  // 1-based',
  MID: 'MID(str, startPos, length)         // 1-based',
  LEFT: 'LEFT(str, length)',
  RIGHT: 'RIGHT(str, length)',
  ROUND: 'ROUND(num)  or  ROUND(num, decimalPlaces)',
  INT: 'INT(num)',
  RANDOM: 'RANDOM()',
  NUM_TO_STRING: 'NUM_TO_STRING(num)',
  STRING_TO_NUM: 'STRING_TO_NUM(str)',
  ASC: 'ASC(char)',
  CHR: 'CHR(asciiCode)',
  IS_NUM: 'IS_NUM(str)',
  EOF: 'EOF(filename)',
  RAND: 'RAND(x)  // random real from 0 up to x',
};

export const BUILTIN_NAMES = Object.keys(BUILTIN_SIGNATURES);
