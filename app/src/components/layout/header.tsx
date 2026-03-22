'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siGithub } from 'simple-icons/icons';
import {
  Menu,
  X,
  Braces,
  BookOpen,
  ExternalLink,
  Keyboard,
  GraduationCap,
  Clock,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import SettingsPanel from './settingsPanel';
import UserMenu from '../auth/UserMenu';
import { PREMIUM_GATING_ENABLED } from '@/lib/featureFlags';

const SHORTCUTS = [
  { keys: 'Ctrl + Enter', desc: 'Run code' },
  { keys: 'Ctrl + Shift + K', desc: 'Stop execution' },
  { keys: 'Tab', desc: 'Insert 4 spaces' },
  { keys: 'Ctrl + S', desc: 'Auto-saved' },
  { keys: 'Esc', desc: 'Close modals' },
];

const SimpleGithubIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className={className}>
    <path fill="currentColor" d={siGithub.path} />
  </svg>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const pathname = usePathname();
  const isDocs = pathname === '/docs' || pathname.startsWith('/docs/');
  const isPractice = pathname === '/practice' || pathname.startsWith('/practice/');
  const isExam = pathname === '/exam' || pathname.startsWith('/exam/');
  const isAnalytics = pathname === '/analytics';
  const isCompilerPage = pathname === '/';
  const showPremiumComingSoon = !PREMIUM_GATING_ENABLED;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
      if (e.key === 'Escape') setShowShortcuts(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <header className="bg-header-bg text-header-text border-b border-border select-none">
        <div className="px-3 py-1.5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className={`flex items-center gap-2 transition duration-200 ${
                isCompilerPage ? 'text-header-text' : 'text-header-text hover:text-primary'
              }`}
              title={isCompilerPage ? 'Pseudocode Compiler' : 'Back to Compiler'}
              aria-label={isCompilerPage ? 'Pseudocode Compiler home' : 'Back to Compiler'}
            >
              <Braces className="h-4 w-4 text-header-text" strokeWidth={2.5} />
              <span className="text-sm font-bold tracking-tight text-header-text">
                Pseudocode <span className="font-normal text-header-text/60">Compiler</span>
              </span>
              {!isCompilerPage && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <ArrowLeft size={10} />
                  Back
                </span>
              )}
            </Link>

            {showPremiumComingSoon && (
              <span className="hidden lg:block text-[10px] text-header-text/35 font-medium tracking-widest uppercase select-none">
                Beta · All features free
              </span>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <Link
                href="/docs"
                data-tour="docs-link"
                className={`flex items-center gap-1 px-2 py-1 rounded hover:text-header-text hover:bg-white/10 transition duration-200 ${
                  isDocs ? 'text-primary' : 'text-header-text/70'
                }`}
              >
                <BookOpen size={13} />
                Docs
              </Link>
              <Link
                href="/practice"
                data-tour="practice-link"
                className={`flex items-center gap-1 px-2 py-1 rounded hover:text-header-text hover:bg-white/10 transition duration-200 ${
                  isPractice ? 'text-primary' : 'text-header-text/70'
                }`}
              >
                <GraduationCap size={13} />
                Practice
              </Link>
              <Link
                href="/exam"
                className={`flex items-center gap-1 px-2 py-1 rounded hover:text-header-text hover:bg-white/10 transition duration-200 ${
                  isExam ? 'text-primary' : 'text-header-text/70'
                }`}
              >
                <Clock size={13} />
                Exam
              </Link>
              <Link
                href="/analytics"
                className={`flex items-center gap-1 px-2 py-1 rounded hover:text-header-text hover:bg-white/10 transition duration-200 ${
                  isAnalytics ? 'text-primary' : 'text-header-text/70'
                }`}
              >
                <BarChart3 size={13} />
                Analytics
              </Link>
              <a
                href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
                className="flex items-center gap-1 px-2 py-1 rounded text-header-text/70 hover:text-header-text hover:bg-white/10 transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SimpleGithubIcon size={13} />
                GitHub
              </a>
              <a
                href="https://www.sherlemious.com"
                className="flex items-center gap-1 px-2 py-1 rounded text-header-text/70 hover:text-header-text hover:bg-white/10 transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={12} />
                Portfolio
              </a>
              <div className="w-px h-4 bg-header-text/20 mx-1" />
              <button
                onClick={() => setShowShortcuts(true)}
                className="p-1 rounded hover:bg-white/10 transition duration-200 text-header-text/70 hover:text-header-text"
                title="Keyboard Shortcuts (Ctrl+/)"
              >
                <Keyboard size={14} />
              </button>
              <SettingsPanel />
              <UserMenu />
            </nav>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={() => setShowShortcuts(true)}
                className="p-1 rounded hover:bg-white/10 transition duration-200 text-header-text/70 hover:text-header-text"
                title="Keyboard Shortcuts"
              >
                <Keyboard size={14} />
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
              {showPremiumComingSoon && (
                <div className="mb-2 text-[10px] text-header-text/40 font-medium tracking-widest uppercase">
                  Beta · All features free
                </div>
              )}
              <Link
                href="/docs"
                className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                  isDocs ? 'text-primary' : 'text-header-text/70'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen size={14} />
                Docs
              </Link>
              <Link
                href="/practice"
                className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                  isPractice ? 'text-primary' : 'text-header-text/70'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <GraduationCap size={14} />
                Practice
              </Link>
              <Link
                href="/exam"
                className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                  isExam ? 'text-primary' : 'text-header-text/70'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Clock size={14} />
                Exam
              </Link>
              <Link
                href="/analytics"
                className={`flex items-center gap-2 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10 ${
                  isAnalytics ? 'text-primary' : 'text-header-text/70'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 size={14} />
                Analytics
              </Link>
              <a
                href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
                className="flex items-center gap-2 text-header-text/70 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                <SimpleGithubIcon size={14} />
                GitHub Repository
              </a>
              <a
                href="https://www.sherlemious.com"
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

      {/* Keyboard shortcuts modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-surface border border-border rounded-lg shadow-intense w-full max-w-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-9 border-b border-border flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <Keyboard size={13} className="text-primary" />
                <span className="text-xs font-semibold tracking-wider text-light-text uppercase">Shortcuts</span>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-dark-text hover:text-light-text p-0.5 rounded hover:bg-background transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {SHORTCUTS.map((s) => (
                <div key={s.keys} className="flex items-center justify-between text-xs">
                  <span className="text-dark-text">{s.desc}</span>
                  <kbd className="text-[10px]">{s.keys}</kbd>
                </div>
              ))}
              <div className="pt-2 border-t border-border/30 text-[10px] text-dark-text/50 text-center">
                Press <kbd>Ctrl+/</kbd> to toggle this panel
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
