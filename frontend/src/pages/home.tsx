import React, { useState } from 'react';
import CodeInput from '../components/compiler/codeInput';
import OutputDisplay from '../components/compiler/outputDisplay';
import ExamplePicker from '../components/compiler/examplePicker';
import { compilePseudocode } from '../utils/api';
import runPythonCode from '../utils/runPython';

const Home: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExampleSelect = (code: string) => {
    setCode(code);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please enter some pseudocode to compile and run.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setOutput([]);

      const pythonCode = await compilePseudocode(code);
      console.log(pythonCode);
      runPythonCode(pythonCode, setOutput);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-background text-light-text overflow-hidden">
      <div className="p-4 border-b-2 border-dark-text">
        <ExamplePicker onSelectExample={handleExampleSelect} />
      </div>
      <div className=" flex-1 flex flex-col lg:flex-row">
        <CodeInput code={code} onCodeChange={setCode} onRunCode={handleRunCode} isLoading={isLoading} />
        <OutputDisplay output={output.join('\n')} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Home;
