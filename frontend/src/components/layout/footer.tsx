import React from 'react';
import type { CursorPosition } from '../compiler/codeInput';

interface FooterProps {
  isRunning?: boolean;
  cursor?: CursorPosition;
  lineCount?: number;
}

const Footer: React.FC<FooterProps> = ({ isRunning = false, cursor, lineCount }) => {
  return (
    <footer className="h-8 bg-header-bg border-t border-border px-3 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full transition-colors ${
              isRunning ? 'bg-success animate-pulse' : 'bg-success/70'
            }`}
          />
          <span className={isRunning ? 'text-success font-semibold' : 'text-header-text/80'}>
            {isRunning ? 'Running' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 text-header-text/70">
        {cursor && (
          <span>
            Ln {cursor.line}, Col {cursor.col}
          </span>
        )}
        {lineCount !== undefined && (
          <span className="hidden sm:inline">{lineCount} lines</span>
        )}
        <span className="hidden sm:inline text-header-text/50">Pseudocode</span>
        <span className="text-header-text/40">&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default Footer;
