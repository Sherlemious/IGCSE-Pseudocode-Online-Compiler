import { NextRequest, NextResponse } from 'next/server';
import { CATALOG_CACHE_CONTROL, getPublicQuestion } from '@/shared/lib/catalogCache';

export const revalidate = 86400;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const question = await getPublicQuestion(id);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(
      { question },
      { headers: { 'Cache-Control': CATALOG_CACHE_CONTROL } },
    );
  } catch (error) {
    console.error('Failed to fetch question:', error);
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}
