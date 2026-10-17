'use client';

import Link from 'next/link';
import { useState, type ComponentProps } from 'react';

/**
 * A `<Link>` that prefetches on hover, touch or focus instead of on entering the
 * viewport. Site chrome renders on every page, and viewport prefetching made each
 * page load fetch every nav destination, each one a billed edge request.
 */
export default function HoverPrefetchLink({ onMouseEnter, onTouchStart, onFocus, ...props }: ComponentProps<typeof Link>) {
  const [active, setActive] = useState(false);
  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={(e) => {
        setActive(true);
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        setActive(true);
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        setActive(true);
        onFocus?.(e);
      }}
    />
  );
}
