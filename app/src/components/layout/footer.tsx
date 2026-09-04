'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { Circle, Loader } from 'lucide-react';
import type { CursorPosition } from '../compiler/codeInput';

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
    <footer className="h-8 bg-header-bg border-t border-border px-3 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
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

      {/* Centre section — legal + contact, same links as the header */}
      <nav
        aria-label="Legal and contact"
        className="hidden sm:flex items-center gap-2 text-header-text/30"
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
        <span className="text-header-text/40">&copy; {new Date().getFullYear()} Sherlemious</span>
      </div>
    </footer>
  );
};

export default Footer;
