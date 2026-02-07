import React from 'react';
import type { CursorPosition } from '../compiler/codeInput';

interface FooterProps {
  isRunning?: boolean;
  cursor?: CursorPosition;
  lineCount?: number;
}

const Footer: React.FC<FooterProps> = ({ isRunning = false, cursor, lineCount }) => {
  return (
    <footer className="h-7 bg-header-bg border-t border-border px-3 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full transition-colors ${
              isRunning ? 'bg-success animate-pulse' : 'bg-dark-text/40'
            }`}
          />
          <span className={isRunning ? 'text-success' : 'text-dark-text'}>
            {isRunning ? 'Running' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 text-dark-text">
        {cursor && (
          <span>
            Ln {cursor.line}, Col {cursor.col}
          </span>
        )}
        {lineCount !== undefined && (
          <span className="hidden sm:inline">{lineCount} lines</span>
        )}
        <span className="hidden sm:inline text-dark-text/50">Pseudocode</span>
        <span className="text-dark-text/40">&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default Footer;
