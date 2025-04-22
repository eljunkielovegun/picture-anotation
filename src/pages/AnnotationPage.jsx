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
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
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
    // Skip animation if this is just a preloaded component
    if (isPreloaded) {
      setIsEntering(false);
      return;
    }
    
    const lastPhotoPosition = sessionStorage.getItem('lastPhotoPosition');
    
    if (lastPhotoPosition) {
      const photoData = JSON.parse(lastPhotoPosition);
      
      // Check if we're coming from a simple transition or direct click
      if (photoData.direction === 'simple') {
        // Use a simple transition
        setIsEntering(true); // Set entering state for a brief moment
        if (photoData.isExpanded) {
          setIsFullScreen(true);
        }
        
        // Remove entering state after a short delay
        setTimeout(() => {
          setIsEntering(false);
        }, 300);
      } else if (photoData.direction === 'direct') {
        // Skip all animation and immediately set fullscreen if needed
        setIsEntering(false);
        if (photoData.isExpanded) {
          setIsFullScreen(true);
        }
      } else {
        // Regular animation behavior for swipe navigation
        const isFromPhotoPage = (Date.now() - photoData.timestamp < 2000);
        
        if (isFromPhotoPage) {
          if (photoData.isExpanded) {
            setIsEntering(false);
            setIsFullScreen(true);
          } else {
            const timer = setTimeout(() => {
              setIsEntering(false);
            }, 100);
            
            return () => clearTimeout(timer);
          }
        } else {
          setIsEntering(false);
        }
      }
    } else {
      // If not coming from photo page, don't animate
      setIsEntering(false);
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
    // Set exiting state for animation
    setIsExiting(true);
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/photo');
    }, 250);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    
    // Wait for animation to complete before clearing selection
    setTimeout(() => {
      setSelectedAnnotation(null);
    }, 500);
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
    if (isRightSwipe && !isExiting) {
      setIsExiting(true);
      
      // Store data to indicate we're coming back to photo with zoom animation
      sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
        timestamp: Date.now(),
        direction: 'zoom' // Use zoom animation
      }));
      
      setTimeout(() => {
        navigate('/photo');
      }, 2800);
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
    if (isExiting) return;
    
    setIsExiting(true);
    
    // Store data to indicate we're coming back to photo page
    sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
      timestamp: Date.now(),
      direction: 'simple' // Use simple animation for double tap
    }));
    
    setTimeout(() => {
      navigate('/photo');
    }, 300);
  };
  
  // Check for double tap when screen is touched
  const checkForDoubleTap = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // Time window for double tap in ms
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // This is a double tap
      e.preventDefault();
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
    if (isRightSwipe && !isExiting) {
      setIsExiting(true);
      
      // Store data to indicate we're coming back to photo with zoom animation
      sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
        timestamp: Date.now(),
        direction: 'zoom' // Use zoom animation
      }));
      
      setTimeout(() => {
        navigate('/photo');
      }, 2800);
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
    if (!isPanelOpen && !isExiting) {
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
          transition: isFullScreen ? 'none' : 'all 300ms ease-out',
          transform: isEntering ? 'scale(0.95)' : 
                    isExiting ? 'scale(0.95)' : 'scale(1)',
          opacity: isEntering ? '0.85' : '1',
          transformOrigin: 'center',
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
        className={`${isPanelOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} fixed inset-0 bg-black bg-opacity-10 z-[900]`}
        style={{ 
          transition: 'opacity 400ms ease-out',
          pointerEvents: isPanelOpen ? 'auto' : 'none'
        }}
        onClick={handleClosePanel}
      />
      
      {/* Right side - Annotation Panel - positioned bottom right when panel is open */}
      <div className={`${isPanelOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} fixed z-[1000]`} 
           style={{ 
             transition: 'opacity 400ms ease-out, transform 400ms ease-out',
             top: 'auto', /* Override previous top positioning */
             left: 'auto', /* Override previous left positioning */
             right: '80px', /* Position from right side - equal to bottom distance */
             bottom: '80px', /* Position from bottom with space for home button */
             transform: 'none', /* Remove previous transform */
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