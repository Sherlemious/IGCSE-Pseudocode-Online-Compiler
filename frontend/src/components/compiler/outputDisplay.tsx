import React, { useRef, useEffect, useState } from 'react';
import type { OutputEntry } from '../../interpreter/core/types';

interface OutputDisplayProps {
  entries: OutputEntry[];
  isRunning: boolean;
  waitingForInput: boolean;
  onInputSubmit: (value: string) => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  entries,
  isRunning,
  waitingForInput,
  onInputSubmit,
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
        <div className="text-dark-text text-center h-full flex items-center justify-center">
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
    <div className="flex-1 min-h-0 flex flex-col p-6">
      <h2 className="text-2xl font-sans font-semibold text-light-text mb-6 mt-2">Output</h2>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 bg-background
        border-2 border-border rounded-lg
        overflow-y-auto
        scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
        scrollbar-track-background scrollbar-thumb-rounded-full"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputDisplay;
