/** Starter flowcharts for the builder's Examples menu, kept as pseudocode and drawn on demand. */
export const FLOWCHART_EXAMPLES: { id: string; title: string; code: string }[] = [
  {
    id: 'larger',
    title: 'Larger of two numbers (selection)',
    code: ['INPUT A', 'INPUT B', 'IF A > B THEN', '    OUTPUT A', 'ELSE', '    OUTPUT B', 'ENDIF'].join('\n'),
  },
  {
    id: 'total',
    title: 'Total of 5 marks (count-controlled loop)',
    code: [
      'Total ← 0',
      'FOR Count ← 1 TO 5',
      '    INPUT Mark',
      '    Total ← Total + Mark',
      'NEXT Count',
      'OUTPUT "Total: ", Total',
    ].join('\n'),
  },
  {
    id: 'validate',
    title: 'Validate a mark (REPEAT … UNTIL)',
    code: ['REPEAT', '    INPUT Mark', 'UNTIL Mark >= 0 AND Mark <= 100', 'OUTPUT "Accepted ", Mark'].join('\n'),
  },
  {
    id: 'countdown',
    title: 'Countdown (WHILE loop)',
    code: ['INPUT Number', 'WHILE Number > 0', '    OUTPUT Number', '    Number ← Number - 1', 'ENDWHILE', 'OUTPUT "Lift off"'].join(
      '\n',
    ),
  },
  {
    id: 'grade',
    title: 'Grade a mark (nested IF)',
    code: [
      'INPUT Mark',
      'IF Mark >= 70 THEN',
      '    OUTPUT "Distinction"',
      'ELSE',
      '    IF Mark >= 50 THEN',
      '        OUTPUT "Pass"',
      '    ELSE',
      '        OUTPUT "Fail"',
      '    ENDIF',
      'ENDIF',
    ].join('\n'),
  },
];
