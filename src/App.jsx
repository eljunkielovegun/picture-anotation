import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PhotoPage from './pages/PhotoPage';
import InterviewPage from './pages/InterviewPage';
import AnnotationPage from './pages/AnnotationPage';
import PageTransition from './components/PageTransition';
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
  const navigate = useNavigate();
  const [prevPathname, setPrevPathname] = useState('');
  const [currentPage, setCurrentPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [transitionType, setTransitionType] = useState('photoToAnnotation');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle page transitions based on pathname changes
  useEffect(() => {
    if (prevPathname === '') {
      // First render, just set the current page
      setCurrentPage(getComponentForPath(location.pathname));
      setPrevPathname(location.pathname);
      return;
    }

    // Determine transition type based on navigation direction
    if (prevPathname === '/photo' && location.pathname === '/annotation') {
      setTransitionType('photoToAnnotation');
    } else if (prevPathname === '/annotation' && location.pathname === '/photo') {
      setTransitionType('annotationToPhoto');
    }

    // Start transition
    setIsTransitioning(true);
    setPrevPage(getComponentForPath(prevPathname));
    setCurrentPage(getComponentForPath(location.pathname));
    setPrevPathname(location.pathname);
  }, [location.pathname]);

  // Helper to get the component for a path
  const getComponentForPath = (path) => {
    switch (path) {
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

  // Handle transition completion
  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setPrevPage(null);
  };

  return (
    <div className="app-container relative" style={{ backgroundColor: '#BFB6A3', overflow: 'hidden' }}>
      {/* Current page */}
      <PageTransition
        inProp={true}
        transitionKey={location.pathname}
        transitionType={transitionType}
        onExited={handleTransitionComplete}
      >
        {currentPage}
      </PageTransition>

      {/* Previous page, shown during transitions */}
      {isTransitioning && prevPage && (
        <PageTransition
          inProp={false}
          transitionKey={`prev-${prevPathname}`}
          transitionType={transitionType}
        >
          {prevPage}
        </PageTransition>
      )}
    </div>
  );
}

export default App;