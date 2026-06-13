import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  parseCustomColors,
  parseThemeName,
  MAX_THEMES,
  MAX_NAME_LEN,
} from '@/lib/themeValidation';
import type { CustomColors } from '@/theme/themes';

interface SerializedTheme {
  id: string;
  name: string;
  colors: CustomColors;
}

function serialize(row: { id: string; name: string; colors: string }): SerializedTheme | null {
  const colors = parseCustomColors(JSON.parse(row.colors) as unknown);
  if (!colors) return null;
  return { id: row.id, name: row.name, colors };
}

// GET /api/themes — list the current user's saved custom themes
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await prisma.customTheme.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, colors: true },
  });

  const themes = rows
    .map(serialize)
    .filter((t): t is SerializedTheme => t !== null);

  return NextResponse.json({ themes });
}

// POST /api/themes — create a new custom theme
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as { name?: unknown; colors?: unknown };
  const name = parseThemeName(body.name);
  const colors = parseCustomColors(body.colors);

  if (!name) {
    return NextResponse.json({ error: `Name must be 1–${MAX_NAME_LEN} characters` }, { status: 422 });
  }
  if (!colors) {
    return NextResponse.json({ error: 'Invalid theme colours' }, { status: 422 });
  }

  const count = await prisma.customTheme.count({ where: { userId: session.user.id } });
  if (count >= MAX_THEMES) {
    return NextResponse.json(
      { error: `You can store at most ${MAX_THEMES} themes` },
      { status: 409 },
    );
  }

  const created = await prisma.customTheme.create({
    data: { userId: session.user.id, name, colors: JSON.stringify(colors) },
    select: { id: true, name: true, colors: true },
  });

  return NextResponse.json({ theme: { id: created.id, name: created.name, colors } });
}
