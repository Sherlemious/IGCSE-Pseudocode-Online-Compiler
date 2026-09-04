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
  Bug,
  Tag,
} from 'lucide-react';
import SettingsPanel from './settingsPanel';
import UserMenu from '@/modules/auth/UserMenu';
import { useCommands } from '@/shared/ui/CommandPalette';
import { OPEN_BUG_REPORT_EVENT } from '@/shared/lib/events';

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
  const isExam =
    pathname === '/exam' ||
    pathname.startsWith('/exam/') ||
    pathname === '/exams' ||
    pathname.startsWith('/exams/') ||
    pathname.startsWith('/e/');
  const isCompilerPage = pathname === '/';
  const isPricing = pathname === '/pricing';
  const activeNavIndex = isDocs ? 0 : isPractice ? 1 : isExam ? 2 : -1;

  // Text-only nav links with a shared underline that glides between routes.
  const navLinkClass = (active: boolean) =>
    `relative z-10 rounded px-1.5 py-1 text-center transition-colors duration-200 ${
      active
        ? 'text-primary'
        : 'text-header-text/70 hover:text-header-text hover:bg-white/10'
    }`;

  return (
    <header className="bg-header-bg text-header-text border-b border-border select-none">
      <div className="px-3 py-1.5">
        <div className="flex justify-between items-center">
          {/* Brand + always-visible credit */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className={`group flex items-center gap-2 rounded-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isCompilerPage ? 'text-header-text' : 'text-header-text hover:text-primary'
              }`}
              title="Pseudocode Compiler"
              aria-label={isCompilerPage ? 'Pseudocode Compiler home' : 'Open Pseudocode Compiler'}
            >
              {isCompilerPage ? (
                <Braces className="h-4 w-4 text-header-text" strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <ArrowLeft
                  className="h-4 w-4 text-header-text/60 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-primary"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              )}
              <span className="text-sm font-bold tracking-tight text-header-text whitespace-nowrap">
                Pseudocode <span className="font-normal text-header-text/60">Compiler</span>
              </span>
            </Link>
            <span className="hidden md:inline text-header-text/20 select-none" aria-hidden>
              ·
            </span>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline text-[11px] text-header-text/40 hover:text-primary transition-colors whitespace-nowrap"
              title="Made by Sherlemious — view portfolio"
            >
              by Sherlemious
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <div className="relative grid w-45 grid-cols-3">
              <Link
                href="/docs"
                data-tour="docs-link"
                onClick={() => trackNav('docs')}
                className={navLinkClass(isDocs)}
                aria-current={isDocs ? 'page' : undefined}
              >
                Docs
              </Link>
              <Link
                href="/practice"
                data-tour="practice-link"
                onClick={() => trackNav('practice')}
                className={navLinkClass(isPractice)}
                aria-current={isPractice ? 'page' : undefined}
              >
                Practice
              </Link>
              <Link
                href="/exam"
                onClick={() => trackNav('exam')}
                className={navLinkClass(isExam)}
                aria-current={isExam ? 'page' : undefined}
              >
                Exam
              </Link>
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-0 left-0 w-1/3 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                  activeNavIndex === 1
                    ? 'translate-x-full'
                    : activeNavIndex === 2
                      ? 'translate-x-[200%]'
                      : 'translate-x-0'
                } ${activeNavIndex === -1 ? 'opacity-0' : 'opacity-100'}`}
              >
                <span className="mx-1.5 block h-0.5 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]" />
              </span>
            </div>
            <Link
              href="/pricing"
              onClick={() => trackNav('pricing')}
              className={navLinkClass(isPricing)}
              aria-current={isPricing ? 'page' : undefined}
            >
              Pricing
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
            <button
              data-tour="report-bug"
              onClick={() => window.dispatchEvent(new CustomEvent(OPEN_BUG_REPORT_EVENT))}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-header-text/70 hover:text-header-text hover:bg-white/10 transition duration-200"
              title="Report a bug"
            >
              <Bug size={13} />
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
            <Link
              href="/pricing"
              className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                isPricing ? 'text-primary' : 'text-header-text/70'
              }`}
              onClick={() => { setIsMenuOpen(false); trackNav('pricing'); }}
            >
              <Tag size={14} />
              Pricing
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
            <button
              className="w-full flex items-center gap-2 text-header-text/70 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10"
              onClick={() => {
                setIsMenuOpen(false);
                window.dispatchEvent(new CustomEvent(OPEN_BUG_REPORT_EVENT));
              }}
            >
              <Bug size={14} />
              Report a bug
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
