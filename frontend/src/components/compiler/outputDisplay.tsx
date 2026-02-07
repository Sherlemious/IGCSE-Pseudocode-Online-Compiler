import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import type { OutputEntry } from '../../interpreter/core/types';

interface OutputDisplayProps {
  entries: OutputEntry[];
  isRunning: boolean;
  waitingForInput: boolean;
  onInputSubmit: (value: string) => void;
  onClear: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  entries,
  isRunning,
  waitingForInput,
  onInputSubmit,
  onClear,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, waitingForInput]);

  // Auto-focus input field
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitingForInput) {
      onInputSubmit(inputValue);
      setInputValue('');
    }
  };

  const renderContent = () => {
    if (!isRunning && entries.length === 0) {
      return (
        <div className="text-dark-text text-center h-full flex items-center justify-center text-sm">
          Run your code to see the output here
        </div>
      );
    }

    return (
      <div className="p-4 font-mono text-sm">
        {entries.map((entry, i) => {
          if (entry.kind === 'output') {
            return (
              <div key={i} className="text-light-text whitespace-pre-wrap">
                {entry.text}
              </div>
            );
          }

          if (entry.kind === 'error') {
            return (
              <div key={i} className="text-warning whitespace-pre-wrap">
                {entry.text}
              </div>
            );
          }

          if (entry.kind === 'input') {
            if (entry.submitted) {
              return (
                <div key={i} className="text-info whitespace-pre-wrap">
                  <span className="text-dark-text">[{entry.variableName}]: </span>
                  {entry.value}
                </div>
              );
            }

            // Active input (last unsubmitted)
            return (
              <form key={i} onSubmit={handleSubmit} className="flex items-center gap-2 my-1">
                <span className="text-dark-text">[{entry.variableName}]:</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-transparent border-b border-primary
                    text-info outline-none font-mono text-sm py-1 px-1
                    focus:border-info"
                  autoFocus
                />
              </form>
            );
          }

          return null;
        })}

        {isRunning && !waitingForInput && entries.length === 0 && (
          <div className="animate-pulse text-primary">Running...</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Panel header */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-dark-text" />
          <span className="text-xs font-semibold tracking-wider text-dark-text uppercase">Output</span>
          {isRunning && (
            <span className="inline-block w-2 h-2 rounded-full bg-warning animate-pulse" />
          )}
        </div>
        <button
          onClick={onClear}
          className="text-dark-text hover:text-light-text transition-colors p-1 rounded hover:bg-background"
          title="Clear output"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Terminal output */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 bg-background overflow-y-auto
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
          scrollbar-track-background scrollbar-thumb-rounded-full"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputDisplay;
