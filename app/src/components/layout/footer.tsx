'use client';

import React from 'react';
import { Circle, Loader } from 'lucide-react';
import type { CursorPosition } from '../compiler/codeInput';
import { PREMIUM_GATING_ENABLED } from '@/lib/featureFlags';

interface FooterProps {
  isRunning?: boolean;
  cursor?: CursorPosition;
  lineCount?: number;
}

const Footer: React.FC<FooterProps> = ({ isRunning = false, cursor, lineCount }) => {
  return (
    <footer className="h-8 bg-header-bg border-t border-border px-3 flex items-center justify-between text-[11px] font-mono shrink-0 select-none relative">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {isRunning ? (
            <Loader size={12} className="text-header-text animate-spin" />
          ) : (
            <Circle size={10} className="text-header-text fill-header-text" />
          )}
          <span className={isRunning ? 'text-header-text font-semibold' : 'text-header-text'}>
            {isRunning ? 'Running' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Centre section */}
      {!PREMIUM_GATING_ENABLED && (
        <span className="absolute left-1/2 -translate-x-1/2 text-[10px] text-header-text/30 font-mono tracking-widest uppercase hidden sm:block">
          Beta · All features free
        </span>
      )}

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
