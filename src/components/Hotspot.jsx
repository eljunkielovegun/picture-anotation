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
  // Keep the exact percentages provided - no adjustments
  const adjustedTop = top;
  const adjustedLeft = left - 8;
  
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
        console.log(`Hotspot clicked: ${label}`);
        if (onClick) onClick(e);
      }}
      className="absolute z-50 pointer-events-auto p-0 m-0 border-0 bg-transparent outline-none cursor-pointer"
      style={{ top: `${adjustedTop}%`, left: `${adjustedLeft}%`, transform: 'translate(-50%, -50%)', backgroundColor: 'transparent' }}
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
            
            {/* Core blur filter */}
            <filter id={`core-blur-${animationId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            
            {/* Outer glow gradient */}
            <radialGradient id={`glow-gradient-${animationId}`} cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
              <stop offset="50%" stopColor="white" stopOpacity="0.7" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Outermost glow */}
          <circle cx="12" cy="12" r="10" fill={`url(#glow-gradient-${animationId})`}>
            <animate 
              attributeName="opacity"
              begin={`-${phaseInSeconds}s`}
              values="0.2;0.5;0.2" 
              dur="3s" 
              repeatCount="indefinite" 
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
            />
          </circle>
          
          {/* Middle glow */}
          <circle 
            cx="12" 
            cy="12" 
            r="6" 
            fill="white" 
            opacity="0.6"
            filter={`url(#glow-${animationId})`}
          >
            <animate 
              attributeName="opacity"
              begin={`-${phaseInSeconds}s`}
              values="0.3;0.7;0.3" 
              dur="3s" 
              repeatCount="indefinite" 
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
            />
          </circle>
          
          {/* Core white dot with blur effect */}
          <circle 
            cx="12" 
            cy="12" 
            r="3.5" 
            fill="white" 
            filter={`url(#core-blur-${animationId})`}
          >
            <animate 
              id={animationId}
              attributeName="opacity" 
              begin={`-${phaseInSeconds}s`}
              values="0.6;1;0.6" 
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