'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Users, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/admin',          label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare   },
  { href: '/admin/users',    label: 'Users',    icon: Users           },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface border border-border text-dark-text hover:text-light-text transition-colors"
        aria-label="Open menu"
      >
        <Menu size={16} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-52 flex-shrink-0 bg-surface border-r border-border flex flex-col transition-transform duration-200
        md:relative md:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-4 py-5 border-b border-border flex items-center justify-between">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase">Admin</p>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 rounded text-dark-text hover:text-light-text transition-colors"
            aria-label="Close menu"
          >
            <X size={14} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-pretty">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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

        <div className="px-2 py-3 border-t border-border">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-dark-text hover:text-light-text hover:bg-border/30 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to app
          </Link>
        </div>
      </aside>
    </>
  );
}
