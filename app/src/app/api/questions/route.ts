import { NextResponse } from 'next/server';
import { CATALOG_CACHE_CONTROL, getQuestionsApiPayload } from '@/shared/lib/catalogCache';

export const revalidate = 3600;

export async function GET() {
  try {
    const questions = await getQuestionsApiPayload({});
    return NextResponse.json(
      { questions },
      { headers: { 'Cache-Control': CATALOG_CACHE_CONTROL } },
    );
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
