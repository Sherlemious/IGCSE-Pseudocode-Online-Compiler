'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Users, ArrowLeft, BarChart3 } from 'lucide-react';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Props {
  user: User;
}

const NAV = [
  { href: '/admin',          label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare   },
  { href: '/admin/users',    label: 'Users',    icon: Users           },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3       },
];

function Avatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' }) {
  const initials = user.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  const dim = size === 'sm' ? 24 : 32;
  const cls = size === 'sm'
    ? 'w-6 h-6 text-[10px]'
    : 'w-8 h-8 text-xs';

  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name ?? 'Admin'}
        width={dim}
        height={dim}
        className={`${cls} rounded-full object-cover ring-1 ring-border`}
      />
    );
  }
  return (
    <span className={`${cls} rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center ring-1 ring-primary/30`}>
      {initials}
    </span>
  );
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-52 flex-shrink-0 bg-surface border-r border-border h-full">
        <div className="px-4 py-5 border-b border-border">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase">Admin</p>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-pretty">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-dark-text hover:text-light-text hover:bg-border/30'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-border space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-dark-text hover:text-light-text hover:bg-border/30 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to app
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors hover:bg-border/30 group"
          >
            <Avatar user={user} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-light-text truncate group-hover:text-primary transition-colors">
                {user.name ?? 'Admin'}
              </p>
              <p className="text-[10px] text-dark-text/60 truncate">{user.email}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border flex items-stretch h-16">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                active ? 'text-primary' : 'text-dark-text'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
