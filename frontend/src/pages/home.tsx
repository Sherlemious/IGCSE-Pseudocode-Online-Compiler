import React, { useState, useCallback } from 'react';
import CodeInput from '../components/compiler/codeInput';
import type { CursorPosition } from '../components/compiler/codeInput';
import OutputDisplay from '../components/compiler/outputDisplay';
import { useInterpreter } from '../interpreter/useInterpreter';

interface HomeProps {
  onRunningChange?: (running: boolean) => void;
  onCursorChange?: (pos: CursorPosition) => void;
  onLineCountChange?: (count: number) => void;
}

const Home: React.FC<HomeProps> = ({ onRunningChange, onCursorChange, onLineCountChange }) => {
  const [code, setCode] = useState('');
  const { entries, isRunning, waitingForInput, run, provideInput, stop, clearEntries } = useInterpreter();

  // Propagate running state to parent (for status bar)
  const prevRunning = React.useRef(false);
  React.useEffect(() => {
    if (prevRunning.current !== isRunning) {
      prevRunning.current = isRunning;
      onRunningChange?.(isRunning);
    }
  }, [isRunning, onRunningChange]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      onLineCountChange?.(newCode.split('\n').length);
    },
    [onLineCountChange],
  );

  const handleExampleSelect = useCallback(
    (exampleCode: string) => {
      setCode(exampleCode);
      onLineCountChange?.(exampleCode.split('\n').length);
    },
    [onLineCountChange],
  );

  const handleRunCode = async () => {
    if (!code.trim()) return;
    await run(code);
  };

  return (
    <div className="h-full flex flex-col bg-background text-light-text overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        <div className="flex-1 min-h-0 flex flex-col lg:border-r lg:border-border">
          <CodeInput
            code={code}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            isRunning={isRunning}
            onStop={stop}
            onSelectExample={handleExampleSelect}
            onCursorChange={onCursorChange}
          />
        </div>
        <div className="flex-1 min-h-0 flex flex-col border-t lg:border-t-0 border-border">
          <OutputDisplay
            entries={entries}
            isRunning={isRunning}
            waitingForInput={waitingForInput}
            onInputSubmit={provideInput}
            onClear={clearEntries}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
