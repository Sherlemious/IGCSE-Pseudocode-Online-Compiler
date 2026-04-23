import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import AdminSidebar from './_components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email) redirect('/auth/signin');
  if (!isAdmin(session.user.email)) redirect('/');

  return (
    <div className="min-h-screen bg-background text-light-text">
      <AdminSidebar />
      <main className="ml-52 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
