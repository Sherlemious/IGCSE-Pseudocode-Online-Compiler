import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="h-12 bg-background border-t border-dark-text">
      <div className="max-w-144 mx-auto h-full px-6 flex items-center justify-center">
        <p className="text-sm text-dark-text">© {new Date().getFullYear()} Abdelrahman Mohammed.</p>
      </div>
    </footer>
  );
};

export default Footer;
