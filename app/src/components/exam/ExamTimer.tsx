'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  startedAt: string;
  timeLimitMin: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ startedAt, timeLimitMin, onTimeUp }: Props) {
  const totalMs = timeLimitMin * 60 * 1000;

  const [remaining, setRemaining] = useState<number>(() => {
    const elapsed = Date.now() - new Date(startedAt).getTime();
    return Math.max(0, totalMs - elapsed);
  });

  const handleTimeUp = useCallback(onTimeUp, [onTimeUp]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - new Date(startedAt).getTime();
      const left = Math.max(0, totalMs - elapsed);
      setRemaining(left);
      if (left === 0) {
        clearInterval(interval);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, totalMs, handleTimeUp]);

  const totalSec = Math.ceil(remaining / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const isLow = remaining < 5 * 60 * 1000;
  const isCritical = remaining < 60 * 1000;
  const progress = remaining / totalMs;

  const timeStr = hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;

  // SVG ring
  const size = 28;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const color = isCritical ? 'var(--color-error)' : isLow ? 'var(--color-warning)' : 'var(--color-primary)';

  return (
    <div className={`flex items-center gap-2 ${isCritical ? 'animate-pulse' : ''}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className="text-sm font-mono font-semibold tabular-nums"
        style={{ color }}
      >
        {timeStr}
      </span>
    </div>
  );
}
