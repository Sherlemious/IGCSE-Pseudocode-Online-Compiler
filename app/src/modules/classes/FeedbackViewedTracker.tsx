'use client';

import { useEffect } from 'react';
import { captureEvent } from '@/modules/interpreter/analytics';

/**
 * Mounted on a results page that shows teacher feedback: records the view and
 * clears the student's "new feedback" indicator. Never sends the text.
 */
export default function FeedbackViewedTracker({ attemptId, assignmentId }: { attemptId: string; assignmentId: string }) {
  useEffect(() => {
    captureEvent('assignment_feedback_viewed', { assignment_id: assignmentId });
    fetch(`/api/exam/${attemptId}/feedback-seen`, { method: 'POST' }).catch(() => {});
  }, [attemptId, assignmentId]);
  return null;
}
