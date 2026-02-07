import React from 'react';

interface FooterProps {
  isRunning?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isRunning = false }) => {
  return (
    <footer className="h-7 bg-header-bg border-t border-border px-3 flex items-center justify-between text-xs font-mono shrink-0">
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${isRunning ? 'bg-warning animate-pulse' : 'bg-success'}`} />
        <span className="text-dark-text">{isRunning ? 'Running' : 'Ready'}</span>
      </div>
      <span className="text-dark-text">&copy; {new Date().getFullYear()} Abdelrahman Mohammed</span>
    </footer>
  );
};

export default Footer;
