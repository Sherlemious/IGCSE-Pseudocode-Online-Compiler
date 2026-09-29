import { ALEVEL_COURSE_ID, type LearnCourse } from '../../types';
import { alevel1 } from './level1';
import { alevel2 } from './level2';
import { alevel3 } from './level3';
import { alevel4 } from './level4';
import { alevel5 } from './level5';
import { alevel6 } from './level6';
import { alevel7 } from './level7';
import { alevel8 } from './level8';

export const ALEVEL_9618: LearnCourse = {
  id: ALEVEL_COURSE_ID,
  basePath: '/learn/9618',
  kicker: 'AS & A Level 9618 · Paper 2 and Paper 4',
  title: 'AS & A Level Path',
  subtitle:
    'Eight levels for Cambridge 9618, for someone who can already write IGCSE pseudocode. Records, CASE ranges, BYREF, random files, then the Paper 4 structures: pointers, stacks, queues, lists, trees and classes.',
  completeNote:
    'All eight levels done. The next step is a Paper 4 question on paper — an ADT or a class, with the same syntax and no Check button.',
  otherPath: {
    href: '/learn',
    label: 'New to Cambridge pseudocode? The IGCSE Paper 2 path starts from OUTPUT.',
  },
  levels: [alevel1, alevel2, alevel3, alevel4, alevel5, alevel6, alevel7, alevel8],
};
