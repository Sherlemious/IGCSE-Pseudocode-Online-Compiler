import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json() as {
      errorType?: unknown;
      errorMessage?: unknown;
      line?: unknown;
      codeLines?: unknown;
    };

    const errorType = typeof body.errorType === 'string' ? body.errorType : null;
    const errorMessage = typeof body.errorMessage === 'string' ? body.errorMessage : null;
    const codeLines = typeof body.codeLines === 'number' ? body.codeLines : null;

    if (!errorType || !errorMessage || codeLines === null) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const line = typeof body.line === 'number' ? body.line : null;

    await prisma.errorLog.create({
      data: {
        userId: session?.user?.id ?? null,
        email: session?.user?.email ?? null,
        errorType,
        errorMessage,
        line,
        codeLines,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
