import { COURSE_ID } from './types';
import {
  loadProgress,
  mergeProgress,
  progressHasLocalExtras,
  saveProgress,
  type ProgressMap,
} from './progress';

export async function fetchLearnProgress(): Promise<ProgressMap | null> {
  try {
    const res = await fetch('/api/learn/progress');
    if (!res.ok) return null;
    const data = (await res.json()) as { lessons?: ProgressMap };
    return data.lessons && typeof data.lessons === 'object' ? data.lessons : {};
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

export async function hydrateLearnProgress(courseId: string = COURSE_ID): Promise<ProgressMap> {
  const local = loadProgress(courseId);
  const remote = await fetchLearnProgress();
  if (!remote) return local;
  const merged = mergeProgress(local, remote);
  saveProgress(merged, courseId);
  if (progressHasLocalExtras(local, remote)) {
    void persistLearnProgress(merged);
  }
  return merged;
}
