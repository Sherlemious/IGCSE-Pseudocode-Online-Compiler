'use client';

import SolveCountChip from './SolveCountChip';
import { useQuestionSocialStats } from './usePracticeSocialProof';

export default function QuestionSolveCount({ questionId }: { questionId: string }) {
  const stats = useQuestionSocialStats();
  const stat = stats.get(questionId);
  if (!stat) return null;
  return <SolveCountChip stat={stat} />;
}
