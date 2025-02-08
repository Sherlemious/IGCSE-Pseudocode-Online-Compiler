import React from 'react';

interface OutputDisplayProps {
  output: string | null;
  error: string | null;
  isLoading: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, error, isLoading }) => {
  const renderOutput = () => {
    if (isLoading) {
      return (
        <div
          className="h-full p-6 overflow-auto
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
          scrollbar-track-background scrollbar-thumb-rounded-full"
        >
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-primary text-lg">Compiling and running code...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="h-full p-6 overflow-auto
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
          scrollbar-track-background scrollbar-thumb-rounded-full"
        >
          <div className="text-warning font-mono whitespace-pre-wrap">{error}</div>
        </div>
      );
    }

    if (output) {
      return (
        <textarea
          value={output}
          className="w-full h-full p-6 font-mono text-base
            bg-background
            text-light-text
            border-2 border-dark-text
            rounded-lg resize-none
            focus:ring-2 focus:ring-primary focus:outline-none
            scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
            scrollbar-track-background scrollbar-thumb-rounded-full"
        />
      );
    }

    return (
      <div className="text-dark-text text-center h-full flex items-center justify-center">
        Run your code to see the output here
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <h2 className="text-2xl font-sans font-semibold text-light-text mb-6 mt-2">Output</h2>

      <div
        className="flex-1 min-h-0 bg-background
        border-2 border-dark-text rounded-lg
        overflow-hidden"
      >
        {renderOutput()}
      </div>
    </div>
  );
};

export default OutputDisplay;
