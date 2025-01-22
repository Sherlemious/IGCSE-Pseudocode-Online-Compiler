import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-primary dark:bg-dark-primary text-light-text px-6 py-4">
      <div className="max-w-144 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:text-secondary transition-colors duration-200">
            Pseudocode Compiler
          </Link>
        </h1>
        <nav className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <Link to="/" className="hover:text-secondary transition-colors duration-200">
            Home
          </Link>
          <Link to="/how-to-use" className="hover:text-secondary transition-colors duration-200">
            How to Use
          </Link>
          <a
            href="https://github.com/sherlemious"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/sherlemious"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors duration-200"
          >
            Portfolio
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
