import { COURSE_ID } from './types';
import {
  loadProgress,
  mergeProgress,
  progressHasLocalExtras,
  saveProgress,
  type ProgressMap,
} from './progress';

export type RemoteLearnProgress = {
  lessons: ProgressMap;
  premiumAccess: boolean;
};

export async function fetchLearnProgress(): Promise<RemoteLearnProgress | null> {
  try {
    const res = await fetch('/api/learn/progress');
    if (!res.ok) return null;
    const data = (await res.json()) as { lessons?: ProgressMap; premiumAccess?: boolean };
    if (!data.lessons || typeof data.lessons !== 'object') return { lessons: {}, premiumAccess: Boolean(data.premiumAccess) };
    return {
      lessons: data.lessons,
      premiumAccess: Boolean(data.premiumAccess),
    };
  } catch {
    return null;
  }
}

export async function persistLearnProgress(lessons: ProgressMap): Promise<void> {
  if (Object.keys(lessons).length === 0) return;
  try {
    await fetch('/api/learn/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessons }),
    });
  } catch {
    /* localStorage remains the source of truth on this device */
  }
}

export async function hydrateLearnProgress(
  courseId: string = COURSE_ID,
): Promise<{ progress: ProgressMap; premiumAccess: boolean | null }> {
  const local = loadProgress(courseId);
  const remote = await fetchLearnProgress();
  if (!remote) return { progress: local, premiumAccess: null };
  const merged = mergeProgress(local, remote.lessons);
  saveProgress(merged, courseId);
  if (progressHasLocalExtras(local, remote.lessons)) {
    void persistLearnProgress(merged);
  }
  return { progress: merged, premiumAccess: remote.premiumAccess };
}
