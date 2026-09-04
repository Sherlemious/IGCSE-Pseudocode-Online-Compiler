import Link from 'next/link';

const LINKS = [
  { href: '/faq', label: 'FAQ' },
  { href: '/examples', label: 'Examples' },
  { href: '/docs', label: 'Docs' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/refund', label: 'Refunds' },
] as const;

export default function IndexLinks({ current }: { current?: string }) {
  return (
    <nav
      aria-label="Index pages"
      className="mt-8 pt-5 border-t border-border text-[11px] text-dark-text/50 flex flex-wrap items-center gap-x-2 gap-y-1"
    >
      {LINKS.map((link, index) => (
        <span key={link.href} className="inline-flex items-center gap-x-2">
          {index > 0 && <span aria-hidden="true">·</span>}
          {current === link.href ? (
            <span className="text-dark-text/70">{link.label}</span>
          ) : (
            <Link href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
