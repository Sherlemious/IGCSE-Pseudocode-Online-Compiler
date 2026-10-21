'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface OwnedClassOption {
  id: string;
  name: string;
  joinCode: string;
}

const cache = new Map<string, OwnedClassOption[]>();
const inflight = new Map<string, Promise<OwnedClassOption[]>>();

function isOwnedClass(value: unknown): value is OwnedClassOption {
  if (!value || typeof value !== 'object') return false;
  const row = value as OwnedClassOption;
  return typeof row.id === 'string' && typeof row.name === 'string' && typeof row.joinCode === 'string';
}

function loadOwnedClasses(userId: string): Promise<OwnedClassOption[]> {
  const hit = cache.get(userId);
  if (hit) return Promise.resolve(hit);
  const pending = inflight.get(userId);
  if (pending) return pending;
  const request = fetch('/api/classes')
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { owned?: unknown } | null) => {
      const owned = Array.isArray(data?.owned) ? data.owned.filter(isOwnedClass) : [];
      cache.set(userId, owned);
      inflight.delete(userId);
      return owned;
    })
    .catch(() => {
      inflight.delete(userId);
      return [];
    });
  inflight.set(userId, request);
  return request;
}

/** Non-archived classes this user owns. Hidden for everyone else, so students never hit the endpoint. */
export function useOwnedClasses(enabled = true): { ready: boolean; classes: OwnedClassOption[] } {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const eligible = Boolean(
    enabled && userId && (role === 'TEACHER' || role === 'ADMIN' || session?.user?.ownsClass),
  );
  const [classes, setClasses] = useState<OwnedClassOption[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!eligible || !userId) {
      setClasses([]);
      setReady(true);
      return;
    }
    let cancelled = false;
    void loadOwnedClasses(userId).then((owned) => {
      if (!cancelled) {
        setClasses(owned);
        setReady(true);
      }
    });
    return () => { cancelled = true; };
  }, [eligible, status, userId]);

  return { ready, classes };
}
