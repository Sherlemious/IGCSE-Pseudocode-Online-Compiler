'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSearch } from '../../_components/adminUi';
import { learnHref, type LearnQuery } from '../learnQuery';

export default function LearnSearch({
  query,
  defaultCourseId,
}: {
  query: LearnQuery;
  defaultCourseId: string;
}) {
  const router = useRouter();
  const [text, setText] = useState(query.q);

  useEffect(() => {
    setText(query.q);
  }, [query.q]);

  useEffect(() => {
    if (text === query.q) return;
    const handle = window.setTimeout(() => {
      router.replace(
        learnHref({ ...query, q: text, page: 1 }, defaultCourseId),
        { scroll: false },
      );
    }, 250);
    return () => window.clearTimeout(handle);
  }, [text, query, defaultCourseId, router]);

  return <AdminSearch value={text} onChange={setText} placeholder="Search name or email…" />;
}
