import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-light-text shadow-cool">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Desktop & Mobile Layout */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-semibold">
            <Link to="/" className="hover:text-secondary transition duration-200">
              Pseudocode Compiler
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/how-to-use" className="text-light-text hover:text-secondary transition duration-200">
              How to Use
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="text-light-text hover:text-secondary transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repo
            </a>
            <a
              href="https://www.sherlemious.com"
              className="text-light-text hover:text-secondary transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface transition duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/how-to-use"
              className="block text-light-text hover:text-secondary transition duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How to Use
            </Link>
            <a
              href="https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler"
              className="block text-light-text hover:text-secondary transition duration-200 py-2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub Repo
            </a>
            <a
              href="https://www.sherlemious.com"
              className="block text-light-text hover:text-secondary transition duration-200 py-2"
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
