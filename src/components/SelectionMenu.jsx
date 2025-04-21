import { useState } from 'react';
import { markerTypes } from '../data/markerTypes';

export default function MarkerSelector({ onSelect, currentMarker = 'default' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentMarker);

  const handleSelect = (markerId) => {
    setSelected(markerId);
    if (onSelect) onSelect(markerId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
      >
        <span>Marker Style</span>
        {markerTypes[selected].type === 'image' ? (
          <img 
            src={markerTypes[selected].path} 
            alt={markerTypes[selected].name} 
            width="16" 
            height="16" 
          />
        ) : (
          <div className="w-4 h-4 bg-white rounded-full"></div>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-gray-800 rounded-md shadow-lg z-10 w-64">
          <div className="grid grid-cols-3 gap-3">
            {Object.values(markerTypes).map((marker) => (
              <button
                key={marker.id}
                onClick={() => handleSelect(marker.id)}
                className={`flex flex-col items-center p-2 rounded hover:bg-gray-700 ${
                  selected === marker.id ? 'ring-2 ring-blue-500 bg-gray-700' : ''
                }`}
              >
                {marker.type === 'image' ? (
                  <img 
                    src={marker.path} 
                    alt={marker.name} 
                    width="24" 
                    height="24" 
                  />
                ) : (
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                )}
                <span className="text-xs mt-1 text-gray-300">{marker.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}