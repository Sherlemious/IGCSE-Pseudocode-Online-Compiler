import { NextResponse } from 'next/server';

export async function POST() {
  // Intentionally disabled while running Google-only auth.
  return NextResponse.json(
    { error: 'Email/password signup is currently disabled. Please continue with Google.' },
    { status: 403 }
  );
}
