import React from 'react';

interface OutputDisplayProps {
  output: string | null;
  error: string | null;
  isLoading: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, error, isLoading }) => {
  return (
    <div className="flex-1 flex flex-col p-6">
      <h2 className="text-2xl font-sans font-semibold text-light-text mb-6 mt-2">Output</h2>

      <div
        className="flex-1 min-h-0 bg-background
        border-2 border-dark-text rounded-lg
        overflow-hidden"
      >
        <div
          className="h-full p-6 overflow-auto
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
          scrollbar-track-background scrollbar-thumb-rounded-full"
        >
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-primary text-lg">Compiling and running code...</div>
            </div>
          )}

          {error && !isLoading && <div className="text-warning font-mono whitespace-pre-wrap">{error}</div>}

          {output && !isLoading && !error && (
            <pre className="font-mono whitespace-pre-wrap text-light-text">{output}</pre>
          )}

          {!output && !error && !isLoading && (
            <div className="text-dark-text text-center h-full flex items-center justify-center">
              Run your code to see the output here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputDisplay;
