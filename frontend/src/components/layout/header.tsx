import React from 'react';
import { Link } from 'react-router-dom'; // Ensure this import is correct

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-light-text shadow-cool h-16">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold">
          <Link to="/" className="hover:text-secondary transition duration-200">
            Pseudocode Compiler
          </Link>
        </div>

        <nav className="space-x-6">
          <Link to="/how-to-use" className="text-light-text hover:text-secondary transition duration-200">
            How to Use
          </Link>
          <a
            href="https://github.com/sherlemious"
            className="text-light-text hover:text-secondary transition duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://sherlemious.github.io/portfolio"
            className="text-light-text hover:text-secondary transition duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
