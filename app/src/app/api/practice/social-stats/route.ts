import { NextResponse } from 'next/server';
import { getQuestionSocialStats, SOCIAL_STATS_REVALIDATE_SECONDS } from '@/modules/practice/loadSocialStats';

// Must be a numeric literal — Next.js rejects imported segment config at build.
export const revalidate = 3600;

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
