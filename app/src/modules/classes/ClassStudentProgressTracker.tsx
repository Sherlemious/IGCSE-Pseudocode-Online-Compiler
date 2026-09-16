'use client';

import { useEffect, useRef } from 'react';
import { captureEvent } from '@/modules/interpreter/analytics';

export default function ClassStudentProgressTracker(props: {
  classId: string;
  solvedCount: number;
  attemptedCount: number;
  assignmentsSubmitted: number;
  assignmentCount: number;
  hasPractice: boolean;
}) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    captureEvent('class_student_progress_viewed', {
      class_id: props.classId,
      solved_count: props.solvedCount,
      attempted_count: props.attemptedCount,
      assignments_submitted: props.assignmentsSubmitted,
      assignment_count: props.assignmentCount,
      has_practice: props.hasPractice,
    });
  }, [
    props.assignmentCount,
    props.assignmentsSubmitted,
    props.attemptedCount,
    props.classId,
    props.hasPractice,
    props.solvedCount,
  ]);
  return null;
}
