import { useState } from 'react';
import { markerTypes } from '../data/markerTypes';

export default function Hotspot({ 
  top, 
  left, 
  label, 
  onClick, 
  id, 
  hidden = false,
  markerType = 'default' // Default to animated circle if not specified
}) {
  // Hotspot position info
  
  // IDs 5, 6, 7, 8 are the rightmost (based on data in annotations.js)
  const isRightSide = id >= 5 && id <= 8;
  
  // Special adjustment for bottom-left hotspot (ID 4) and second highest right (ID 7)
  const isBottomLeft = id === 4;
  const isGoldenEagle = id === 7; // Second highest hotspot on the right
  
  // Apply adjustments based on feedback with special cases
  const adjustedTop = isGoldenEagle ? top - 3 : // Golden Eagle: up by 3
                      isRightSide ? top + 1 :   // Other right side: down by 1
                      isBottomLeft ? top + 3 :  // Bottom-left: down by 3
                      top - 2;                 // Other left side: up by 2
  
  // Right side: Move left by 11 (increased by 3 total), Left side: Move left by 5.5
  const adjustedLeft = isRightSide ? left - 11 : left - 5.5;
  
  // Calculate a unique phase offset for each dot based on its ID
  const basePhase = Math.PI / 1.6; 
  const idOffset = id ? (id - 1) * Math.random() : 0;
  const phaseInSeconds = basePhase + idOffset;
  
  // Generate a unique animation ID to prevent conflicts
  const animationId = `sine-fade-${id || Math.floor(Math.random() * 1000)}`;
  
  // Don't render if hidden
  if (hidden) {
    return null;
  }

  // Get the marker configuration
  const marker = markerTypes[markerType] || markerTypes.default;
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Make sure event doesn't propagate
        if (onClick) onClick(e);
      }}
      className="absolute z-[500] pointer-events-auto p-0 m-0 border-0 outline-none cursor-pointer"
      style={{ 
        top: `${adjustedTop}%`, 
        left: `${adjustedLeft}%`, 
        transform: 'translate(-50%, -50%)', 
        backgroundColor: 'transparent',
        width: '40px',  /* Make hitbox bigger */
        height: '40px',
        pointerEvents: 'auto'
      }}
      aria-label={label}
    >
      {marker.type === 'image' ? (
        // If marker is an image type, load the SVG from the path
        <img 
          src={marker.path} 
          alt={marker.name}
          width="24" 
          height="24" 
          style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))' }}
        />
      ) : (
        // Otherwise use the default animated SVG
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Outer glow filter */}
            <filter id={`glow-${animationId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Core blur filter - reduced blur for sharper edge */}
            <filter id={`core-blur-${animationId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" />
            </filter>
            
            {/* Outer glow gradient - gallery orange */}
            <radialGradient id={`glow-gradient-${animationId}`} cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
              <stop offset="50%" stopColor="#f3993e" stopOpacity="0.7" /> {/* Gallery orange color */}
              <stop offset="100%" stopColor="#f3993e" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Outermost glow */}
          <circle cx="12" cy="12" r="10" fill={`url(#glow-gradient-${animationId})`}>
            <animate 
              attributeName="opacity"
              begin={`-${phaseInSeconds}s`}
              values="0.0;0.5;0.0" 
              dur="3s" 
              repeatCount="indefinite" 
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
            />
          </circle>
          
          {/* Middle glow - orange */}
          <circle 
            cx="12" 
            cy="12" 
            r="6" 
            fill="#f3993e" /* Same orange as outer glow */
            opacity="0.6"
            filter={`url(#glow-${animationId})`}
          >
            <animate 
              attributeName="opacity"
              begin={`-${phaseInSeconds}s`}
              values="0.3;0.8;0.3" /* Increased max opacity to 0.8 */
              dur="3s" 
              repeatCount="indefinite" 
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
            />
          </circle>
          
          {/* Core dot with white fill - enlarged to cover inner glow ring */}
          <circle 
            cx="12" 
            cy="12" 
            r="5" /* Increased from 3.5 to 5 to cover more of the inner glow */
            fill="white" /* White core */
            filter={`url(#core-blur-${animationId})`}
          >
            <animate 
              id={animationId}
              attributeName="opacity" 
              begin={`-${phaseInSeconds}s`}
              values="0.6;0.9;0.6" /* Increased opacity range */
              dur="3s" 
              repeatCount="indefinite" 
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
            />
          </circle>
        </svg>
      )}
    </button>
  );
}