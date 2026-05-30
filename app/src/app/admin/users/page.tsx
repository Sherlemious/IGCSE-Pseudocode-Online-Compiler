import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
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
        plan: true,
        role: true,
        createdAt: true,
        _count: { select: { progress: true, examAttempts: true } },
      },
      take: 500,
    }),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-light-text">Users</h1>
        <p className="text-sm text-dark-text mt-1">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
      </div>

      <UsersTable users={users} currentAdminRole={session?.user?.role ?? 'STUDENT'} />
    </div>
  );
}
