export interface TocEntry {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

const toc: TocEntry[] = [
  { id: 'general', label: 'General Syntax' },
  {
    id: 'variables',
    label: 'Variables & Types',
    children: [
      { id: 'declaring', label: 'Declaring Variables' },
      { id: 'constants', label: 'Constants' },
      { id: 'data-types', label: 'Data Types' },
    ],
  },
  {
    id: 'io',
    label: 'Input / Output',
    children: [
      { id: 'output', label: 'OUTPUT' },
      { id: 'input', label: 'INPUT' },
    ],
  },
  {
    id: 'arrays',
    label: 'Arrays',
    children: [
      { id: 'arrays-1d', label: '1D Arrays' },
      { id: 'arrays-2d', label: '2D Arrays' },
    ],
  },
  {
    id: 'operators',
    label: 'Operators',
    children: [
      { id: 'arithmetic', label: 'Arithmetic' },
      { id: 'comparison', label: 'Comparison' },
      { id: 'logical', label: 'Logical' },
      { id: 'concatenation', label: 'String Concatenation' },
    ],
  },
  {
    id: 'selection',
    label: 'Selection',
    children: [
      { id: 'if', label: 'IF / ELSE / ELSEIF' },
      { id: 'case', label: 'CASE / OTHERWISE' },
    ],
  },
  {
    id: 'iteration',
    label: 'Iteration',
    children: [
      { id: 'for', label: 'FOR Loop' },
      { id: 'while', label: 'WHILE Loop' },
      { id: 'repeat', label: 'REPEAT Loop' },
    ],
  },
  {
    id: 'subroutines',
    label: 'Procedures & Functions',
    children: [
      { id: 'procedures', label: 'Procedures' },
      { id: 'functions', label: 'Functions' },
    ],
  },
  {
    id: 'builtins',
    label: 'Built-in Functions',
    children: [
      { id: 'string-functions', label: 'String Functions' },
      { id: 'math-functions', label: 'Math Functions' },
      { id: 'type-conversion', label: 'Type Conversion' },
    ],
  },
  {
    id: 'files',
    label: 'File Handling',
    children: [
      { id: 'file-ops', label: 'File Operations' },
      { id: 'file-write', label: 'Writing Files' },
      { id: 'file-read', label: 'Reading Files' },
    ],
  },
  { id: 'patterns', label: 'Common Patterns' },
];

export default toc;
