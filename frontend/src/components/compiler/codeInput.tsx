import React from 'react';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  isLoading: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange, onRunCode, isLoading }) => {
  return (
    <div className="min-h-full flex-1 flex flex-col p-6 border-r border-dark-text">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-sans font-semibold text-light-text">Pseudocode Editor</h2>
        <button
          onClick={onRunCode}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300
            ${
              isLoading ? 'bg-dark-text cursor-not-allowed' : 'bg-primary hover:bg-secondary'
            } text-light-text shadow-cool hover:shadow-intense`}
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full p-6 font-mono text-base
            bg-background
            text-light-text
            border-2 border-dark-text
            rounded-lg resize-none
            focus:ring-2 focus:ring-primary focus:outline-none
            scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-secondary
            scrollbar-track-background scrollbar-thumb-rounded-full"
          placeholder="Enter your pseudocode here..."
        />
      </div>
    </div>
  );
};

export default CodeInput;
