import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../utils/assetUtils';
import ImageViewer from '../components/ImageViewer';
import AnnotationPanel from '../components/AnnotationPanel';
import NewHomeButton from '../components/NewHomeButton';
import MarkerSelector from '../components/MarkerSelector';

import photoData from '../data/annotations';

export default function AnnotationPage({ isPreloaded = false }) {
  const navigate = useNavigate();
  const imageViewerRef = useRef(null);
  // Removed transition states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [markerType, setMarkerType] = useState('default');
  const [isFullScreen, setIsFullScreen] = useState(false); // Track if we're in full screen mode
  
  // Listen for custom events
  useEffect(() => {
    // Handler for closing panel
    const handleCloseFromImage = () => {
      handleClosePanel();
    };
    
    // Handler for double click/tap on image
    const handleDoubleClick = () => {
      if (!isPanelOpen) {
        handleDoubleTap();
      }
    };
    
    // Add event listeners
    document.body.addEventListener('closeAnnotationPanel', handleCloseFromImage);
    document.body.addEventListener('doubleClickOnImage', handleDoubleClick);
    
    // Cleanup on unmount
    return () => {
      document.body.removeEventListener('closeAnnotationPanel', handleCloseFromImage);
      document.body.removeEventListener('doubleClickOnImage', handleDoubleClick);
    };
  }, [isPanelOpen]); // Re-add listeners if panel state changes
  
  // Check if coming from photo page
  useEffect(() => {
    if (isPreloaded) {
      return;
    }
    
    const lastPhotoPosition = sessionStorage.getItem('lastPhotoPosition');
    
    if (lastPhotoPosition) {
      const photoData = JSON.parse(lastPhotoPosition);
      
      // Only check if we need fullscreen mode
      if (photoData.isExpanded) {
        setIsFullScreen(true);
      }
      
      // Clear storage
      sessionStorage.removeItem('lastPhotoPosition');
    }
  }, [isPreloaded]);

  // Handle annotation selection and panel open/close
  const handleSelectAnnotation = (annotation) => {
    // Load content first but don't animate yet
    setSelectedAnnotation(annotation);
    
    // Immediately open the panel
    setIsPanelOpen(true);
  };
  
  // Function to navigate back to photo page
  const navigateBackToPhoto = () => {
    // Always use center position for fade out effect
    const centerX = 50;
    const centerY = 50;
    
    // Store position for shrink animation
    sessionStorage.setItem('transition_position', JSON.stringify({
      x: centerX,
      y: centerY
    }));
    
    // Store data for returning to photo page
    sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
      timestamp: Date.now()
    }));
    
    // Navigate back to trigger the transition
    navigate('/photo');
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedAnnotation(null);
  };
  
  // Swipe and double tap handlers for going back to photo page
  const onTouchStart = (e) => {
    // Track touch for swipe detection
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    
    // Check for double tap
    checkForDoubleTap(e);
  };
  
  const onTouchMove = (e) => {
    if (isPanelOpen) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (isPanelOpen) return;
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    // If swiping right, go back to photo page
    if (isRightSwipe) {
      // Use the navigation function to maintain consistency
      navigateBackToPhoto();
    }
  };
  
  // Add mouse support for desktop testing and double tap detection
  const [mouseStart, setMouseStart] = useState(null);
  const [mouseEnd, setMouseEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTap, setLastTap] = useState(0); // Track last tap time for double tap detection
  
  // Function to handle double tap/click
  const handleDoubleTap = () => {
    if (isPanelOpen) return;
    
    // Use the navigation function to maintain consistency
    navigateBackToPhoto();
  };
  
  // Check for double tap when screen is touched
  const checkForDoubleTap = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // Time window for double tap in ms
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // This is a double tap
      e.preventDefault();
      
      // Always use center for consistent fade animation
      const centerX = 50;
      const centerY = 50;
      
      // Store position for shrink animation
      sessionStorage.setItem('transition_position', JSON.stringify({
        x: centerX,
        y: centerY
      }));
      
      handleDoubleTap();
    } else {
      // This is the first tap, store the timestamp
      setLastTap(now);
    }
  };
  
  const onMouseDown = (e) => {
    // Handle swipe gesture tracking
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsDragging(true);
    
    // Check for double click on desktop
    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 300;
    if (now - lastTap < DOUBLE_CLICK_DELAY) {
      // This is a double click
      
      // Always use center for consistent fade animation
      const centerX = 50;
      const centerY = 50;
      
      // Store position for shrink animation
      sessionStorage.setItem('transition_position', JSON.stringify({
        x: centerX,
        y: centerY
      }));
      
      handleDoubleTap();
    }
    setLastTap(now);
  };
  
  const onMouseMove = (e) => {
    if (isPanelOpen) return;
    if (isDragging) {
      setMouseEnd(e.clientX);
    }
  };
  
  const onMouseUp = () => {
    if (isPanelOpen) return;
    setIsDragging(false);
    
    if (!mouseStart || !mouseEnd) return;
    
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    // If swiping right, go back to photo page
    if (isRightSwipe) {
      // Use the navigation function to maintain consistency
      navigateBackToPhoto();
    }
  };
  
  const onMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Handler for marker type change
  const handleMarkerChange = (newMarkerType) => {
    setMarkerType(newMarkerType);
  };
  
  // Handler for clicks that occur outside the ImageViewer component
  const handleBackgroundClick = (e) => {
    console.log("Background click detected", {
      target: e.target,
      currentTarget: e.currentTarget,
      hasImageViewerRef: !!imageViewerRef.current
    });
    
    // If we have a reference to the image viewer container
    if (imageViewerRef.current) {
      // Check if the click target is not within the image viewer
      const isOutside = !imageViewerRef.current.contains(e.target);
      console.log("Is click outside image viewer?", isOutside);
      
      if (isOutside) {
        // If panel is open, close it first
        if (isPanelOpen) {
          console.log("Panel is open, closing it first");
          // Create a custom event to reset zoom in the ImageViewer
          const resetZoomEvent = new CustomEvent('resetImageZoom');
          document.body.dispatchEvent(resetZoomEvent);
          
          // Close the panel
          handleClosePanel();
          
          // Don't navigate immediately to allow panel animation to complete
          return;
        }
        
        // Otherwise navigate back to photo page
        console.log("Navigating back to photo page");
        navigateBackToPhoto();
      }
    }
  };
  
  // We no longer need these event handlers for our new approach


  // Detect double tap on main container
  const onContainerDoubleClick = () => {
    if (!isPanelOpen) {
      handleDoubleTap();
    }
  };

  return (
    <>
      {/* Background overlay div that works as a back button */}
      <div 
        className="fixed inset-0 bg-[#BFB6A3] z-[5] cursor-pointer"
        onClick={navigateBackToPhoto}
      />

      {/* Main content container */}
      <div 
        className="w-screen h-screen flex items-center justify-center m-0 p-0 relative"
        style={{
          pointerEvents: 'none', /* Make the container pass-through */
          overflow: 'visible'
        }}
        onDoubleClick={onContainerDoubleClick}
      >
      
      {/* Image container with higher z-index */}
      <div 
        className="relative z-[10] w-full h-full flex items-center justify-center"
        style={{
          padding: '0',
          margin: '0',
          pointerEvents: 'auto', /* Override the pass-through from parent */
          overflow: 'visible',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        ref={imageViewerRef}
        onDoubleClick={onContainerDoubleClick}
      >
          <ImageViewer 
            image={getAssetPath('assets/images/zuniEagle.jpg')} 
            fullViewport={true} 
            onSelectAnnotation={handleSelectAnnotation}
            isPanelOpen={isPanelOpen}
            markerType={markerType}
            initialFullScreen={isFullScreen} // Pass the fullscreen flag from PhotoPage
          />
        </div>
        
      {/* Overlay for panel background when open */}
      <div 
        className={`${isPanelOpen ? 'opacity-100 visible' : 'hidden'} fixed inset-0 bg-black bg-opacity-10 z-[900]`}
        style={{ 
          pointerEvents: isPanelOpen ? 'auto' : 'none'
        }}
        onClick={handleClosePanel}
      />
      
      {/* Right side - Annotation Panel - positioned bottom right when panel is open */}
      <div className={`${isPanelOpen ? 'block' : 'hidden'} fixed z-[1000]`} 
           style={{ 
             top: 'auto', /* Override previous top positioning */
             left: 'auto', /* Override previous left positioning */
             right: '80px', /* Position from right side - equal to bottom distance */
             bottom: '80px', /* Position from bottom with space for home button */
             maxHeight: 'calc(90vh - 100px)', /* Add height limit with space at top and bottom */
             pointerEvents: 'auto'
           }}>
        {/* Render the panel in a fixed-size container */}
        {selectedAnnotation && (
          <div className="w-[380px] rounded-2xl overflow-hidden" 
               style={{ 
                 boxShadow: '0 15px 40px rgba(206, 149, 121, 0.5), 0 10px 20px rgba(206, 149, 121, 0.5), -10px 0 30px rgba(206, 149, 121, 0.5), 10px 0 30px rgba(206, 149, 121, 0.5)',
                 backgroundColor: '#F5F7DC',
                 height: 'auto',
                 maxHeight: 'calc(90vh - 100px)', /* Max height with space for buttons */
                 borderRadius: '20px',
                 overflowY: 'auto' /* Allow scrolling for long content */
               }}>
            <AnnotationPanel 
              annotation={selectedAnnotation} 
              onClose={handleClosePanel} 
            />
          </div>
        )}
      </div>
      
      {/* Using NewHomeButton with pointer-events enabled */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1001, pointerEvents: 'auto' }}>
        <NewHomeButton key="annotationPageHomeButton" />
      </div>
      </div>
    </>
  );
}