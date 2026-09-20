import { NextResponse } from 'next/server';
import { getQuestionSocialStats, SOCIAL_STATS_REVALIDATE_SECONDS } from '@/modules/practice/loadSocialStats';

export const revalidate = SOCIAL_STATS_REVALIDATE_SECONDS;

export async function GET() {
  try {
    const stats = await getQuestionSocialStats();
    return NextResponse.json(
      { stats },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${SOCIAL_STATS_REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
        },
      },
    );
  } catch (error) {
    console.error('Failed to load practice social stats:', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
