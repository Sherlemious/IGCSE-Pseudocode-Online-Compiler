'use client';

import { useEffect, useRef } from 'react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { rememberAssignmentSource, type AssignmentSource } from './assignmentTelemetry';

export default function AssignmentLinkTracker({ assignmentId, classId, source, signedIn }: {
  assignmentId: string;
  classId?: string;
  source: AssignmentSource;
  signedIn: boolean;
}) {
  const tracked = useRef(false);
  useEffect(() => {
    rememberAssignmentSource(assignmentId, source);
    if (tracked.current) return;
    tracked.current = true;
    captureEvent('assignment_link_opened', {
      assignment_id: assignmentId, class_id: classId, source, signed_in: signedIn,
    });
  }, [assignmentId, classId, source, signedIn]);
  return null;
}
