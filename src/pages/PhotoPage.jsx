import photoData from '../data/annotations';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../utils/assetUtils';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import NewHomeButton from '../components/NewHomeButton';


// Intro Text Component
const IntroTextPanel = ({ paragraphs }) => {
  return (
    <div 
      className="rounded-lg shadow-xl p-0 text-s sm:text-sm leading-relaxed overflow-y-auto"
    >
      <h1 className="font-p22-freely text-3xl mb-0">
        About This Photo
        
        </h1>
      {paragraphs.map((p, idx) => (
        <p key={idx} className="mb-0 text-left">{p}</p>
      ))}
    </div>
  );
};

// Photo Credit Component
const PhotoCreditsPanel = ({ credit }) => {
  return (
    <div 
      style={{ backgroundColor: '#2C3925', color: 'white', width: '100vw' }}
      className="overflow-visible py-[0] leading-snug font-felt-tip shadow-xl"
    >
      <p className="mb-0 text-left" 
      style={{ marginLeft: '2vw', fontSize: '1.25rem' }}
      >
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
          padding: '2vw', 
          margin: '0 auto',
          transition: 'transform 700ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          transform: isAnimating ? 'translateX(-40%)' : 
                    isEntering ? 'translateX(-40%)' : 'translateX(0)'
        }} 
        className="w-screen h-screen relative font-urwdin flex overflow-hidden justify-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}>
      {/* LEFT COLUMN - Photo section (60% width with padding) */}
       <div className="h-screen flex flex-col relative">
        {/* Title above the photo - responsive size */}
      
        
        {/* Photo container with drop shadow - positioned to the right */}
        <div className="flex-grow flex items-start justify-end relative z-50 ">
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
                    src={getAssetPath('assets/images/zuniEagle.jpg')}
                    alt="A Zuni Eagle Cage"
                    className="max-h-full max-w-full object-contain relative z-10"
                    style={{ filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.5))' }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
        
        {/* Bottom Instruction - positioned closer to the photo */}
        <div className="mt-0 mb-0 w-full text-xs italic text-gallery-deepPurple text-right z-50">
          Tap on picture to explore. Scroll or pinch to zoom. Double-tap to reset. Swipe left for annotations.
        </div>
      </div>

      {/* RIGHT PANEL: intro + credit (30% width) with padding from photo */}
      <div className="py-0 flex flex-col justify-start items-start relative z-40  overflow-auto w-1/2"style={{ paddingRight: '5vw', paddingTop: '1vw' }} >
        <div className="font-p22-freely " style={{padding: '', margin: '', lineHeight: 1, fontSize: '5vw'}}>
            {titleText}
          </div>
          {/* Intro Text Component - with right padding */}
          <div className="pr-0 max-h-[65vh]" style={{ paddingLeft: '2vw', paddingTop: '8vw' }}>
            <div className="text-left w-full">
              <IntroTextPanel paragraphs={paragraphs} />
            </div>
          </div>

          {/* Photo Credits Panel with background extending to the edge of the page */}
          <div className="relative overflow-visible mt-0 w-screen ml-[-40vw]">
            <div className="relative w-full">
              {/* The content container positioned where the text should remain */}
              <div className="absolute text-left" style={{ left: '40vw', paddingTop: '6vw', margin: '' }}>
                <PhotoCreditsPanel  credit={credit} />
              </div>
            </div>
          </div>
                {/* Using NewHomeButton instead */}
                <NewHomeButton key="photoPageHomeButton" />
      </div>
      
     
    </main>
  );
}
