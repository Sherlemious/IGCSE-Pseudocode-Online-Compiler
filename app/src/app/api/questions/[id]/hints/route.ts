import { NextRequest, NextResponse } from 'next/server';
import { CATALOG_CACHE_CONTROL, getQuestionHints } from '@/shared/lib/catalogCache';

export const revalidate = 86400;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const hints = await getQuestionHints(id);

    if (!hints) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(
      { hints },
      { headers: { 'Cache-Control': CATALOG_CACHE_CONTROL } },
    );
  } catch (error) {
    console.error('Failed to fetch hints:', error);
    return NextResponse.json({ error: 'Failed to fetch hints' }, { status: 500 });
  }
}
