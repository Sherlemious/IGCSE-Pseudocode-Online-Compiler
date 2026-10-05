'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSearch } from '../../_components/adminUi';
import { usersHref, type UserQuery } from '../usersQuery';

export default function UserSearch({ query }: { query: UserQuery }) {
  const router = useRouter();
  const [text, setText] = useState(query.q);

  useEffect(() => {
    setText(query.q);
  }, [query.q]);

  useEffect(() => {
    if (text === query.q) return;
    const handle = window.setTimeout(() => {
      router.replace(usersHref({ ...query, q: text, page: 1 }), { scroll: false });
    }, 250);
    return () => window.clearTimeout(handle);
  }, [text, query, router]);

  return <AdminSearch value={text} onChange={setText} placeholder="Search name or email…" />;
}
