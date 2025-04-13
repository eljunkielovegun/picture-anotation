import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageViewer from '../components/ImageViewer';
import AnnotationPanel from '../components/AnnotationPanel';
import NewHomeButton from '../components/NewHomeButton';
import photoData from '../data/annotations';

export default function AnnotationPage({ isPreloaded = false }) {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Listen for custom event to close the panel
  useEffect(() => {
    const handleCloseFromImage = () => {
      console.log("closeAnnotationPanel event received in AnnotationPage");
      handleClosePanel();
    };
    
    document.body.addEventListener('closeAnnotationPanel', handleCloseFromImage);
    console.log("Added event listener for closeAnnotationPanel");
    
    return () => {
      document.body.removeEventListener('closeAnnotationPanel', handleCloseFromImage);
      console.log("Removed event listener for closeAnnotationPanel");
    };
  }, []);
  
  // Check if coming from photo page
  useEffect(() => {
    // Skip animation if this is just a preloaded component
    if (isPreloaded) {
      setIsEntering(false);
      return;
    }
    
    const lastPhotoPosition = sessionStorage.getItem('lastPhotoPosition');
    const isFromPhotoPage = lastPhotoPosition && 
      (Date.now() - JSON.parse(lastPhotoPosition).timestamp < 2000);
      
    // Only animate if coming from photo page
    if (isFromPhotoPage) {
      const timer = setTimeout(() => {
        setIsEntering(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // If not coming from photo page, don't animate
      setIsEntering(false);
    }
  }, [isPreloaded]);

  // Handle annotation selection and panel open/close
  const handleSelectAnnotation = (annotation) => {
    console.log("AnnotationPage: Selecting annotation", annotation);
    
    // Load content first but don't animate yet
    setSelectedAnnotation(annotation);
    
    // Important: Ensure content is fully rendered before any animation
    // Force a synchronous render cycle to complete first
    setTimeout(() => {
      // Now that content has had time to render, start animation
      setIsPanelOpen(true);
    }, 100);
  };

  const handleClosePanel = () => {
    console.log("AnnotationPage: Closing panel");
    setIsPanelOpen(false);
    
    // Wait for animation to complete before clearing selection
    setTimeout(() => {
      setSelectedAnnotation(null);
    }, 500);
  };
  
  // Swipe handlers for going back to photo page
  const onTouchStart = (e) => {
    console.log("Touch start on AnnotationPage container", e.target);
    
    // If panel is open, this could be a tap to close
    if (isPanelOpen) {
      // Check if touched on background (directly on this element)
      if (e.target === e.currentTarget) {
        console.log("Background touched, closing panel");
        handleClosePanel();
        return;
      }
    }
    
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
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
      
      // Store data to indicate we're coming back to photo
      sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
        timestamp: Date.now(),
        direction: 'right-to-left'
      }));
      
      setTimeout(() => {
        navigate('/photo');
      }, 500);
    }
  };
  
  // Add mouse support for desktop testing
  const [mouseStart, setMouseStart] = useState(null);
  const [mouseEnd, setMouseEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const onMouseDown = (e) => {
    // Log mouse down events regardless of panel state
    console.log("Mouse down on AnnotationPage container");
    
    // If panel is open, this could be a click to close
    if (isPanelOpen) {
      // Check if clicked on background (directly on this element)
      if (e.target === e.currentTarget) {
        console.log("Background clicked, closing panel");
        handleClosePanel();
        return;
      }
    }
    
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsDragging(true);
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
      
      // Store data to indicate we're coming back to photo
      sessionStorage.setItem('lastPhotoPosition', JSON.stringify({
        timestamp: Date.now(),
        direction: 'right-to-left'
      }));
      
      setTimeout(() => {
        navigate('/photo');
      }, 500);
    }
  };
  
  const onMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Don't add event handlers if this is a preloaded instance
  const eventHandlers = isPreloaded ? {} : {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave
  };


  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden m-0 p-0 relative"
      style={{
        backgroundColor: '#BFB6A3', /* Same as PhotoPage */
        transition: 'transform 700ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        transform: isEntering ? 'translateX(40%)' : 
                  isExiting ? 'translateX(40%)' : 'translateX(0)'
      }}
      onMouseDown={(e) => {
        console.log("Direct mousedown on outer container");
        if (isPanelOpen && e.target === e.currentTarget) {
          console.log("Background directly clicked, closing panel");
          
          // Create a custom event to reset zoom in the ImageViewer
          const resetZoomEvent = new CustomEvent('resetImageZoom');
          document.body.dispatchEvent(resetZoomEvent);
          
          // Close the panel
          handleClosePanel();
        }
        if (eventHandlers.onMouseDown) eventHandlers.onMouseDown(e);
      }}
      onTouchStart={(e) => {
        console.log("Direct touchstart on outer container");
        if (isPanelOpen && e.target === e.currentTarget) {
          console.log("Background directly touched, closing panel");
          
          // Create a custom event to reset zoom in the ImageViewer
          const resetZoomEvent = new CustomEvent('resetImageZoom');
          document.body.dispatchEvent(resetZoomEvent);
          
          // Close the panel
          handleClosePanel();
        }
        if (eventHandlers.onTouchStart) eventHandlers.onTouchStart(e);
      }}
      {...eventHandlers}
    >
      
      {/* Use flex layout for content */}
      <div className="w-full h-full flex items-center justify-center overflow-visible">
        {/* Left side - Image container */}
        <div 
          className={`${isPanelOpen ? 'w-[65%]' : 'w-full'} h-screen flex items-center justify-center transition-all duration-500 overflow-hidden`}
          style={{
            transition: 'width 0.5s ease-out',
            padding: '0',
            margin: '0'
          }}
        >
          <ImageViewer 
            image="/assets/images/zuniEagle.jpg" 
            fullViewport={true} 
            onSelectAnnotation={handleSelectAnnotation}
            isPanelOpen={isPanelOpen}
          />
        </div>
        
        {/* Right side - Annotation Panel */}
        <div className={`${isPanelOpen ? 'w-[30%] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full'} h-screen flex items-center overflow-visible pr-[5vw]`} 
             style={{ 
               transition: 'width 400ms ease-out, opacity 400ms ease-out, translate 400ms ease-out'
             }}
             onMouseDown={(e) => {
               // Only trigger if click is directly on this container (not its children)
               if (e.target === e.currentTarget) {
                 console.log("Mouse down on annotation container");
                 
                 // Create a custom event to reset zoom
                 const resetZoomEvent = new CustomEvent('resetImageZoom');
                 document.body.dispatchEvent(resetZoomEvent);
                 
                 // Close the panel
                 handleClosePanel();
                 
                 // Stop event propagation
                 e.stopPropagation();
               }
             }}>
          {/* Render the panel in a fixed-width container to prevent content reflow */}
          {selectedAnnotation && (
            <div className="w-full max-w-[25vw]">
              <AnnotationPanel 
                annotation={selectedAnnotation} 
                onClose={handleClosePanel} 
              />
            </div>
          )}

           {/* Home button */}
     

        </div>
         

          
          
          
      </div>
      
      {/* Using NewHomeButton instead */}
      <NewHomeButton key="annotationPageHomeButton" />
    </div>
  );
}