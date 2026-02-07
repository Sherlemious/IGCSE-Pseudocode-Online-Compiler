import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import HowToUse from './pages/howToUse';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import type { CursorPosition } from './components/compiler/codeInput';

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [cursor, setCursor] = useState<CursorPosition>({ line: 1, col: 1 });
  const [lineCount, setLineCount] = useState(1);

  const handleRunningChange = useCallback((running: boolean) => {
    setIsRunning(running);
  }, []);

  const handleCursorChange = useCallback((pos: CursorPosition) => {
    setCursor(pos);
  }, []);

  const handleLineCountChange = useCallback((count: number) => {
    setLineCount(count);
  }, []);

  return (
    <Router>
      <div className="flex flex-col max-h-screen overflow-hidden">
        <Header />
        <main className="h-screen flex-grow overflow-hidden">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onRunningChange={handleRunningChange}
                  onCursorChange={handleCursorChange}
                  onLineCountChange={handleLineCountChange}
                />
              }
            />
            <Route path="/how-to-use" element={<HowToUse />} />
          </Routes>
        </main>
        <Footer isRunning={isRunning} cursor={cursor} lineCount={lineCount} />
      </div>
    </Router>
  );
};

export default App;
