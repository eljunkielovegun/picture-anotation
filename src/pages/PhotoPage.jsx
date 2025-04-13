import photoData from '../data/annotations';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
// import './photopage.css';
// Import styles directly in index.css with Tailwind

// Intro Text Component
const IntroTextPanel = ({ paragraphs }) => {
  return (
    <div 
      
      className="rounded-lg shadow-xl p-6 text-sm leading-relaxed max-h-[60vh] overflow-visible p-[2vw] border border-[#a59885]"
    >
      <h3 className="font-p22-freely text-xl mb-4">About This Photo</h3>
      {paragraphs.map((p, idx) => (
        <p key={idx} className="mb-3 last:mb-0 text-left">{p}</p>
      ))}
    </div>
  );
};

// Photo Credit Component
const PhotoCreditsPanel = ({ credit }) => {
  return (
    <div 
      style={{ backgroundColor: '#2C3925', color: 'white' }} 
      className="p-5 leading-snug font-felt-tip shadow-xl  "
    >
      <p className="mb-1.5 text-left translate-x-[10vw]">
        {credit.photographer}<br/>
        {credit.title}, {credit.year}<br/>
        {credit.archiveNo}
      </p>
    </div>
  );
};

export default function PhotoPage() {
  const navigate = useNavigate();
  const { titleText, credit } = photoData.photo;
  const { paragraphs } = photoData.intro;
  const transformRef = React.useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [mouseStart, setMouseStart] = useState(null);
  const [mouseEnd, setMouseEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Check if coming back from annotation page
  useEffect(() => {
    // Detect if we're coming from annotation page (could be a back navigation)
    const fromAnnotation = sessionStorage.getItem('lastPhotoPosition') !== null;
    
    if (fromAnnotation) {
      // Start with the page offscreen to the right
      setIsEntering(true);
      
      // Then animate it in - with a longer delay to ensure smoother transition
      setTimeout(() => {
        setIsEntering(false);
      }, 100);
      
      // Clear the session storage
      sessionStorage.removeItem('lastPhotoPosition');
    }
  }, []);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  // Touch event handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const animateAndNavigate = () => {
    // Apply the page exit animation to the main container
    setIsAnimating(true);
    
    // Store the scroll position and zoom level in sessionStorage
    // This will help create continuity between pages
    sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
      timestamp: Date.now(),
      direction: 'left-to-right'
    }));
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate('/annotation');
    }, 500); // Timing that allows for overlap with longer animation
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // If swiping left, trigger animation and navigate
    if (isLeftSwipe && !isAnimating) {
      animateAndNavigate();
    }
  };
  
  // Mouse event handlers for testing on desktop
  const onMouseDown = (e) => {
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsDragging(true);
  };
  
  const onMouseMove = (e) => {
    if (isDragging) {
      setMouseEnd(e.clientX);
    }
  };
  
  const onMouseUp = () => {
    setIsDragging(false);
    
    if (!mouseStart || !mouseEnd) return;
    
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // If swiping left, trigger animation and navigate
    if (isLeftSwipe && !isAnimating) {
      animateAndNavigate();
    }
  };
  
  // Handle mouse leaving the window
  const onMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <main 
        style={{ 
          padding: 0, 
          margin: 0,
          transition: 'transform 700ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          transform: isAnimating ? 'translateX(-40%)' : 
                    isEntering ? 'translateX(-40%)' : 'translateX(0)'
        }} 
        className="w-screen h-screen relative font-urwdin flex overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}>
      {/* LEFT COLUMN - Photo section (70% width with 5vw padding) */}
       <div className="w-[60vw] h-screen pl-[2vw] flex flex-col relative">
        {/* Title above the photo - doubled in size */}
        <h1 className="text-[3.5rem] mb-2 text-gallery-black tracking-wide font-p22-freely leading-tight text-center">
          {titleText}
        </h1>
        
        {/* Photo container with drop shadow - positioned to the left */}
        <div className="flex-grow flex items-start justify-start relative z-50">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            wheel={{ wheelEnabled: true }}
            pinch={{ pinchEnabled: true }}
            doubleClick={{ 
              mode: "reset",
              animationTime: 200
            }}
            ref={transformRef}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent wrapperStyle={{ zIndex: 50 }}>
                  <img
                    src="/assets/images/zuniEagle.jpg"
                    alt="A Zuni Eagle Cage"
                    className="max-h-[85vh] max-w-full object-contain relative z-10"
                    style={{ filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.25))' }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
        
        {/* Bottom Instruction - positioned closer to the photo */}
        <div className="mt-auto mb-[3vw] w-full text-sm italic text-gallery-deepPurple text-center z-50">
          Tap on picture to explore. Scroll or pinch to zoom. Double-tap to reset. Swipe left for annotations.
        </div>
      </div>

      {/* RIGHT PANEL: intro + credit (30% width) with 3vw padding from photo */}
      <div className="w-[30vw] h-screen py-[8vh] flex flex-col justify-center pl-[3vw] relative z-40">
        {/* Intro Text Component - with right padding */}
        <div className="pr-[5vw]">
          <IntroTextPanel paragraphs={paragraphs} />
        </div>

        {/* Photo Credits Panel with background extending to both edges */}
        <div className="relative overflow-visible left-[-10vw] w-[calc(100%+100vw)] z-[0]  ">
          
          {/* The content container with the panel */}
          <div className="text-right">
            <PhotoCreditsPanel credit={credit} />
          </div>
          

        </div>
      </div>
      
      {/* Home button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center shadow-lg transition-colors z-[9999]"
        aria-label="Return to Home Page"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="w-7 h-7 text-gray-800"
        >
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      </button>
    </main>
  );
}
