import React from 'react';

const Kw = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-code-bg border border-border px-1.5 py-0.5 rounded font-mono text-primary text-[0.9em]">
    {children}
  </code>
);

export default Kw;
