'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Users, ArrowLeft, BarChart3, Bug, Mail, Route, Radar, Menu, X } from 'lucide-react';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Props {
  user: User;
}

const NAV = [
  { href: '/admin',           label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/feedback',  label: 'Feedback',  icon: MessageSquare   },
  { href: '/admin/bugs',      label: 'Bugs',      icon: Bug             },
  { href: '/admin/contact',   label: 'Contact',   icon: Mail            },
  { href: '/admin/copies',    label: 'Copies',    icon: Radar           },
  { href: '/admin/users',     label: 'Users',     icon: Users           },
  { href: '/admin/learn',     label: 'Path',      icon: Route           },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3       },
];

function navActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

function currentLabel(pathname: string) {
  const match = [...NAV].reverse().find(({ href }) => navActive(pathname, href));
  return match?.label ?? 'Admin';
}

function Avatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' }) {
  const initials = user.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  const dim = size === 'sm' ? 24 : 32;
  const cls = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs';

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

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-pretty">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = navActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 px-3 py-2.5 md:py-2 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-dark-text hover:text-light-text hover:bg-border/30'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  return (
    <div className="px-2 py-3 border-t border-border space-y-0.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-3 py-2.5 md:py-2 rounded-lg text-sm text-dark-text hover:text-light-text hover:bg-border/30 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to app
      </Link>

      <Link
        href="/admin/analytics"
        onClick={onNavigate}
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
  );
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-52 flex-shrink-0 bg-surface border-r border-border h-full">
        <div className="px-4 py-5 border-b border-border">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase">Admin</p>
        </div>
        <NavLinks pathname={pathname} />
        <SidebarFooter user={user} />
      </aside>

      {/* ── Mobile top bar ── */}
      <header
        className="md:hidden shrink-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="h-12 px-3 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="p-1.5 -ml-1 rounded-lg text-light-text hover:bg-border/40 transition-colors"
            aria-label="Open admin menu"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-primary tracking-widest uppercase leading-none">Admin</p>
            <p className="text-sm font-semibold text-light-text truncate leading-tight mt-0.5">
              {currentLabel(pathname)}
            </p>
          </div>
          <Avatar user={user} size="sm" />
        </div>
      </header>

      {/* ── Mobile nav sheet ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/55 admin-overlay"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 w-[min(18.5rem,88vw)] bg-surface border-r border-border shadow-intense flex flex-col admin-nav-panel"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="px-4 h-12 flex items-center justify-between border-b border-border">
              <p className="text-xs font-semibold text-primary tracking-widest uppercase">Admin</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1.5 -mr-1 rounded-lg text-dark-text hover:text-light-text hover:bg-border/40 transition-colors"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            <SidebarFooter user={user} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
