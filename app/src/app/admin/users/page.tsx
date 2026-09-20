import { prisma } from '@/shared/db';
import { auth } from '@/modules/auth/auth';
import { AdminPageHeader } from '../_components/adminUi';
import UsersTable from './_components/UsersTable';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Users' };

export default async function AdminUsersPage() {
  const [session, users] = await Promise.all([
    auth(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        planTier: true,
        trialEndsAt: true,
        planUpdatedAt: true,
        planExpiresAt: true,
        legacyCapacity: true,
        paddleCustomerId: true,
        paddleSubscriptionId: true,
        role: true,
        createdAt: true,
        _count: { select: { progress: true, examAttempts: true } },
      },
      take: 500,
    }),
  ]);

  return (
    <div className="space-y-5 max-w-6xl">
      <AdminPageHeader
        title="Users"
        description={`${users.length} registered user${users.length !== 1 ? 's' : ''}`}
      />

      <UsersTable users={users} currentAdminRole={session?.user?.role ?? 'STUDENT'} />
    </div>
  );
}
