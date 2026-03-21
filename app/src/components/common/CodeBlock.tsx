import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-2">
      <pre
        style={{ fontSize: 'var(--editor-font-size)' }}
        className="bg-code-bg border border-border p-3 rounded font-mono text-light-text overflow-x-auto
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
          scrollbar-track-background scrollbar-thumb-rounded-full leading-relaxed"
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-1.5 right-1.5 p-1.5 rounded bg-background/80 hover:bg-surface
                 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-dark-text" />}
      </button>
    </div>
  );
};

export default CodeBlock;
