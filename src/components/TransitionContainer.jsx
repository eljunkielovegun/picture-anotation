import React, { useState, useEffect } from 'react';

const TransitionContainer = ({ children, direction, className = '', expandPosition = null }) => {
  const [animationClass, setAnimationClass] = useState('');
  const [style, setStyle] = useState({ 
    willChange: 'transform', 
    position: 'absolute' 
  });

  useEffect(() => {
    // Set the animation class based on the direction
    if (direction === 'enter-right') {
      setAnimationClass('page-enter-from-right');
      setStyle({ 
        willChange: 'transform', 
        position: 'absolute' 
      });
    } else if (direction === 'exit-left') {
      setAnimationClass('page-exit-to-left');
      setStyle({ 
        willChange: 'transform', 
        position: 'absolute' 
      });
    } else if (direction === 'enter-left') {
      setAnimationClass('page-enter-from-left');
      setStyle({ 
        willChange: 'transform', 
        position: 'absolute' 
      });
    } else if (direction === 'exit-right') {
      setAnimationClass('page-exit-to-right');
      setStyle({ 
        willChange: 'transform', 
        position: 'absolute' 
      });
    } else if (direction === 'fade-in') {
      setAnimationClass('fade-in');
      setStyle({
        willChange: 'opacity',
        position: 'absolute'
      });
    } else if (direction === 'expand-center') {
      setAnimationClass('page-expand-from-center');
      
      // Set the expand position from the photo
      if (expandPosition) {
        const { x, y } = expandPosition;
        setStyle({
          willChange: 'transform, clip-path',
          position: 'absolute',
          transformOrigin: `${x}% ${y}%`,
          '--expand-x': `${x}%`,
          '--expand-y': `${y}%`,
        });
      } else {
        // Default to center if no position provided
        setStyle({
          willChange: 'transform, clip-path',
          position: 'absolute',
          transformOrigin: '50% 50%',
          '--expand-x': '50%',
          '--expand-y': '50%',
        });
      }
    } else if (direction === 'shrink-center') {
      setAnimationClass('page-shrink-to-center');
      
      // Set the shrink position 
      if (expandPosition) {
        const { x, y } = expandPosition;
        setStyle({
          willChange: 'transform, clip-path',
          position: 'absolute',
          transformOrigin: `${x}% ${y}%`,
          '--expand-x': `${x}%`,
          '--expand-y': `${y}%`,
        });
      } else {
        // Default to center if no position provided
        setStyle({
          willChange: 'transform, clip-path',
          position: 'absolute',
          transformOrigin: '50% 50%',
          '--expand-x': '50%',
          '--expand-y': '50%',
        });
      }
    }
  }, [direction, expandPosition]);

  // Determine if this is the component that should be hidden at the end
  const shouldHideOnExit = direction === 'shrink-center';
  
  return (
    <div 
      className={`w-full h-full absolute top-0 left-0 overflow-hidden ${animationClass} ${className}`}
      style={{
        ...style,
        // Add special styles for shrink-center to ensure complete removal
        ...(shouldHideOnExit && {
          pointerEvents: 'none',
          zIndex: 10 // Make sure it's above the PhotoPage but will eventually disappear
        })
      }}
    >
      {children}
    </div>
  );
};

export default TransitionContainer;