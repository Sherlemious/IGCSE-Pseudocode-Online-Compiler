import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Braces, BookOpen, Github, ExternalLink } from 'lucide-react';
import SettingsPanel from './settingsPanel';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-header-bg text-header-text border-b border-border select-none">
      <div className="px-3 py-1.5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition duration-200">
            <Braces className="h-4 w-4 text-primary" strokeWidth={2.5} />
            <span className="text-sm font-bold tracking-tight">
              Pseudo<span className="text-primary">Code</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <Link
              to="/how-to-use"
              className="flex items-center gap-1 px-2 py-1 rounded text-dark-text hover:text-light-text hover:bg-white/10 transition duration-200"
            >
              <BookOpen size={13} />
              Docs
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="flex items-center gap-1 px-2 py-1 rounded text-dark-text hover:text-light-text hover:bg-white/10 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={13} />
              GitHub
            </a>
            <a
              href="https://www.sherlemious.com"
              className="flex items-center gap-1 px-2 py-1 rounded text-dark-text hover:text-light-text hover:bg-white/10 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={12} />
              Portfolio
            </a>
            <div className="w-px h-4 bg-border/50 mx-1" />
            <SettingsPanel />
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1">
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
          <nav className="md:hidden mt-2 space-y-0.5 pb-2 text-sm border-t border-border/30 pt-2">
            <Link
              to="/how-to-use"
              className="flex items-center gap-2 text-dark-text hover:text-light-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/5"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={14} />
              Documentation
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="flex items-center gap-2 text-dark-text hover:text-light-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/5"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <Github size={14} />
              GitHub Repository
            </a>
            <a
              href="https://www.sherlemious.com"
              className="flex items-center gap-2 text-dark-text hover:text-light-text transition duration-200 py-1.5 px-1 rounded hover:bg-white/5"
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
