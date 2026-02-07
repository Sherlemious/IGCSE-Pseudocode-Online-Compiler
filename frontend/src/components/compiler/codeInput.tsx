import React from 'react';
import { FileCode, Play, Square } from 'lucide-react';
import ExamplePicker from './examplePicker';
import FileViewer from './fileViewer';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  onStop: () => void;
  onSelectExample: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange, onRunCode, isRunning, onStop, onSelectExample }) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Tab bar */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-1 shrink-0">
        {/* Left: file tab + tools */}
        <div className="flex items-center min-w-0">
          {/* Active file tab */}
          <div className="flex items-center gap-1.5 px-3 h-9 border-t-2 border-t-primary bg-background text-sm text-light-text shrink-0">
            <FileCode className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-xs">main.pseudo</span>
          </div>
          {/* Tool buttons */}
          <div className="flex items-center gap-1 ml-2">
            <ExamplePicker onSelectExample={onSelectExample} />
            <FileViewer />
          </div>
        </div>

        {/* Right: run/stop */}
        <div className="flex items-center gap-1 shrink-0">
          {isRunning && (
            <button
              onClick={onStop}
              className="flex items-center gap-1 px-2 py-1 text-xs text-error hover:bg-error/10 rounded transition-colors"
              title="Stop"
            >
              <Square className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors
              ${isRunning ? 'text-dark-text cursor-not-allowed' : 'text-success hover:bg-success/10'}`}
            title="Run Code"
          >
            <Play className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          style={{ fontSize: 'var(--editor-font-size)' }}
          className="w-full h-full p-4 font-mono
            bg-background
            text-light-text
            border-0 resize-none
            focus:ring-0 focus:outline-none
            scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
            scrollbar-track-background scrollbar-thumb-rounded-full"
          placeholder="Enter your pseudocode here..."
        />
      </div>
    </div>
  );
};

export default CodeInput;
