import { convertToFlowchart } from '@/modules/interpreter/converters/flowchartConverter';
import {
  blankAnswers,
  docFromConversion,
  fillBlanks,
  makeTemplate,
  starterFlowchart,
  type FlowchartDoc,
} from '@/modules/interpreter/converters/flowchartDoc';
import type { LearnLesson } from './types';

function solutionDoc(lesson: LearnLesson): FlowchartDoc {
  return docFromConversion(convertToFlowchart(lesson.solutionCode ?? '', { fullLabels: true }));
}

/** The canvas a flowchart lesson starts on: a fill-in template, or START → STOP. */
export function lessonFlowchartStart(lesson: LearnLesson): FlowchartDoc {
  if (!lesson.flowchartBlanks?.length) return starterFlowchart();
  return makeTemplate(solutionDoc(lesson), lesson.flowchartBlanks);
}

/** The model answer as the student would submit it (tests: solution must pass). */
export function lessonFlowchartSolution(lesson: LearnLesson): FlowchartDoc {
  const full = solutionDoc(lesson);
  if (!lesson.flowchartBlanks?.length) return full;
  const template = makeTemplate(full, lesson.flowchartBlanks);
  return fillBlanks(template, blankAnswers(full, template));
}
