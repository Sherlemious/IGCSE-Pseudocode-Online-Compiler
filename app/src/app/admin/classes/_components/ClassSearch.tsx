'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSearch } from '../../_components/adminUi';
import { classesHref, type ClassQuery } from '../classesQuery';

export default function ClassSearch({ query }: { query: ClassQuery }) {
  const router = useRouter();
  const [text, setText] = useState(query.q);

  useEffect(() => {
    setText(query.q);
  }, [query.q]);

  useEffect(() => {
    if (text === query.q) return;
    const handle = window.setTimeout(() => {
      router.replace(classesHref({ ...query, q: text, page: 1, classId: null }), { scroll: false });
    }, 250);
    return () => window.clearTimeout(handle);
  }, [text, query, router]);

  return <AdminSearch value={text} onChange={setText} placeholder="Search teacher, class, or join code…" />;
}
