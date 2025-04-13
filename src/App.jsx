import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PhotoPage from './pages/PhotoPage';
import InterviewPage from './pages/InterviewPage';
import AnnotationPage from './pages/AnnotationPage';
import './App.css';

// Font tester component
const FontTester = () => (
  <div style={{ padding: '20px' }}>
    <h2>Font Test</h2>
    <div style={{ marginBottom: '20px' }}>
      <p>Default font</p>
      <p style={{ fontFamily: 'p22-freely, serif' }}>p22-freely font</p>
      <p style={{ fontFamily: 'urw-din, sans-serif' }}>urw-din font</p>
      <p style={{ fontFamily: 'felt-tip-roman, cursive' }}>felt-tip-roman font</p>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <p className="font-p22">Tailwind font-p22 class</p>
      <p className="font-urwdin">Tailwind font-urwdin class</p>
      <p className="font-felttip">Tailwind font-felttip class</p>
    </div>
  </div>
);

function App() {
  // Log available fonts for debugging
  useEffect(() => {
    console.log("Checking loaded fonts...");
    try {
      document.fonts.ready.then(() => {
        console.log("All fonts loaded:", document.fonts);
        console.log("Available font families:", [...document.fonts].map(f => f.family));
      });
    } catch (e) {
      console.error("Error checking fonts:", e);
    }
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Separate component for content to use hooks that require router context
function AppContent() {
  const location = useLocation();
  const [showPhotoPage, setShowPhotoPage] = useState(false);
  const [showAnnotationPage, setShowAnnotationPage] = useState(false);
  
  useEffect(() => {
    // Show/hide based on current route
    setShowPhotoPage(location.pathname === '/photo');
    setShowAnnotationPage(location.pathname === '/annotation');
    
    // If on photo page, preload the annotation page
    if (location.pathname === '/photo') {
      setTimeout(() => {
        // Force preload by briefly showing it off-screen
        const preload = document.createElement('div');
        preload.style.position = 'absolute';
        preload.style.left = '-9999px';
        preload.style.height = '1px';
        preload.style.width = '1px';
        preload.style.overflow = 'hidden';
        document.body.appendChild(preload);
        
        const annotation = document.createElement('div');
        annotation.id = 'preloaded-annotation';
        preload.appendChild(annotation);
        
        setTimeout(() => {
          document.body.removeChild(preload);
        }, 1000);
      }, 500);
    }
  }, [location]);
  
  return (
    <div className="app-container" style={{ backgroundColor: '#BFB6A3', overflow: 'hidden' }}>
      <Routes>
        <Route path="/fonts" element={<FontTester />} />
        <Route index element={<HomePage />} />
        <Route path="photo" element={<PhotoPage />} /> 
        <Route path="annotation" element={<AnnotationPage />} />
        <Route path="interview" element={<InterviewPage />} />
      </Routes>
      
      {/* Preload annotation page when on photo page */}
      {showPhotoPage && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: '100%', 
          opacity: 0,
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh'
        }}>
          <AnnotationPage isPreloaded={true} />
        </div>
      )}
    </div>
  );
}

export default App;
