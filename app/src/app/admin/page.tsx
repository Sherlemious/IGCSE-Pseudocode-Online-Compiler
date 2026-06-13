import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
  Users, MessageSquare, BookOpen, BookOpenCheck,
  BarChart3, ArrowUpRight, ArrowRight,
} from 'lucide-react';
import { Panel, SectionHeading } from './analytics/_components/charts';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Overview' };

export default async function AdminOverviewPage() {
  const [session, userCount, feedbackCount, examCount, questionCount, feedbackAgg, recentFeedback, recentUsers] =
    await Promise.all([
      auth(),
      prisma.user.count(),
      prisma.feedbackSubmission.count(),
      prisma.examAttempt.count(),
      prisma.question.count(),
      prisma.feedbackSubmission.aggregate({ _avg: { rating: true } }),
      prisma.feedbackSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, rating: true, tier: true, email: true, comment: true, createdAt: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
      }),
    ]);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Admin';
  const avgRating = feedbackAgg._avg.rating;

  const stats = [
    { label: 'Total users',    value: userCount,     icon: Users,         color: 'text-primary', tint: 'bg-primary/10', href: '/admin/users',     cta: 'Manage users' },
    { label: 'Feedback items', value: feedbackCount, icon: MessageSquare, color: 'text-success', tint: 'bg-success/10', href: '/admin/feedback',  cta: 'Read feedback' },
    { label: 'Exam attempts',  value: examCount,     icon: BookOpen,      color: 'text-warning', tint: 'bg-warning/10', href: '/admin/analytics', cta: 'View analytics' },
    { label: 'Questions',      value: questionCount, icon: BookOpenCheck, color: 'text-error',   tint: 'bg-error/10',   href: '/admin/analytics', cta: 'View analytics' },
  ];

  const navCards = [
    { title: 'Users',     desc: 'Roles, plans & activity',       icon: Users,         href: '/admin/users' },
    { title: 'Feedback',  desc: 'Ratings & comments',            icon: MessageSquare, href: '/admin/feedback' },
    { title: 'Analytics', desc: 'Growth & learning insights',    icon: BarChart3,     href: '/admin/analytics' },
  ];

  return (
    <div className="max-w-6xl stagger-children space-y-6">
      {/* ── Hero ── */}
      <header className="card-glow bg-dot-grid rounded-2xl bg-surface px-6 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
        <div>
          <p className="mono-label text-primary">Admin · Command Center</p>
          <h1 className="text-3xl font-bold text-light-text tracking-tight mt-1">Welcome back, {firstName}</h1>
          <p className="text-sm text-dark-text mt-1.5">Everything happening across the platform, in one place.</p>
        </div>
        <Link
          href="/admin/analytics"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors group"
        >
          <BarChart3 size={15} />
          Open full analytics
          <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </header>

      {/* ── Clickable stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, tint, href, cta }) => (
          <Link
            key={label}
            href={href}
            className="card-glow group rounded-2xl bg-surface p-4 flex flex-col justify-between min-h-[132px] transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${tint} ${color}`}>
                <Icon size={17} />
              </span>
              <ArrowRight size={14} className="text-dark-text/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <p className="font-mono tabular-nums tracking-tight text-3xl font-semibold text-light-text leading-none">
                {value.toLocaleString()}
              </p>
              <div className="flex items-center justify-between gap-2 mt-1.5">
                <p className="text-xs text-dark-text">{label}</p>
                <span className="text-[10px] text-dark-text/0 group-hover:text-primary transition-colors whitespace-nowrap">{cta}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Quick-access nav cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {navCards.map(({ title, desc, icon: Icon, href }) => (
          <Link
            key={title}
            href={href}
            className="group flex items-center gap-3.5 rounded-2xl border border-border bg-surface px-4 py-3.5 hover:border-primary/40 hover:bg-surface/80 transition-all"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-light-text">{title}</p>
              <p className="text-xs text-dark-text truncate">{desc}</p>
            </div>
            <ArrowRight size={15} className="text-dark-text/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      {/* ── Recent activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent feedback */}
        <Panel pad={false}>
          <div className="px-5 pt-5">
            <SectionHeading
              eyebrow="Latest"
              title="Recent feedback"
              meta={
                <span className="flex items-center gap-3">
                  {avgRating != null && (
                    <span className="font-mono tabular-nums">avg <span className="text-light-text font-semibold">{avgRating.toFixed(1)}</span></span>
                  )}
                  <Link href="/admin/feedback" className="text-primary hover:underline">View all →</Link>
                </span>
              }
            />
          </div>
          {recentFeedback.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-dark-text">No feedback yet.</p>
          ) : (
            <div className="divide-y divide-border border-t border-border">
              {recentFeedback.map((f) => (
                <div key={f.id} className="px-5 py-3 flex items-start gap-3">
                  <span className={`mt-0.5 text-xs font-bold font-mono px-1.5 py-0.5 rounded border ${ratingColor(f.rating)}`}>
                    {f.rating}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-dark-text truncate">{f.email ?? 'Anonymous'}</p>
                    {f.comment && <p className="text-xs text-light-text/70 truncate mt-0.5">{f.comment}</p>}
                  </div>
                  <span className="text-[10px] text-dark-text/60 shrink-0 whitespace-nowrap">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Recent signups */}
        <Panel pad={false}>
          <div className="px-5 pt-5">
            <SectionHeading
              eyebrow="Newest"
              title="Recent signups"
              meta={<Link href="/admin/users" className="text-primary hover:underline">View all →</Link>}
            />
          </div>
          {recentUsers.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-dark-text">No users yet.</p>
          ) : (
            <div className="divide-y divide-border border-t border-border">
              {recentUsers.map((u) => (
                <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                  <Avatar name={u.name} image={u.image} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-light-text truncate">{u.name ?? 'Unnamed'}</p>
                    <p className="text-[10px] text-dark-text/60 truncate">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${roleColor(u.role)}`}>
                    {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                  </span>
                  <span className="text-[10px] text-dark-text/50 shrink-0 whitespace-nowrap font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Avatar({ name, image }: { name: string | null; image: string | null }) {
  const initials = name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={28}
        height={28}
        className="w-7 h-7 rounded-full object-cover ring-1 ring-border shrink-0"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-[10px] font-semibold flex items-center justify-center ring-1 ring-primary/25 shrink-0">
      {initials}
    </span>
  );
}

function ratingColor(r: number) {
  if (r <= 2) return 'text-error border-error/40 bg-error/10';
  if (r === 3) return 'text-warning border-warning/40 bg-warning/10';
  return 'text-success border-success/40 bg-success/10';
}

function roleColor(role: string) {
  if (role === 'ADMIN') return 'text-error border-error/40 bg-error/10';
  if (role === 'TEACHER') return 'text-primary border-primary/40 bg-primary/10';
  return 'text-dark-text border-border bg-border/20';
}
