import React, { useState, useCallback } from 'react';
import CodeInput from '../components/compiler/codeInput';
import type { CursorPosition } from '../components/compiler/codeInput';
import OutputDisplay from '../components/compiler/outputDisplay';
import { useInterpreter } from '../interpreter/useInterpreter';

export interface EditorTab {
  id: string;
  name: string;
  content: string;
}

interface HomeProps {
  onRunningChange?: (running: boolean) => void;
  onCursorChange?: (pos: CursorPosition) => void;
  onLineCountChange?: (count: number) => void;
}

const MAIN_TAB: EditorTab = { id: 'main', name: 'main.pseudo', content: '' };

const Home: React.FC<HomeProps> = ({ onRunningChange, onCursorChange, onLineCountChange }) => {
  const [tabs, setTabs] = useState<EditorTab[]>([MAIN_TAB]);
  const [activeTabId, setActiveTabId] = useState('main');
  const {
    entries, isRunning, waitingForInput,
    isStepping, debugLine, debugVariables,
    run, debugRun, step, continueExecution,
    provideInput, stop, clearEntries,
  } = useInterpreter();

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  // Propagate running state to parent (for status bar)
  const prevRunning = React.useRef(false);
  React.useEffect(() => {
    if (prevRunning.current !== isRunning) {
      prevRunning.current = isRunning;
      onRunningChange?.(isRunning);
    }
  }, [isRunning, onRunningChange]);

  // Update line count when active tab changes
  React.useEffect(() => {
    onLineCountChange?.(activeTab.content.split('\n').length);
  }, [activeTab.content, onLineCountChange]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, content: newCode } : t)));
    },
    [activeTabId],
  );

  const handleExampleSelect = useCallback(
    (exampleCode: string) => {
      setTabs((prev) => prev.map((t) => (t.id === 'main' ? { ...t, content: exampleCode } : t)));
      setActiveTabId('main');
    },
    [],
  );

  const handleOpenFile = useCallback((fileName: string, content: string) => {
    const tabId = `file:${fileName}`;
    setTabs((prev) => {
      const existing = prev.find((t) => t.id === tabId);
      if (existing) {
        return prev.map((t) => (t.id === tabId ? { ...t, content } : t));
      }
      return [...prev, { id: tabId, name: fileName, content }];
    });
    setActiveTabId(tabId);
  }, []);

  const handleCloseTab = useCallback(
    (tabId: string) => {
      if (tabId === 'main') return;
      setTabs((prev) => {
        const newTabs = prev.filter((t) => t.id !== tabId);
        if (tabId === activeTabId) {
          const closedIndex = prev.findIndex((t) => t.id === tabId);
          const newActive = newTabs[Math.min(closedIndex, newTabs.length - 1)] ?? newTabs[0];
          setActiveTabId(newActive.id);
        }
        return newTabs;
      });
    },
    [activeTabId],
  );

  const handleTabSwitch = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const handleRunCode = async () => {
    if (!activeTab.content.trim()) return;
    await run(activeTab.content);
  };

  const handleDebugCode = async () => {
    if (!activeTab.content.trim()) return;
    await debugRun(activeTab.content);
  };

  return (
    <div className="h-full flex flex-col bg-background text-light-text overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        <div className="flex-1 min-h-0 flex flex-col lg:border-r lg:border-border">
          <CodeInput
            code={activeTab.content}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            onDebugCode={handleDebugCode}
            isRunning={isRunning}
            isStepping={isStepping}
            debugLine={debugLine}
            onStep={step}
            onContinue={continueExecution}
            onStop={stop}
            onSelectExample={handleExampleSelect}
            onCursorChange={onCursorChange}
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSwitch={handleTabSwitch}
            onCloseTab={handleCloseTab}
            onOpenFile={handleOpenFile}
          />
        </div>
        <div className="flex-1 min-h-0 flex flex-col border-t lg:border-t-0 border-border">
          <OutputDisplay
            entries={entries}
            isRunning={isRunning}
            waitingForInput={waitingForInput}
            onInputSubmit={provideInput}
            onClear={clearEntries}
            isStepping={isStepping}
            debugVariables={debugVariables}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
