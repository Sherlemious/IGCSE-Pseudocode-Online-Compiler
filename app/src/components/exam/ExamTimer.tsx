'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface Props {
  startedAt: string;
  timeLimitMin: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ startedAt, timeLimitMin, onTimeUp }: Props) {
  const [remaining, setRemaining] = useState<number>(() => {
    const elapsed = Date.now() - new Date(startedAt).getTime();
    return Math.max(0, timeLimitMin * 60 * 1000 - elapsed);
  });

  const handleTimeUp = useCallback(onTimeUp, [onTimeUp]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - new Date(startedAt).getTime();
      const left = Math.max(0, timeLimitMin * 60 * 1000 - elapsed);
      setRemaining(left);
      if (left === 0) {
        clearInterval(interval);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, timeLimitMin, handleTimeUp]);

  const totalSec = Math.ceil(remaining / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const isLow = remaining < 5 * 60 * 1000; // < 5 min
  const isCritical = remaining < 60 * 1000; // < 1 min

  const timeStr = hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${
      isCritical ? 'text-error animate-pulse' : isLow ? 'text-warning' : 'text-light-text'
    }`}>
      {isLow ? <AlertTriangle size={14} /> : <Clock size={14} />}
      {timeStr}
    </div>
  );
}
