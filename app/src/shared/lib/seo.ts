export const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

export const SITE_NAME = 'Cambridge IGCSE & A Level Pseudocode Compiler';

// Single source of truth for the public support/contact address. A monitored
// inbox on the sherlemious.com domain (Paddle may email this during verification).
export const SUPPORT_EMAIL = 'sherlemious@sherlemious.com';

export const DEFAULT_TITLE = 'Pseudocode Compiler Online | IGCSE 0478 & A Level 9618 Editor';

export const DEFAULT_DESCRIPTION =
  'Free online pseudocode compiler, editor and runner for Cambridge IGCSE 0478 and A Level 9618. Run and check code in the browser, dry-run with trace tables, and practise past-paper questions.';

/** 1:1 card. WhatsApp (and Classroom / Teams) crop anything else into a stamp. */
export const SHARE_IMAGE = {
  url: `${SITE_URL}/og.png`,
  secureUrl: `${SITE_URL}/og.png`,
  width: 1200,
  height: 1200,
  alt: SITE_NAME,
  type: 'image/png',
} as const;

/** 1.91:1 card for Twitter / LinkedIn large previews. */
export const SHARE_IMAGE_WIDE = {
  url: `${SITE_URL}/og-wide.png`,
  secureUrl: `${SITE_URL}/og-wide.png`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
  type: 'image/png',
} as const;

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
  'online pseudocode compiler',
  'pseudocode compiler online',
  'pseudocode interpreter',
  'pseudocode online',
  'run pseudocode',
  'where to run pseudocode',
  'pseudocode editor',
  'pseudocode editor online',
  'online pseudocode editor',
  'pseudocode runner',
  'cambridge pseudocode guide',
  'igcse pseudocode guide',
  '0478 pseudocode guide',
  'cambridge 9618 pseudocode guide',
  'cie pseudocode guide',
  'a level pseudocode guide',
  'DIV in pseudocode',
  'how to declare a constant in pseudocode',
  'not equal to in pseudocode',
  'how to round in pseudocode',
  'pseudocode checker',
  'pseudocode tester',
  'pseudocode simulator',
  'pseudocode translator',
  'pseudocode to Python',
  'pseudocode to flowchart',
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
  'cambridge o level pseudocode tutorial',
  'pseudocode tutorial for cambridge o level',
  'o level 2210 pseudocode tutorial',
  '2210 computer science pseudocode',
  'igcse 0478 pseudocode tutorial',
  'cambridge o level computer science 2210 tutorial',
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
  'best IGCSE pseudocode compiler',
  'IGCSE Computer Science Paper 2',
  'Cambridge Paper 2 practice',
  'autograded pseudocode',
  'hidden test cases',
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
  'India',
  'Maldives',
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
