import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Braces, BookOpen, Github, ExternalLink, Keyboard } from 'lucide-react';
import SettingsPanel from './settingsPanel';

const SHORTCUTS = [
  { keys: 'Ctrl + Enter', desc: 'Run code' },
  { keys: 'Ctrl + Shift + K', desc: 'Stop execution' },
  { keys: 'Tab', desc: 'Insert 4 spaces' },
  { keys: 'Ctrl + S', desc: 'Auto-saved' },
  { keys: 'Esc', desc: 'Close modals' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Global Ctrl+? shortcut to open cheatsheet
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
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition duration-200">
              <Braces className="h-4 w-4 text-header-text" strokeWidth={2.5} />
              <span className="text-sm font-bold tracking-tight text-header-text">
                Pseudocode <span className="font-normal text-header-text/60">Compiler</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <Link
                to="/how-to-use"
                className="flex items-center gap-1 px-2 py-1 rounded text-header-text/70 hover:text-header-text hover:bg-white/10 transition duration-200"
              >
                <BookOpen size={13} />
                Docs
              </Link>
              <a
                href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
                className="flex items-center gap-1 px-2 py-1 rounded text-header-text/70 hover:text-header-text hover:bg-white/10 transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={13} />
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
                to="/how-to-use"
                className="flex items-center gap-2 text-header-text/70 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen size={14} />
                Docs
              </Link>
              <a
                href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
                className="flex items-center gap-2 text-header-text/70 hover:text-header-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/10"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                <Github size={14} />
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
