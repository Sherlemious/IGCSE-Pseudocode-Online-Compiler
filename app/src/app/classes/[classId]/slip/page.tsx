import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { SITE_URL } from '@/shared/lib/seo';
import { findClassSummary } from '@/modules/classes/repo';
import { qrSvg } from '@/modules/classes/qrCode';
import JoinSlip from '@/modules/classes/JoinSlip';

export const metadata: Metadata = {
  title: 'Join slip',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ classId: string }>;
}

export default async function JoinSlipPage({ params }: Props) {
  const session = await auth();
  const { classId } = await params;
  if (!session?.user?.id) redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/classes/${classId}/slip`)}`);

  const cls = await findClassSummary(classId);
  if (!cls || cls.archived || cls.ownerId !== session.user.id) notFound();

  const joinUrl = `${SITE_URL}/c/${cls.joinCode}`;
  let qr = '';
  try {
    qr = qrSvg(joinUrl);
  } catch {
    qr = '';
  }

  return <JoinSlip classId={classId} name={cls.name} joinCode={cls.joinCode} joinUrl={joinUrl} qr={qr} />;
}
