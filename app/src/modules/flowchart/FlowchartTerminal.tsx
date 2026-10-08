'use client';

import { useEffect, useRef, useState } from 'react';
import type { OutputEntry } from '@/modules/interpreter/core/types';

type Props = {
  entries: OutputEntry[];
  isRunning: boolean;
  waitingForInput: boolean;
  onInput: (value: string) => void;
  emptyText?: string;
};

/** Compact program output with an inline INPUT field. */
export default function FlowchartTerminal({ entries, isRunning, waitingForInput, onInput, emptyText }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waitingForInput) inputRef.current?.focus();
  }, [waitingForInput]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [entries.length]);

  return (
    <div className="font-mono text-xs p-3 min-w-0">
      {entries.length === 0 && !isRunning && (
        <p className="text-dark-text/60">{emptyText ?? 'Run the flowchart to see its output here.'}</p>
      )}
      {entries.map((entry, i) => {
        if (entry.kind === 'output') {
          return (
            <div key={i} className="whitespace-pre-wrap text-light-text">
              {entry.text}
            </div>
          );
        }
        if (entry.kind === 'error') {
          return (
            <div key={i} className="whitespace-pre-wrap text-error">
              {entry.text}
            </div>
          );
        }
        if (entry.submitted) {
          return (
            <div key={i} className="text-info/80">
              {entry.prompt || entry.variableName}: {entry.value}
            </div>
          );
        }
        return (
          <form
            key={i}
            onSubmit={(e) => {
              e.preventDefault();
              onInput(value);
              setValue('');
            }}
            className="flex items-center gap-2 my-1 min-w-0"
          >
            <span className="text-primary shrink-0 max-w-[45%] truncate">{entry.prompt || entry.variableName}</span>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label={`Input for ${entry.variableName}`}
              className="min-w-0 flex-1 bg-transparent border-b border-primary/50 text-info outline-none py-1"
            />
          </form>
        );
      })}
      {!isRunning && entries.length > 0 && (
        <div
          className={`mt-2 text-[10px] uppercase tracking-wider ${
            entries.some((e) => e.kind === 'error') ? 'text-error/70' : 'text-success/70'
          }`}
        >
          {entries.some((e) => e.kind === 'error') ? 'Stopped with an error' : 'Finished'}
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
