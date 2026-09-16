/**
 * Marketing copy for /pricing cards. Kept in code so a deploy updates the page
 * immediately (the PricingTier table is cached, and is the source of Paddle IDs).
 * `prisma/seedPricing.ts` upserts the same strings into the DB.
 */
export const TIER_COPY: Record<
  string,
  { name: string; description: string; features: string[] }
> = {
  student: {
    name: 'Student',
    description: 'For students practising on their own',
    features: [
      'Paper 2 Path (10 levels)',
      'Unlimited saved solutions',
      'Full practice + exam library',
      'Personal progress analytics',
    ],
  },
  starter: {
    name: 'Starter',
    description: 'One teacher, a real class — your students get the full library',
    features: [
      'Every student in your class unlocks premium practice & exams',
      'Up to 3 classes, 30 students in total',
      'Assignments with autograding',
      'Share a join link — students do not pay',
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
