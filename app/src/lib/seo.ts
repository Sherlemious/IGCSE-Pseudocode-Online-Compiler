export const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

export const SITE_NAME = 'Cambridge IGCSE & A Level Pseudocode Compiler';

export const DEFAULT_TITLE = 'Cambridge IGCSE & A Level Pseudocode Compiler | Online Editor';

export const DEFAULT_DESCRIPTION =
  'Write and run Cambridge IGCSE, O Level and AS & A Level pseudocode in your browser. Instant output, trace tables and timed past-paper practice — free.';

export const SEO_KEYWORDS = [
  '0478',
  '0984',
  '2210',
  '9618',
  'IGCSE',
  'IGCSE 9-1',
  'O Level',
  'Cambridge IGCSE',
  'Cambridge O Level',
  'CIE',
  'A Level',
  'A-Level',
  'AS Level',
  'AS & A Level',
  'Cambridge A Level',
  'Cambridge A-Level',
  'Cambridge International AS & A Level',
  'Cambridge International AS Level',
  'Cambridge International A Level',
  'Computer Science',
  'IGCSE Computer Science',
  'O Level Computer Science',
  'A Level Computer Science',
  'AS & A Level Computer Science',
  'Cambridge A Level Computer Science',
  'Cambridge International AS & A Level Computer Science',
  '9618 Computer Science',
  'Cambridge 9618',
  'A Level pseudocode',
  'AS & A Level pseudocode',
  'pseudocode A Level',
  'pseudocode 9618',
  'AS Level pseudocode',
  '9618 pseudocode guide',
  '2026 Pseudocode Guide',
  '2027 2029 Pseudocode Guide',
  'pseudocode',
  'pseudo code',
  'pseudo-code',
  'pseudocode compiler',
  'pseudocode interpreter',
  'pseudocode online',
  'run pseudocode',
  'pseudocode editor',
  'pseudocode runner',
  'pseudocode checker',
  'pseudocode tester',
  'pseudocode simulator',
  'pseudocode translator',
  'pseudocode to Python',
  'pseudocode to flowchart',
  'flowchart maker',
  'draw flowchart from pseudocode',
  'flowchart to pseudocode',
  'pseudocode to code',
  'convert pseudocode',
  'pseudocode converter',
  'translate pseudocode',
  'algorithm',
  'flowchart',
  'trace table',
  'trace tables',
  'pseudocode trace table',
  'Cambridge trace table',
  'dry run',
  'pseudocode algorithm',
  'pseudocode examples',
  'pseudocode syntax',
  'Cambridge pseudocode syntax',
  'pseudocode arrays',
  'pseudocode functions',
  'pseudocode procedures',
  'pseudocode file handling',
  'pseudocode INPUT OUTPUT',
  'pseudocode IF ELSE',
  'pseudocode FOR loop',
  'pseudocode WHILE loop',
  'pseudocode REPEAT UNTIL',
  'pseudocode CASE OF',
  'pseudocode DECLARE',
  'pseudocode INTEGER REAL STRING BOOLEAN',
  'pseudocode classes',
  'pseudocode OOP',
  'pseudocode object oriented programming',
  'A Level pseudocode classes',
  'Cambridge 9618 classes',
  'pseudocode inheritance',
  'pseudocode practice questions',
  'pseudocode past paper questions',
  'pseudocode exam simulator',
  'timed pseudocode exam',
  'practice pseudocode exam',
  'pseudocode autograder',
  'pseudocode autograding',
  'pseudocode test cases',
  'IGCSE CS practice questions',
  'IGCSE computer science past papers',
  'A Level Computer Science past papers',
  'learn pseudocode',
  'IGCSE revision',
  'IGCSE practice',
  'IGCSE past papers',
  'Cambridge past papers',
  'IGCSE CS revision',
  'computer science revision',
  'pseudocode help',
  'pseudocode tutorial',
  'pseudocode for beginners',
  'free pseudocode compiler',
  'online pseudocode IDE',
  'browser pseudocode',
  'no install pseudocode',
  'pseudocode without Python',
  'dyslexia friendly pseudocode',
  'dyslexic friendly code editor',
  'OpenDyslexic pseudocode editor',
  'pseudocode progress analytics',
  'pseudocode learning analytics',
  'Egypt',
  'IGCSE Egypt',
  'Cambridge Egypt',
  'UAE',
  'Saudi Arabia',
  'Pakistan',
  'Nigeria',
  'Kenya',
  'international school',
] as const;

const MARKDOWN_LINK = /\[([^\]]+)\]\([^)]+\)/g;
const MARKDOWN_SYNTAX = /[`*_>#~|-]/g;
const WHITESPACE = /\s+/g;

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function stripMarkdown(value: string) {
  return value
    .replace(MARKDOWN_LINK, '$1')
    .replace(MARKDOWN_SYNTAX, ' ')
    .replace(WHITESPACE, ' ')
    .trim();
}

export function truncateDescription(value: string, maxLength = 155) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}.`;
}

export function paperReference(question: {
  year?: number | null;
  session?: string | null;
  variant?: number | null;
  questionNumber?: number | null;
  part?: string | null;
  paper?: string | null;
}) {
  if (!question.year) return question.paper ?? null;

  return [
    question.year,
    question.session,
    question.variant ? `Variant ${question.variant}` : null,
    question.questionNumber ? `Q${question.questionNumber}${question.part ? `(${question.part})` : ''}` : null,
  ]
    .filter(Boolean)
    .join(' ');
}
