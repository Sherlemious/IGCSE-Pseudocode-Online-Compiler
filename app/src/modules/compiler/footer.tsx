'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { Circle, Loader } from 'lucide-react';
import type { CursorPosition } from './codeInput';

const GITHUB_URL = 'https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler';
const PORTFOLIO_URL = 'https://www.sherlemious.com';

interface FooterProps {
  isRunning?: boolean;
  cursor?: CursorPosition;
  lineCount?: number;
}

const Footer: React.FC<FooterProps> = ({ isRunning = false, cursor, lineCount }) => {
  const pathname = usePathname();
  const ph = usePostHog();

  const trackNav = useCallback(
    (destination: string) => {
      ph?.capture('nav_clicked', { destination, from: pathname });
    },
    [ph, pathname],
  );

  return (
    <footer className="relative h-8 bg-header-bg border-t border-border px-3 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
      {/* Left section — run status */}
      <div className="flex items-center gap-3 shrink-0">
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

      {/* Center section — legal + contact, perfectly centered regardless of the flanks */}
      <nav
        aria-label="Legal and contact"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 sm:gap-4 text-header-text/50"
      >
        <Link href="/terms" onClick={() => trackNav('terms')} className="hover:text-primary transition-colors">
          Terms
        </Link>
        <Link href="/privacy" onClick={() => trackNav('privacy')} className="hover:text-primary transition-colors">
          Privacy
        </Link>
        <Link href="/refund" onClick={() => trackNav('refund')} className="hover:text-primary transition-colors">
          Refunds
        </Link>
        <Link href="/contact" onClick={() => trackNav('contact')} className="hover:text-primary transition-colors">
          Contact
        </Link>
      </nav>

      {/* Right section — editor position + credits (collapses on mobile so the center stays clear) */}
      <div className="flex items-center gap-3 text-header-text/70 shrink-0">
        {cursor && (
          <span className="hidden sm:inline">
            Ln {cursor.line}, Col {cursor.col}
          </span>
        )}
        {lineCount !== undefined && (
          <span className="hidden md:inline">{lineCount} lines</span>
        )}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline text-header-text/50 hover:text-primary transition-colors"
        >
          GitHub
        </a>
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline text-header-text/50 hover:text-primary transition-colors"
        >
          Portfolio
        </a>
        <span className="hidden sm:inline text-header-text/40">&copy; {new Date().getFullYear()} Sherlemious</span>
      </div>
    </footer>
  );
};

export default Footer;
