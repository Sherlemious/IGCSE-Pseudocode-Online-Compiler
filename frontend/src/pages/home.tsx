import React, { useState } from 'react';
import CodeInput from '../components/compiler/codeInput';
import OutputDisplay from '../components/compiler/outputDisplay';
import ExamplePicker from '../components/compiler/examplePicker';
import { useInterpreter } from '../interpreter/useInterpreter';

const Home: React.FC = () => {
  const [code, setCode] = useState('');
  const { entries, isRunning, waitingForInput, run, provideInput, stop } = useInterpreter();

  const handleExampleSelect = (code: string) => {
    setCode(code);
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    await run(code);
  };

  return (
    <div className="min-h-full flex flex-col bg-background text-light-text overflow-hidden">
      <div className="p-4 border-b-2 border-dark-text">
        <ExamplePicker onSelectExample={handleExampleSelect} />
      </div>
      <div className=" flex-1 flex flex-col lg:flex-row">
        <CodeInput code={code} onCodeChange={setCode} onRunCode={handleRunCode} isRunning={isRunning} onStop={stop} />
        <OutputDisplay
          entries={entries}
          isRunning={isRunning}
          waitingForInput={waitingForInput}
          onInputSubmit={provideInput}
        />
      </div>
    </div>
  );
};

export default Home;
