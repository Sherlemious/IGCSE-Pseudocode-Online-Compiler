import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatAdminNumber } from './adminFormat';
import { pageWindow } from './pageWindow';

export function AdminPager({
  page,
  pageCount,
  start,
  end,
  total,
  hrefFor,
  label = 'Pages',
}: {
  page: number;
  pageCount: number;
  start: number;
  end: number;
  total: number;
  hrefFor: (page: number) => string;
  label?: string;
}) {
  if (pageCount <= 1) return null;
  const window = pageWindow(page, pageCount);

  return (
    <nav aria-label={label} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-dark-text">
        {formatAdminNumber(start)}–{formatAdminNumber(end)} of {formatAdminNumber(total)}
      </p>
      <div className="flex items-center gap-1.5">
        <PagerLink href={page > 1 ? hrefFor(page - 1) : null} label="Previous page">
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Previous</span>
        </PagerLink>
        <span className="sm:hidden px-2 text-xs text-dark-text tabular-nums">
          {page} / {pageCount}
        </span>
        <div className="hidden sm:flex items-center gap-1.5">
          {window.map((item, index) =>
            item === 'gap' ? (
              <span key={`gap-${index}`} className="px-1 text-xs text-dark-text/50" aria-hidden>
                …
              </span>
            ) : (
              <PagerLink key={item} href={hrefFor(item)} current={item === page} label={`Page ${item}`}>
                {item}
              </PagerLink>
            ),
          )}
        </div>
        <PagerLink href={page < pageCount ? hrefFor(page + 1) : null} label="Next page">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={14} />
        </PagerLink>
      </div>
    </nav>
  );
}

function PagerLink({
  href,
  current = false,
  label,
  children,
}: {
  href: string | null;
  current?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const className = `inline-flex items-center justify-center gap-1 min-w-8 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
    current
      ? 'bg-primary/15 border-primary/50 text-primary'
      : href
        ? 'bg-background border-border text-dark-text hover:text-light-text'
        : 'bg-background border-border text-dark-text/35'
  }`;

  if (!href || current) {
    return (
      <span
        className={className}
        aria-label={label}
        aria-current={current ? 'page' : undefined}
        aria-disabled={href ? undefined : true}
      >
        {children}
      </span>
    );
  }

  return (
    <Link href={href} scroll={false} prefetch={false} aria-label={label} className={className}>
      {children}
    </Link>
  );
}
