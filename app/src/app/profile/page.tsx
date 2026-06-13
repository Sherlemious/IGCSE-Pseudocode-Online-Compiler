import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { User, Crown, Shield, GraduationCap, BarChart3, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import ProfileNameEditor from './_components/ProfileNameEditor';
import ThemeManager from './_components/ThemeManager';

export const metadata: Metadata = { title: 'Profile' };

const ROLE_CONFIG = {
  ADMIN:   { label: 'Admin',   className: 'text-error border-error/40 bg-error/10',       Icon: Shield },
  TEACHER: { label: 'Teacher', className: 'text-primary border-primary/40 bg-primary/10', Icon: GraduationCap },
  STUDENT: { label: 'Student', className: 'text-dark-text border-border bg-border/20',    Icon: User },
} as const;

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, plan: true, role: true, createdAt: true },
  });
  if (!user) redirect('/auth/signin');

  const isAdminUser = user.role === 'ADMIN';
  const isPremium = user.plan === 'PREMIUM';
  const roleKey = user.role as keyof typeof ROLE_CONFIG;
  const roleConf = ROLE_CONFIG[roleKey] ?? ROLE_CONFIG.STUDENT;
  const RoleIcon = roleConf.Icon;

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-sm mx-auto relative space-y-4 animate-fade-in-up">
        {/* Avatar + identity card */}
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center gap-3 text-center">
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={64}
              height={64}
              className="w-16 h-16 rounded-full border border-border"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={28} className="text-primary" />
            </div>
          )}

          <div>
            <h1 className="text-lg font-bold text-light-text">{user.name ?? 'User'}</h1>
            <p className="text-xs text-dark-text mt-0.5">{user.email}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${roleConf.className}`}>
              <RoleIcon size={9} />
              {roleConf.label}
            </span>
            {isPremium ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border border-warning/40 bg-warning/10 text-warning">
                <Crown size={9} />
                PREMIUM
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-border bg-border/20 text-dark-text">
                FREE
              </span>
            )}
          </div>
        </div>

        {/* Admin access — prominent for admins */}
        {isAdminUser && (
          <Link
            href="/admin"
            className="group flex items-center gap-3.5 rounded-xl border border-error/30 bg-error/10 px-5 py-4 hover:bg-error/15 transition-colors"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-error/15 text-error shrink-0">
              <LayoutDashboard size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-error leading-tight">Admin Dashboard</span>
              <span className="block text-xs text-error/70 leading-tight mt-0.5">Manage users, feedback &amp; analytics</span>
            </span>
            <ChevronRight size={16} className="text-error/60 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Edit name */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-xs font-semibold text-light-text mb-3">Edit Profile</h2>
          <ProfileNameEditor currentName={user.name ?? ''} />
        </div>

        {/* Custom themes */}
        <ThemeManager />

        {/* Quick actions */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            <Link
              href="/analytics"
              className="flex items-center gap-3 px-5 py-3.5 text-sm text-dark-text hover:text-light-text hover:bg-background transition-colors"
            >
              <BarChart3 size={15} />
              My Analytics
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-dark-text hover:text-light-text hover:bg-background transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-dark-text/40">
          Member since{' '}
          {user.createdAt.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
