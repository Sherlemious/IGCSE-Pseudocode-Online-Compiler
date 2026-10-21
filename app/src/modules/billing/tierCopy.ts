/**
 * Marketing copy for /pricing cards. Kept in code so a deploy updates the page
 * immediately (the PricingTier table is cached, and is the source of Paddle IDs).
 * `prisma/seedPricing.ts` upserts the same strings into the DB.
 *
 * Every paid teacher band includes the same teaching tools. Seat count is the
 * only difference, and that is shown on the cards — not repeated here.
 */
export const PAID_TEACHER_INCLUDED = {
  students: [
    'Full practice library, including premium questions',
    'Timed exams',
    'Paper 2 Path, every level',
    'A join link is enough — no student checkout',
  ],
  teaching: [
    'Your own autograded questions, with hidden tests',
    'Assign homework from the question bank, with a due date',
    'Hidden tests mark the work, and you see who has submitted',
    'Roster: questions solved, last activity, and assignments done',
    'Each student’s report card, Paper 2 Path, assigned work, and latest code',
  ],
} as const;

export const TIER_COPY: Record<
  string,
  { name: string; description: string; features: string[] }
> = {
  student: {
    name: 'Student',
    description: 'Monthly access while you practise on your own',
    features: [
      'Full practice + exam library',
      'Unlimited saved solutions',
      'Personal progress analytics',
      'Cancel anytime — billed monthly',
    ],
  },
  starter: {
    name: 'Starter',
    description: 'One teacher, a real class — your students get the full library',
    features: [
      ...PAID_TEACHER_INCLUDED.students,
      ...PAID_TEACHER_INCLUDED.teaching,
      'Up to 3 classes, 30 students in total',
    ],
  },
  pro: {
    name: 'Classroom',
    description: 'Several classes, up to 90 students',
    features: [
      'Everything in Starter, including student premium access',
      'Up to 6 classes, 90 students in total',
      'Progress analytics',
      'Priority support',
    ],
  },
  classroom: {
    name: 'Classroom',
    description: 'Several classes, up to 90 students',
    features: [
      'Everything in Starter, including student premium access',
      'Up to 6 classes, 90 students in total',
      'Progress analytics',
      'Priority support',
    ],
  },
  department: {
    name: 'Department',
    description: 'A department running many classes',
    features: [
      'Everything in Classroom',
      'Up to 15 classes, 250 students in total',
      'Progress analytics',
      'Priority support',
    ],
  },
  school: {
    name: 'School',
    description: 'Whole-school seat capacity',
    features: [
      'Everything in Department',
      'Up to 40 classes, 750 students in total',
      'School-wide analytics',
      'Onboarding help',
    ],
  },
  advanced: {
    name: 'Campus',
    description: 'For large schools that need unlimited seats',
    features: [
      'Everything in School',
      'Unlimited classes and students',
      'Multiple teachers',
      'Onboarding help',
    ],
  },
  campus: {
    name: 'Campus',
    description: 'For large schools that need unlimited seats',
    features: [
      'Everything in School',
      'Unlimited classes and students',
      'Multiple teachers',
      'Onboarding help',
    ],
  },
};

export function displayTier(row: {
  slug: string;
  name: string;
  description: string;
  features: string[];
}) {
  const copy = TIER_COPY[row.slug];
  return {
    name: copy?.name ?? row.name,
    description: copy?.description ?? row.description,
    features: copy?.features ?? row.features,
  };
}
