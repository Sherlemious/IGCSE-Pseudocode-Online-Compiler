'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { siGithub } from 'simple-icons/icons';
import {
  Menu,
  X,
  Braces,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Clock,
  ArrowLeft,
  Search,
} from 'lucide-react';
import SettingsPanel from './settingsPanel';
import UserMenu from '../auth/UserMenu';
import { useCommands } from '../common/CommandPalette';

const GITHUB_URL = 'https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler';
const PORTFOLIO_URL = 'https://www.sherlemious.com';

const SimpleGithubIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className={className}>
    <path fill="currentColor" d={siGithub.path} />
  </svg>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const ph = usePostHog();
  const { openPalette } = useCommands();

  const trackNav = useCallback(
    (destination: string) => {
      ph?.capture('nav_clicked', { destination, from: pathname });
    },
    [ph, pathname],
  );
  const isDocs = pathname === '/docs' || pathname.startsWith('/docs/');
  const isPractice = pathname === '/practice' || pathname.startsWith('/practice/');
  const isExam = pathname === '/exam' || pathname.startsWith('/exam/');
  const isCompilerPage = pathname === '/';

  // Text-only nav links; the active route is marked with the accent + a 2px
  // underline that echoes the editor's active-tab indicator.
  const navLinkClass = (active: boolean) =>
    `px-2 py-1 rounded-t border-b-2 transition duration-200 ${
      active
        ? 'text-primary border-primary'
        : 'text-header-text/70 border-transparent hover:text-header-text hover:bg-white/10'
    }`;

  return (
    <header className="bg-header-bg text-header-text border-b border-border select-none">
      <div className="px-3 py-1.5">
        <div className="flex justify-between items-center">
          {/* Brand + always-visible credit */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className={`flex items-center gap-2 transition duration-200 ${
                isCompilerPage ? 'text-header-text' : 'text-header-text hover:text-primary'
              }`}
              title={isCompilerPage ? 'Pseudocode Compiler' : 'Back to Compiler'}
              aria-label={isCompilerPage ? 'Pseudocode Compiler home' : 'Back to Compiler'}
            >
              <Braces className="h-4 w-4 text-header-text" strokeWidth={2.5} />
              <span className="text-sm font-bold tracking-tight text-header-text whitespace-nowrap">
                Pseudocode <span className="font-normal text-header-text/60">Compiler</span>
              </span>
              {!isCompilerPage && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <ArrowLeft size={10} />
                  Back
                </span>
              )}
            </Link>
            <span className="text-header-text/20 select-none" aria-hidden>
              ·
            </span>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-header-text/40 hover:text-primary transition-colors whitespace-nowrap"
              title="Made by Sherlemious — view portfolio"
            >
              by Sherlemious
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <Link href="/docs" data-tour="docs-link" onClick={() => trackNav('docs')} className={navLinkClass(isDocs)}>
              Docs
            </Link>
            <Link
              href="/practice"
              data-tour="practice-link"
              onClick={() => trackNav('practice')}
              className={navLinkClass(isPractice)}
            >
              Practice
            </Link>
            <Link href="/exam" onClick={() => trackNav('exam')} className={navLinkClass(isExam)}>
              Exam
            </Link>
            <div className="w-px h-4 bg-header-text/20 mx-1" />
            <button
              onClick={openPalette}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-header-text/70 hover:text-header-text hover:bg-white/10 transition duration-200"
              title="Command palette (Ctrl + K)"
            >
              <Search size={13} />
              <kbd className="text-[10px] text-header-text/50">Ctrl K</kbd>
            </button>
            <SettingsPanel />
            <UserMenu />
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={openPalette}
              className="p-1 rounded hover:bg-white/10 transition duration-200 text-header-text/80"
              aria-label="Command palette"
            >
              <Search className="h-5 w-5" />
            </button>
            <SettingsPanel />
            <UserMenu />
            <button
              className="p-1 rounded hover:bg-white/10 transition duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-2 space-y-0.5 pb-2 text-sm border-t border-header-text/20 pt-2">
            <Link
              href="/docs"
              className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                isDocs ? 'text-primary' : 'text-header-text/70'
              }`}
              onClick={() => { setIsMenuOpen(false); trackNav('docs'); }}
            >
              <BookOpen size={14} />
              Docs
            </Link>
            <Link
              href="/practice"
              className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                isPractice ? 'text-primary' : 'text-header-text/70'
              }`}
              onClick={() => { setIsMenuOpen(false); trackNav('practice'); }}
            >
              <GraduationCap size={14} />
              Practice
            </Link>
            <Link
              href="/exam"
              className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                isExam ? 'text-primary' : 'text-header-text/70'
              }`}
              onClick={() => { setIsMenuOpen(false); trackNav('exam'); }}
            >
              <Clock size={14} />
              Exam
            </Link>
            <a
              href={GITHUB_URL}
              className="flex items-center gap-2 text-header-text/70 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <SimpleGithubIcon size={14} />
              GitHub Repository
            </a>
            <a
              href={PORTFOLIO_URL}
              className="flex items-center gap-2 text-header-text/70 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <ExternalLink size={14} />
              Portfolio
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
