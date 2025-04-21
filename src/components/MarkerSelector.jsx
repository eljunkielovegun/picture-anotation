import { useState } from 'react';
import { markerTypes } from '../data/markerTypes';

export default function MarkerSelector({ onSelect, currentMarker = 'default' }) {
  // Convert markerTypes to an array
  const markerOptions = Object.values(markerTypes);
  
  // Find current index in the options
  const currentIndex = markerOptions.findIndex(marker => marker.id === currentMarker);
  
  // Handle click to cycle to next marker
  const handleCycleMarker = (e) => {
    // Stop event propagation
    e.stopPropagation();
    e.preventDefault();
    
    // Get next index (cycle back to start if at end)
    const nextIndex = (currentIndex + 1) % markerOptions.length;
    const nextMarker = markerOptions[nextIndex];
    
    console.log("Cycling to next marker:", nextMarker.id);
    
    // Call the onSelect handler with the next marker
    if (onSelect) {
      onSelect(nextMarker.id);
    }
  };
  
  // Get current marker name for display
  const currentMarkerName = currentIndex >= 0 ? 
    markerOptions[currentIndex].name : 'Default';

  return (
    <button 
      onClick={handleCycleMarker}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="px-3 py-2 bg-blue-600 text-white rounded-md shadow-md"
      style={{ zIndex: 9999 }}
    >
      {currentMarkerName}
    </button>
  );
}