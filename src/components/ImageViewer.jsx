import { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Hotspot from './Hotspot';
import photoData from '../data/annotations';
import { markerTypes } from '../data/markerTypes'; 
import MarkerSelector from './MarkerSelector';

export default function ImageViewer({ image, fullViewport = false, onSelectAnnotation, isPanelOpen = false, markerType = 'default' }) {
  // Use markerType from props instead of internal state
  const transformRef = useRef(null);
  const imageRef = useRef(null);
  const [zoomedOnHotspot, setZoomedOnHotspot] = useState(null);
  const [scale, setScale] = useState(1);
  const pendingZoomRef = useRef(null);
  
  // Handle panel close events
  useEffect(() => {
    // Reset on panel close
    if (!isPanelOpen && transformRef.current) {
      transformRef.current.resetTransform();
      setZoomedOnHotspot(null);
    }
  }, [isPanelOpen]);
  
  // Setup event listener for zoom reset (only once during component mount)
  useEffect(() => {
    // Listen for external reset requests
    const handleResetZoom = () => {
      console.log("Reset zoom event received");
      if (transformRef.current) {
        transformRef.current.resetTransform();
        setZoomedOnHotspot(null);
      }
    };
    
    // Add listener for custom reset event
    document.body.addEventListener('resetImageZoom', handleResetZoom);
    
    // Clean up event listener when component unmounts
    return () => {
      document.body.removeEventListener('resetImageZoom', handleResetZoom);
    };
  }, []); // Empty dependency array means this only runs once on mount
  
  // Function to apply zoom - will be called directly when panel opens
  const applyZoom = (coords, id) => {
    if (!transformRef.current || !imageRef.current) return;
    
    console.log("Applying zoom now", coords);
    
    // Set zoom level for tight focus on hotspot
    const zoomLevel = 5;
    
    // Get functions from transform ref
    const { resetTransform, setTransform } = transformRef.current;
    
    // Always reset first to ensure we're starting from a clean state
    resetTransform();
    
    // After reset, get fresh image dimensions
    setTimeout(() => {
      const img = imageRef.current;
      if (img) {
        const rect = img.getBoundingClientRect();
        
        // Apply the same adjustment as in Hotspot.jsx (left - 8)
        const adjustedCoordX = coords[0] ;
        const pointX = adjustedCoordX * rect.width;
        const pointY = (coords[1] + 0.11) * rect.height;
        
        // Get container dimensions
        const containerWidth = window.innerWidth * 0.65; // Account for panel taking up 35%
        const containerHeight = window.innerHeight;
        
        // Calculate position to center hotspot in viewport
        const centerX = -pointX * zoomLevel + containerWidth / 2;
        const centerY = -pointY * zoomLevel + containerHeight / 2;
        
        // Apply transform with animation - 500ms as requested
        setTransform(centerX, centerY, zoomLevel, 500);
        
        // Show only the current hotspot
        setZoomedOnHotspot(id);
      }
    }, 50);
  };

  // Calculate hotspot position based on the original coordinates
  const annotations = photoData.annotations.map((a) => ({
    ...a,
    top: a.coords[1] * 100, // Convert to percentage for positioning
    left: a.coords[0] * 100
  }));
  
  // Handle hotspot click
  const handleHotspotClick = (annotation) => {
    console.log("Hotspot clicked:", annotation.name);
    
    // Find the original annotation with coordinates
    const origAnnotation = photoData.annotations.find(a => a.id === annotation.id);
    if (!origAnnotation) {
      console.error("Original annotation not found");
      return;
    }
    
    console.log("Found original annotation:", origAnnotation);
    
    // Begin zooming immediately rather than waiting for panel to open
    applyZoom(origAnnotation.coords, annotation.id);
    
    // Notify parent component to open panel - slide in panel at same time as zoom
    if (onSelectAnnotation) {
      onSelectAnnotation(annotation);
    }
  };
  
  // Add a click handler for the main image area
  const handleImageClick = (e) => {
    console.log("Image container clicked", { 
      target: e.target,
      zoomedOnHotspot,
      isPanelOpen,
      clientX: e.clientX,
      clientY: e.clientY
    });
    
    // If we're zoomed in and the panel is open, this click should close the panel
    if (zoomedOnHotspot !== null && isPanelOpen) {
      console.log("Conditions met to close panel from image click");
      
      // Reset zoom
      if (transformRef.current) {
        transformRef.current.resetTransform();
      }
      setZoomedOnHotspot(null);
      
      // Create a new event and dispatch it to body to close the panel
      const closeEvent = new CustomEvent('closeAnnotationPanel');
      document.body.dispatchEvent(closeEvent);
      console.log("closeAnnotationPanel event dispatched");
      
      // Stop event propagation
      e.stopPropagation();
    }
  };

  // Marker type is now received from props

  return (
    <div className={`relative ${fullViewport ? 'w-full h-full m-0 p-0' : 'w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4'}`}>
      {/* MarkerSelector has been moved to AnnotationPage */}
      
      <div className={`relative ${fullViewport ? 'w-full h-full m-0 p-0' : ''}`}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          wheel={{ wheelEnabled: true }}
          pinch={{ pinchEnabled: true }}
          doubleClick={{ 
            mode: "reset",
            animationTime: 200
          }}
          ref={transformRef}
          centerOnInit={true}
          limitToBounds={false}
          centerZoomedOut={true}
          zoomAnimation={{ disabled: false, size: 0.5, animationType: "easeOut" }}
          panning={{ disabled: isPanelOpen && !zoomedOnHotspot }}
          onZoom={({ state }) => {
            setScale(state.scale);
            if (state.scale < 2) {
              setZoomedOnHotspot(null);
            }
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent 
                wrapperStyle={{ zIndex: 50 }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative mx-[5vw] my-[5vw] h-[calc(100vh-10vw)] overflow-hidden">
                    <img 
                      ref={imageRef}
                      src={image} 
                      alt="Annotated View" 
                      className="h-full w-auto object-contain"
                      style={{ 
                        filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.25))'
                      }}
                    />
                    
                    {/* Original hotspots - now passing markerType */}
                    {annotations.map((a) => (
                      <Hotspot
                        key={a.id}
                        id={a.id}
                        top={a.top}
                        left={a.left}
                        label={a.name}
                        hidden={zoomedOnHotspot !== null}
                        markerType={markerType}
                        onClick={() => handleHotspotClick(a)}
                      />
                    ))}
                  </div>
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}