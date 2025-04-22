import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PhotoPage from './pages/PhotoPage';
import InterviewPage from './pages/InterviewPage';
import AnnotationPage from './pages/AnnotationPage';
import TransitionContainer from './components/TransitionContainer';
import './App.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Separate component for content to use hooks that require router context
function AppContent() {
  const location = useLocation();
  const [prevPathname, setPrevPathname] = useState('');
  const [transitionDirection, setTransitionDirection] = useState('enter-right');
  const [expandPosition, setExpandPosition] = useState(null);
  
  // Track page transitions
  useEffect(() => {
    if (prevPathname === '') {
      // First load, no animation
      setPrevPathname(location.pathname);
      return;
    }
    
    // Get transition position info if available
    const positionData = sessionStorage.getItem('transition_position');
    let position = null;
    
    if (positionData) {
      try {
        position = JSON.parse(positionData);
        setExpandPosition(position);
        // Clear the data after using it
        sessionStorage.removeItem('transition_position');
      } catch (e) {
        console.error('Error parsing transition position:', e);
      }
    }
    
    // Determine transition direction based on navigation pattern
    if (prevPathname === '/photo' && location.pathname === '/annotation') {
      // Moving from photo to annotation - use expand from center if we have position data
      if (position) {
        setTransitionDirection('expand-center');
      } else {
        // Fallback to slide from right
        setTransitionDirection('enter-right');
      }
    } else if (prevPathname === '/annotation' && location.pathname === '/photo') {
      // Moving from annotation to photo - use shrink to center if we have position data
      if (position) {
        setTransitionDirection('shrink-center');
      } else {
        // Fallback to slide from left
        setTransitionDirection('enter-left');
      }
    } else {
      // Default direction for other page transitions (fading in from center instead of sliding)
      setTransitionDirection('fade-in');
    }
    
    setPrevPathname(location.pathname);
  }, [location.pathname]);
  
  // For proper cleanup after shrink animation
  useEffect(() => {
    if (transitionDirection === 'shrink-center') {
      // Clear any previous transition component after animation completes
      const timer = setTimeout(() => {
        // Force a re-render to ensure clean state
        setExpandPosition(null);
      }, 700); // Slightly longer than animation duration
      
      return () => clearTimeout(timer);
    }
  }, [transitionDirection]);
  
  // Render the appropriate component based on the current path
  const renderComponent = () => {
    switch (location.pathname) {
      case '/':
        return <HomePage />;
      case '/photo':
        return <PhotoPage />;
      case '/annotation':
        return <AnnotationPage />;
      case '/interview':
        return <InterviewPage />;
      default:
        return <HomePage />;
    }
  };

  // Track transition states
  const isExpanding = transitionDirection === 'expand-center';
  const isShrinking = transitionDirection === 'shrink-center';
  
  // Track the previous component for coordinated transitions
  const [prevComp, setPrevComp] = useState(null);
  const [fadeClass, setFadeClass] = useState('');
  
  // When transitioning between pages, handle coordinated fades
  useEffect(() => {
    if (isExpanding || isShrinking) {
      // Store the previous component to fade out
      if (isExpanding) {
        // When expanding to annotation, fade out photo page
        setPrevComp(<PhotoPage />);
        setFadeClass('fade-out');
      } else if (isShrinking) {
        // When shrinking back to photo, the annotation is already handled
        setPrevComp(null);
      }
      
      // Clear the previous component after animation
      const timer = setTimeout(() => {
        setPrevComp(null);
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [transitionDirection]);
  
  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ backgroundColor: '#BFB6A3' }}>
      {/* Base layer - the destination when shrinking */}
      {isShrinking && (
        <div className="absolute inset-0 z-0 fade-in">
          {renderComponent()}
        </div>
      )}
      
      {/* Previous component layer for fading */}
      {prevComp && (
        <div className={`absolute inset-0 z-5 ${fadeClass}`}>
          {prevComp}
        </div>
      )}
      
      {/* The active transition container */}
      <TransitionContainer 
        direction={transitionDirection} 
        expandPosition={expandPosition}
        className={isShrinking ? 'z-10' : isExpanding ? 'z-20' : ''}
      >
        {!isShrinking ? renderComponent() : null}
      </TransitionContainer>
    </div>
  );
}

export default App;