'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Users, ArrowLeft } from 'lucide-react';

const NAV = [
  { href: '/admin',          label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare   },
  { href: '/admin/users',    label: 'Users',    icon: Users           },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-52 flex-shrink-0 bg-surface border-r border-border flex flex-col z-40">
      <div className="px-4 py-5 border-b border-border">
        <p className="text-xs font-semibold text-primary tracking-widest uppercase">Admin</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
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

      <div className="px-2 py-3 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-dark-text hover:text-light-text hover:bg-border/30 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to app
        </Link>
      </div>
    </aside>
  );
}
