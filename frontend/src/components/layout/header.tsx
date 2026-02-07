import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Diamond } from 'lucide-react';
import SettingsPanel from './settingsPanel';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-header-bg text-header-text border-b border-border">
      <div className="px-3 py-1.5">
        {/* Desktop & Mobile Layout */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 text-base font-semibold">
            <Diamond className="h-4 w-4 text-primary" />
            <Link to="/" className="hover:opacity-80 transition duration-200">
              Pseudocode Compiler
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 text-sm">
            <Link to="/how-to-use" className="text-dark-text hover:text-light-text transition duration-200">
              Docs
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="text-dark-text hover:text-light-text transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.sherlemious.com"
              className="text-dark-text hover:text-light-text transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
            <SettingsPanel />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <SettingsPanel />
            <button
              className="p-1 rounded hover:opacity-80 transition duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-2 space-y-1 pb-2 text-sm">
            <Link
              to="/how-to-use"
              className="block text-dark-text hover:text-light-text transition duration-200 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="block text-dark-text hover:text-light-text transition duration-200 py-1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </a>
            <a
              href="https://www.sherlemious.com"
              className="block text-dark-text hover:text-light-text transition duration-200 py-1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
