import { NextResponse } from 'next/server';
import { CATALOG_CACHE_CONTROL, getExampleCategories } from '@/shared/lib/catalogCache';

export const revalidate = 86400;

export async function GET() {
  try {
    const categories = await getExampleCategories();
    return NextResponse.json(
      { categories },
      { headers: { 'Cache-Control': CATALOG_CACHE_CONTROL } },
    );
  } catch (error) {
    console.error('Failed to fetch examples:', error);
    return NextResponse.json({ error: 'Failed to fetch examples' }, { status: 500 });
  }
}
