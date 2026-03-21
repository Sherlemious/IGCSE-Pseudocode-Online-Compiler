import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const revalidate = 3600; // Re-fetch from DB every hour

export async function GET() {
  try {
    const examples = await prisma.example.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      select: { id: true, title: true, category: true, code: true },
    });

    // Group by category
    const grouped = new Map<string, { id: string; title: string; code: string }[]>();
    for (const ex of examples) {
      if (!grouped.has(ex.category)) grouped.set(ex.category, []);
      grouped.get(ex.category)!.push({ id: ex.id, title: ex.title, code: ex.code });
    }

    const categories = Array.from(grouped.entries()).map(([name, exs]) => ({
      name,
      examples: exs,
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Failed to fetch examples:', error);
    return NextResponse.json({ error: 'Failed to fetch examples' }, { status: 500 });
  }
}
