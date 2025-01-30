import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import for React Router
import Home from './pages/home';
import HowToUse from './pages/howToUse';
import Header from './components/layout/header';
import Footer from './components/layout/footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col max-h-screen  overflow-hidden">
        <Header />
        {/* Main content */}
        <main className="h-screen flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-to-use" element={<HowToUse />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
