import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  parseCustomColors,
  parseThemeName,
  MAX_NAME_LEN,
} from '@/lib/themeValidation';

interface Context {
  params: Promise<{ id: string }>;
}

// PATCH /api/themes/[id] — rename and/or recolour an existing theme
export async function PATCH(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.customTheme.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
  }

  const body = (await req.json()) as { name?: unknown; colors?: unknown };
  const data: { name?: string; colors?: string } = {};

  if (body.name !== undefined) {
    const name = parseThemeName(body.name);
    if (!name) {
      return NextResponse.json({ error: `Name must be 1–${MAX_NAME_LEN} characters` }, { status: 422 });
    }
    data.name = name;
  }

  if (body.colors !== undefined) {
    const colors = parseCustomColors(body.colors);
    if (!colors) {
      return NextResponse.json({ error: 'Invalid theme colours' }, { status: 422 });
    }
    data.colors = JSON.stringify(colors);
  }

  if (data.name === undefined && data.colors === undefined) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const updated = await prisma.customTheme.update({
    where: { id },
    data,
    select: { id: true, name: true, colors: true },
  });

  return NextResponse.json({
    theme: {
      id: updated.id,
      name: updated.name,
      colors: parseCustomColors(JSON.parse(updated.colors) as unknown),
    },
  });
}

// DELETE /api/themes/[id] — remove a theme
export async function DELETE(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.customTheme.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
  }

  await prisma.customTheme.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
