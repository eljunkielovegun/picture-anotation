import photoData from '../data/annotations';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../utils/assetUtils';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import NewHomeButton from '../components/NewHomeButton';
import IntroCarousel from '../components/IntroCarousel';

// Preload the annotation page image on component mount
const preloadImage = new Image();
preloadImage.src = getAssetPath('assets/images/zuniEagle.jpg');


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
  const curtisData = photoData["curtis-photo"];
  const transformRef = React.useRef(null);
  const photoImageRef = React.useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [mouseStart, setMouseStart] = useState(null);
  const [mouseEnd, setMouseEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  // Removed transition state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if coming back from annotation page
  useEffect(() => {
    // Detect if we're coming from annotation page with expanded state
    const lastPosition = sessionStorage.getItem('lastPhotoPosition');
    
    if (lastPosition) {
      const data = JSON.parse(lastPosition);
      if (data.isExpanded) {
        setIsExpanded(true);
      }
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

  const navigateToAnnotation = () => {
    // Find the image position for the transition using the ref
    if (photoImageRef.current) {
      const rect = photoImageRef.current.getBoundingClientRect();
      // Use the center of the image
      const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      
      // Store position for expand animation
      sessionStorage.setItem('transition_position', JSON.stringify({
        x: centerX,
        y: centerY
      }));
    }
    
    // Store the expanded state
    sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
      timestamp: Date.now(),
      isExpanded: isExpanded // Pass the current expanded state to AnnotationPage
    }));
    
    // Navigate to trigger the transition
    navigate('/annotation');
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (isExpanded) return; // Don't process swipes when in expanded mode
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // If swiping left, navigate immediately
    if (isLeftSwipe) {
      navigateToAnnotation();
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
    if (isExpanded) return; // Don't process swipes when in expanded mode
    
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // If swiping left, navigate immediately
    if (isLeftSwipe) {
      navigateToAnnotation();
    }
  };
  
  // Handle mouse leaving the window
  const onMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Navigate directly to annotation page with expand animation
  const toggleExpandedView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Image clicked/tapped - navigating to annotation page');
    
    // Calculate the click position for the expand animation
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // Convert to percentage coordinates relative to the viewport
    const percentX = (clickX / window.innerWidth) * 100;
    const percentY = (clickY / window.innerHeight) * 100;
    
    console.log(`Click position: ${percentX}%, ${percentY}%`);
    
    // Store position for expand animation
    sessionStorage.setItem('transition_position', JSON.stringify({
      x: percentX,
      y: percentY
    }));
    
    // Store the expanded state in sessionStorage
    sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
      timestamp: Date.now(),
      isExpanded: true // Always pass true when directly clicking the image
    }));
    
    // Navigate to trigger the transition
    navigate('/annotation');
  };
  
  // Close expanded view when clicking outside the image
  const handleBackgroundClick = (e) => {
    if (isExpanded) {
      console.log('Background clicked - closing expanded view');
      
      if (transformRef.current) {
        transformRef.current.resetTransform();
      }
      
      setIsExpanded(false);
      e.stopPropagation();
    }
  };

  return (
    <main 
        style={{ 
          padding: isExpanded ? '0' : '.5vw', 
          margin: '0 auto'
        }} 
        className={`w-screen h-screen relative font-urwdin flex justify-center ${isExpanded ? 'overflow-visible expanded-view' : 'overflow-hidden'}`}
        onClick={handleBackgroundClick}
        >
      {/* LEFT COLUMN - Photo section (60% width with padding) */}
       <div 
        className={isExpanded ?  'h-screen flex flex-col relative overflow-visible w-1/4 items-start translate-y-[-3.5vw]'   :'h-screen flex flex-col relative overflow-visible' }
        style={isExpanded ? { paddingLeft: '0vw', paddingBottom: '0vw' }:{ paddingLeft: '0vw', paddingTop: '0vw' } }
        onTouchStart={!isExpanded ? onTouchStart : undefined}
        onTouchMove={!isExpanded ? onTouchMove : undefined}
        onTouchEnd={!isExpanded ? onTouchEnd : undefined}
        onMouseDown={!isExpanded ? onMouseDown : undefined}
        onMouseMove={!isExpanded ? onMouseMove : undefined}
        onMouseUp={!isExpanded ? onMouseUp : undefined}
        onMouseLeave={!isExpanded ? onMouseLeave : undefined}
      
       
       
       >
        {/* Title above the photo - responsive size */}
      
        
        {/* Photo container with drop shadow - positioned to the right */}
        <div 
            className={isExpanded 
              ? 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-[0ms] ease-in-out'
              : 'flex-grow flex items-start relative z-50 cursor-pointer'
            }
            style={isExpanded ? { padding: '0', margin: '0' } : { padding: '0vw'}}
            onClick={!isExpanded ? toggleExpandedView : undefined}>
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={5}
            wheel={{ wheelEnabled: true }}
            pinch={{ pinchEnabled: true }}
            panning={{ 
              disabled: isExpanded,  // Disable panning when expanded
              animationTime: 100
            }}
            doubleClick={{ 
              mode: "reset",
              animationTime: 100
            }}
            limitToBounds={false}  // Allow image to move beyond bounds for better centering
            centerOnInit={true}
            velocityAnimation={{ 
              sensitivity: 1,
              animationTime: 500
            }}
            ref={transformRef}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* No text on expanded image */}
                <TransformComponent 
                  wrapperStyle={{ 
                    zIndex: 50,
                    display: 'flex',
                   overflow: 'visible',
                    alignItems: 'left',
                    width: '100%',
                    height: '100%',
                    position: isExpanded ? 'relative' : undefined ,
                    left: isExpanded ? '0' : undefined
                  }}>
                  <img
                    ref={photoImageRef}
                    src={getAssetPath('assets/images/zuniEagle.jpg')}
                    alt="A Zuni Eagle Cage"
                    className={isExpanded 
                      ? "max-h-[100vh] max-w-[100vw] object-contain relative z-10 cursor-move" 
                      : "max-h-full max-w-full object-contain relative z-10 cursor-pointer"
                    }
                    style={{ 
                      filter: 'drop-shadow(0px 10px 15px 0px rgba(0, 0, 0, 0.5))',
                      transform: 'none'
                    }}
                    onTouchStart={!isExpanded ? onTouchStart : undefined}
                    onTouchMove={!isExpanded ? onTouchMove : undefined}
                    onTouchEnd={!isExpanded ? onTouchEnd : undefined}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
        
        {/* Bottom Instruction - positioned closer to the photo */}
        {!isExpanded && (
          <div className="text-lg italic text-center z-50 py-4 font-bold absolute bottom-0 left-0 transform translate-x-[50vw] translate-y-[58vw]" style={{ paddingBottom: '5vw', paddingLeft: '5vw', paddingRight: '5vw', color: '#5F3833' }}>
            Tap to explore 
          </div>
        )}
      </div>

      {/* RIGHT PANEL: intro + credit (30% width) with padding from photo */}
      <div className={`py-0 flex flex-col justify-start items-start relative z-40 overflow-auto w-1/2 transition-opacity duration-[0ms] ${
        isExpanded ? 'opacity-0' : 'opacity-100'
      }`} style={{ paddingRight: '5vw', paddingTop: '1vw' }} >
        <div className="font-p22-freely " style={{padding: '', margin: '', lineHeight: 1, fontSize: '5vw'}}>
            {titleText}
          </div>
          {/* Intro Carousel Component - no padding */}
          <div className="max-h-[65vh]" style={{ paddingTop: '4vw' }}>
            <div className="w-full">
              <IntroCarousel introData={photoData.intro} curtisData={curtisData} />
            </div>
          </div>

          {/* Photo Credits Panel with background extending to the edge of the page */}
          <div className="relative overflow-visible mt-0 w-screen ml-[-40vw]">
            <div className="relative w-full">
              {/* The content container positioned where the text should remain */}
              <div className="absolute text-left" style={{ left: '40vw', paddingTop: '5vw', margin: '' }}>
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