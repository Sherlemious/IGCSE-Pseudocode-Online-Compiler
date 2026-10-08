import { NextResponse } from 'next/server';
import { FROM_ADDRESS, getResend } from '@/modules/auth/resend';
import { hostToReport } from '@/modules/telemetry/officialHost';
import { recordHostSighting } from '@/modules/telemetry/repo';
import { logger } from '@/shared/lib/logger';
import { clientIp, rateLimit } from '@/shared/lib/rateLimit';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function done() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

function adminRecipients(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

async function notify(host: string) {
  logger.warn('Unofficial compiler deployment', { host });
  const resend = getResend();
  const to = adminRecipients();
  if (!resend || to.length === 0) return;
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Compiler copy hosted at ${host}`,
    text: [
      'A copy of the pseudocode compiler was opened on a site that is not yours.',
      '',
      `Host: ${host}`,
      '',
      'This email is sent once per host. Later visits are counted in Admin → Copies.',
    ].join('\n'),
  });
}

export function OPTIONS() {
  return done();
}

export async function POST(req: Request) {
  const limit = rateLimit(`deployment-notice:${clientIp(req)}`, { limit: 30, windowMs: 10 * 60 * 1000 });
  if (!limit.ok) return done();

  let claimed: unknown;
  try {
    const text = await req.text();
    if (text.length > 500) return done();
    claimed = (JSON.parse(text) as { host?: unknown }).host;
  } catch {
    return done();
  }

  const host = hostToReport(claimed, req.headers.get('origin') ?? req.headers.get('referer'));
  if (!host) return done();

  try {
    // Only the first sighting of a host is worth an email.
    if (!(await recordHostSighting(host))) return done();
  } catch (error) {
    logger.error('Host sighting record failed', { host, error: String(error) });
    return done();
  }

  try {
    await notify(host);
  } catch (error) {
    logger.error('Host sighting email failed', { host, error: String(error) });
  }
  return done();
}
