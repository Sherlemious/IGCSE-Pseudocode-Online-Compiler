'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { siGithub } from 'simple-icons/icons';
import {
  Menu,
  X,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Clock,
  ArrowLeft,
  Route,
  Search,
  Bug,
  Tag,
  Users,
} from 'lucide-react';
import { LogoMark, LogoWordmark } from '@/shared/brand';
import SettingsPanel from './settingsPanel';
import UserMenu from '@/modules/auth/UserMenu';
import { useCommands } from '@/shared/ui/CommandPalette';
import { OPEN_BUG_REPORT_EVENT } from '@/shared/lib/events';
import { useSession } from 'next-auth/react';
import { sessionShowsClasses } from '@/modules/classes/visibility';

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
  const { data: session } = useSession();
  const showClasses = sessionShowsClasses(session?.user);

  const trackNav = useCallback(
    (destination: string) => {
      ph?.capture('nav_clicked', { destination, from: pathname });
    },
    [ph, pathname],
  );
  const isDocs = pathname === '/docs' || pathname.startsWith('/docs/');
  const isLearn = pathname === '/learn' || pathname.startsWith('/learn/');
  const isPractice = pathname === '/practice' || pathname.startsWith('/practice/');
  const isExam =
    pathname === '/exam' ||
    pathname.startsWith('/exam/') ||
    pathname === '/exams' ||
    pathname.startsWith('/exams/') ||
    pathname.startsWith('/e/');
  const isClasses = pathname === '/classes' || pathname.startsWith('/classes/');
  const isCompilerPage = pathname === '/';
  const isPricing = pathname === '/pricing';
  const activeNavIndex = isDocs
    ? 0
    : isLearn
      ? 1
      : isPractice
        ? 2
        : isExam
          ? 3
          : showClasses && isClasses
            ? 4
            : -1;

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
              className={`group/logo flex items-center gap-2 rounded-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                isCompilerPage ? 'text-header-text' : 'text-header-text hover:text-primary'
              }`}
              title="Pseudocode Compiler"
              aria-label={isCompilerPage ? 'Pseudocode Compiler home' : 'Open Pseudocode Compiler'}
            >
              {isCompilerPage ? (
                <LogoMark size={22} animate className="text-header-text shrink-0" />
              ) : (
                <ArrowLeft
                  className="h-4 w-4 text-header-text/60 transition-transform duration-200 group-hover/logo:-translate-x-0.5 group-hover/logo:text-primary"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              )}
              <LogoWordmark className="text-header-text whitespace-nowrap truncate max-w-[42vw] sm:max-w-none" />
            </Link>
            <span className="hidden lg:inline text-header-text/20 select-none" aria-hidden>
              ·
            </span>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline font-display italic text-[12px] text-header-text/40 hover:text-brand-red transition-colors whitespace-nowrap"
              title="Made by Sherlemious — view portfolio"
            >
              by Sherlemious
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <div className={`relative grid ${showClasses ? 'w-80 grid-cols-5' : 'w-64 grid-cols-4'}`}>
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
                href="/learn"
                data-tour="learn-link"
                onClick={() => trackNav('learn')}
                className={navLinkClass(isLearn)}
                aria-current={isLearn ? 'page' : undefined}
              >
                Learn
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
              {showClasses && (
                <Link
                  href="/classes"
                  onClick={() => trackNav('classes')}
                  className={navLinkClass(isClasses)}
                  aria-current={isClasses ? 'page' : undefined}
                >
                  Classes
                </Link>
              )}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-0 left-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                  showClasses ? 'w-1/5' : 'w-1/4'
                } ${
                  activeNavIndex === 1
                    ? 'translate-x-full'
                    : activeNavIndex === 2
                      ? 'translate-x-[200%]'
                      : activeNavIndex === 3
                        ? 'translate-x-[300%]'
                        : activeNavIndex === 4
                          ? 'translate-x-[400%]'
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
          <div className="lg:hidden flex items-center gap-1">
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
          <nav className="lg:hidden mt-2 space-y-0.5 pb-2 text-sm border-t border-header-text/20 pt-2">
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
              href="/learn"
              className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                isLearn ? 'text-primary' : 'text-header-text/70'
              }`}
              onClick={() => { setIsMenuOpen(false); trackNav('learn'); }}
            >
              <Route size={14} />
              Learn
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
            {showClasses && (
              <Link
                href="/classes"
                className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                  isClasses ? 'text-primary' : 'text-header-text/70'
                }`}
                onClick={() => { setIsMenuOpen(false); trackNav('classes'); }}
              >
                <Users size={14} />
                Classes
              </Link>
            )}
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
