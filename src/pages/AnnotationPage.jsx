import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageViewer from '../components/ImageViewer';
import photoData from '../data/annotations';

export default function AnnotationPage({ isPreloaded = false }) {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
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
  
  // Swipe handlers for going back to photo page
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
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
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden m-0 p-0"
      style={{
        backgroundColor: '#BFB6A3', /* Same as PhotoPage */
        transition: 'transform 700ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        transform: isEntering ? 'translateX(40%)' : 
                  isExiting ? 'translateX(40%)' : 'translateX(0)'
      }}
      {...eventHandlers}
    >
      <h1 className="text-3xl font-p22-freely absolute top-0 left-0 right-0 text-center text-white z-10 bg-black/30 py-1">Explore the Details</h1>
      
      <div className="w-full h-full">
        <ImageViewer image="/assets/images/zuniEagle.jpg" fullViewport={true} />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 text-center italic text-sm text-white z-10 bg-black/30 py-1">
        Tap on hotspots to learn more. Pinch or scroll to zoom. Double-tap to reset. Swipe right to return to photo.
      </div>
    </div>
  );
}