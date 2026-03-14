import { NextRequest, NextResponse } from 'next/server';
import { gradeSubmission } from '../../../lib/autograder';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { code, inputs, expectedOutput, timeoutMs } = body as {
    code?: unknown;
    inputs?: unknown;
    expectedOutput?: unknown;
    timeoutMs?: unknown;
  };

  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: '`code` is required' }, { status: 400 });
  }
  if (!Array.isArray(inputs) || !inputs.every((i) => typeof i === 'string')) {
    return NextResponse.json({ error: '`inputs` must be an array of strings' }, { status: 400 });
  }
  if (typeof expectedOutput !== 'string') {
    return NextResponse.json({ error: '`expectedOutput` is required' }, { status: 400 });
  }

  const timeout = typeof timeoutMs === 'number' ? Math.min(timeoutMs, 30_000) : 10_000;

  const result = await gradeSubmission(code, inputs as string[], expectedOutput, timeout);
  return NextResponse.json(result);
}
