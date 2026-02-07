import React, { useState } from 'react';
import CodeInput from '../components/compiler/codeInput';
import OutputDisplay from '../components/compiler/outputDisplay';
import { useInterpreter } from '../interpreter/useInterpreter';

const Home: React.FC = () => {
  const [code, setCode] = useState('');
  const { entries, isRunning, waitingForInput, run, provideInput, stop, clearEntries } = useInterpreter();

  const handleExampleSelect = (code: string) => {
    setCode(code);
  };

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
            onCodeChange={setCode}
            onRunCode={handleRunCode}
            isRunning={isRunning}
            onStop={stop}
            onSelectExample={handleExampleSelect}
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
