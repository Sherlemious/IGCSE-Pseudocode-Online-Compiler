import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SettingsPanel from './settingsPanel';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-header-bg text-header-text shadow-cool">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Desktop & Mobile Layout */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-semibold">
            <Link to="/" className="hover:opacity-80 transition duration-200">
              Pseudocode Compiler
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/how-to-use" className="hover:opacity-80 transition duration-200">
              How to Use
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="hover:opacity-80 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repo
            </a>
            <a
              href="https://www.sherlemious.com"
              className="hover:opacity-80 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
            <SettingsPanel />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <SettingsPanel />
            <button
              className="p-2 rounded-lg hover:opacity-80 transition duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/how-to-use"
              className="block hover:opacity-80 transition duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How to Use
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="block hover:opacity-80 transition duration-200 py-2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub Repo
            </a>
            <a
              href="https://www.sherlemious.com"
              className="block hover:opacity-80 transition duration-200 py-2"
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
