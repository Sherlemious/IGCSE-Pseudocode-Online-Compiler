import React from 'react';
import Home from './pages/home';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow overflow-auto">
        <Home />
      </main>
    </div>
  );
};

export default App;
