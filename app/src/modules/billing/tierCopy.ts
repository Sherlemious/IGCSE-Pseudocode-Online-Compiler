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
    features: ['Unlimited saved solutions', 'Full practice + exam library', 'Personal progress analytics'],
  },
  starter: {
    name: 'Starter',
    description: 'One teacher, a real class — your students get the full library',
    features: [
      'Every student in your class unlocks premium practice & exams',
      'Roster: up to 3 classes, 30 students each',
      'Assignments with autograding',
      'Share a join link — students do not pay',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For teachers running several classes',
    features: [
      'Everything in Starter, including student premium access',
      'Unlimited classes and students',
      'Progress analytics',
      'Priority support',
    ],
  },
  advanced: {
    name: 'Advanced',
    description: 'For departments & schools',
    features: [
      'Everything in Pro',
      'Multiple teachers',
      'School-wide analytics',
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
