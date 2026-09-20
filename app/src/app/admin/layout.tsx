import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { isAdmin } from '@/modules/admin/isAdmin';
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
    <div className="flex h-dvh flex-col md:flex-row overflow-hidden bg-background text-light-text">
      <AdminSidebar user={{ name: session.user.name, email: session.user.email, image: session.user.image }} />
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 md:p-8 scrollbar-pretty">
        {children}
      </main>
    </div>
  );
}
