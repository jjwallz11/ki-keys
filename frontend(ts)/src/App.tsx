import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define route for Signup */}
        <Route path="/" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;