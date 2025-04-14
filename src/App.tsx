import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import RequirementSubmissionForm from './components/FileUpload';
import FloatingNavbar from './components/FloatingNavbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/submit-requirement" element={<RequirementSubmissionForm />} />
        </Routes>
        <FloatingNavbar />
      </div>
    </Router>
  );
}

export default App;