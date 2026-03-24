'use client';

import ShareButton from './ShareButton';

const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

interface Props {
  percentage: number;
  topic?: string | null;
}

export default function ExamShareButton({ percentage, topic }: Props) {
  const topicLabel = topic ? ` (${topic})` : '';

  const shareText =
    percentage >= 70
      ? `I just scored ${percentage}%${topicLabel} on IGCSE pseudocode practice. Can you beat me?\n\nFree tool: ${SITE_URL}`
      : `Working through IGCSE pseudocode practice${topicLabel}. This tool is genuinely useful.\n\nFree: ${SITE_URL}`;

  return (
    <ShareButton
      headline="Challenge a friend or send it to your teacher"
      shareText={shareText}
    />
  );
}
