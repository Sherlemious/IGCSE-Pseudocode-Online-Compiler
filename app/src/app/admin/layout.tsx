import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import AdminSidebar from './_components/AdminSidebar';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email) redirect('/auth/signin');
  if (!isAdmin(session.user.email, session.user.role)) redirect('/');

  return (
    <div className="flex h-screen overflow-hidden bg-background text-light-text">
      <AdminSidebar user={{ name: session.user.name, email: session.user.email, image: session.user.image }} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 scrollbar-pretty">
        {children}
      </main>
    </div>
  );
}
