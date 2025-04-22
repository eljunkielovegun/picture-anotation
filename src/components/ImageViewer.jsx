import { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Hotspot from './Hotspot';
import photoData from '../data/annotations';
import { markerTypes } from '../data/markerTypes'; 
import MarkerSelector from './MarkerSelector';

export default function ImageViewer({ 
  image, 
  fullViewport = false, 
  onSelectAnnotation, 
  isPanelOpen = false, 
  markerType = 'default',
  initialFullScreen = false, // New prop to indicate we should start in full screen mode
  onMarkerVisibilityChange = null, // Callback when markers enter/exit viewport
  transformRef = null, // Reference to pass to the TransformWrapper
  onZoomChange = null // Callback for zoom state change
}) {
  // Use markerType from props instead of internal state
  const internalTransformRef = useRef(null);
  const imageRef = useRef(null);
  const [zoomedOnHotspot, setZoomedOnHotspot] = useState(null);
  const [scale, setScale] = useState(1); // Always start at normal scale
  const pendingZoomRef = useRef(null);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  
  // Handle panel close events
  useEffect(() => {
    // Reset on panel close
    const activeTransformRef = transformRef?.current ? transformRef : internalTransformRef;
    if (!isPanelOpen && activeTransformRef.current) {
      activeTransformRef.current.resetTransform();
      setZoomedOnHotspot(null);
    }
  }, [isPanelOpen, transformRef]);
  
  // Sync zoomedOnHotspot state with parent component
  useEffect(() => {
    if (onZoomChange) {
      onZoomChange(zoomedOnHotspot);
    }
  }, [zoomedOnHotspot, onZoomChange]);
  
  // Setup event listener for zoom reset and handle initialFullScreen
  useEffect(() => {
    // Listen for external reset requests
    const handleResetZoom = () => {
      const activeTransformRef = transformRef?.current ? transformRef : internalTransformRef;
      if (activeTransformRef.current) {
        activeTransformRef.current.resetTransform();
        setZoomedOnHotspot(null);
      }
    };
    
    // Add listener for custom reset event
    document.body.addEventListener('resetImageZoom', handleResetZoom);
    
    // We're not auto-zooming anymore when initialFullScreen is true
    // Just showing the image at normal scale with hotspots visible
    
    // Clean up event listener when component unmounts
    return () => {
      document.body.removeEventListener('resetImageZoom', handleResetZoom);
    };
  }, [transformRef]);
  
  // Using a simpler approach to track marker visibility since IntersectionObserver
  // had implementation issues
  
  // Track pan and zoom to update visible markers
  const checkMarkerVisibility = () => {
    if (zoomedOnHotspot !== null || !imageRef.current) return;
    
    const imageRect = imageRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Consider image boundaries as the content area
    const contentLeft = imageRect.left;
    const contentTop = imageRect.top;
    const contentRight = imageRect.right;
    const contentBottom = imageRect.bottom;
    
    // Calculate which markers are visible based on their position
    const newVisibleMarkers = annotations
      .filter(a => {
        // Calculate marker's absolute position based on image dimensions
        const markerX = contentLeft + (a.left / 100) * imageRect.width;
        const markerY = contentTop + (a.top / 100) * imageRect.height;
        
        // Check if marker is within viewport
        return (
          markerX >= 0 && 
          markerX <= viewportWidth && 
          markerY >= 0 && 
          markerY <= viewportHeight
        );
      })
      .map(a => a.id);
    
    if (JSON.stringify(newVisibleMarkers) !== JSON.stringify(visibleMarkers)) {
      setVisibleMarkers(newVisibleMarkers);
      
      // Call callback if provided
      if (onMarkerVisibilityChange) {
        onMarkerVisibilityChange(newVisibleMarkers);
      }
    }
    
  };
  
  
  // Check marker visibility when image loads or when scale/position changes
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.addEventListener('load', checkMarkerVisibility);
      return () => {
        if (imageRef.current) {
          imageRef.current.removeEventListener('load', checkMarkerVisibility);
        }
      };
    }
  }, []);
  
  // Function to apply zoom - will be called directly when panel opens
  const applyZoom = (coords, id) => {
    // We'll update the zoom state at the end of this function
  
  // Use the external or internal transform ref
  const activeTransformRef = transformRef?.current ? transformRef : internalTransformRef;
  if (!activeTransformRef.current || !imageRef.current) return;
    
    // Set zoom level for tight focus on hotspot
    const zoomLevel = 5;
    
    // Get functions from transform ref
    const { resetTransform, setTransform } = activeTransformRef.current;
    
    // Always reset first to ensure we're starting from a clean state
    resetTransform();
    
    // After reset, get fresh image dimensions
    setTimeout(() => {
      const img = imageRef.current;
      if (img) {
        const rect = img.getBoundingClientRect();
        
        // Apply different adjustments based on which side and specific hotspots
        const isRightSide = id >= 5 && id <= 8;
        const isBottomLeft = id === 4; // Special case for bottom-left hotspot
        
        // Match the hotspot position adjustments
        const pointX = (coords[0] - (isRightSide ? 0.11 : 0.055)) * rect.width; // Right: -11%, Left: -5.5%
        
        // Special case for Golden Eagle (ID 7)
        const isGoldenEagle = id === 7;
        
        // Vertical adjustment varies by position
        const pointY = (coords[1] + (
          isGoldenEagle ? -0.03 : // Golden Eagle: up by 3%
          isRightSide ? 0.01 :    // Other right side: down by 1%
          isBottomLeft ? 0.03 :   // Bottom-left: down by 3%
          -0.02                  // Other left side: up by 2%
        )) * rect.height;
        
        // Fixed dimensions - panel state doesn't affect image position anymore
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        // Calculate position to center hotspot in viewport
        // Apply offset to make room for the panel on the right bottom
        const panelOffsetX = isPanelOpen ? -150 : 0; // Shift left when panel is open (increased for new panel position)
        const panelOffsetY = isPanelOpen ? -80 : 0;  // Shift up when panel is open
        
        // Additional left pan of 30vw (30% of viewport width)
        const leftPanOffset = -containerWidth * 0.3; // -30vw (negative for left direction)
        
        // Center the hotspot in the viewport with offsets
        const centerX = -pointX * zoomLevel + containerWidth / 2 + panelOffsetX + leftPanOffset;
        const centerY = -pointY * zoomLevel + containerHeight / 2 + panelOffsetY;
        
        // Single transform that includes both zoom and pan in one smooth motion
        setTransform(centerX, centerY, zoomLevel, 500);
        
        // Show only the current hotspot
        setZoomedOnHotspot(id);
        
        // Update the zoom state through callback if provided
        if (onZoomChange) {
          onZoomChange(id);
        }
      }
    }, 50);
  };

  
  // Calculate hotspot position based on the original coordinates
  // No scaling factor for now to fix positioning issues
  const annotations = photoData.annotations.map((a) => ({
    ...a,
    top: a.coords[1] * 100, // Convert to percentage for positioning
    left: a.coords[0] * 100
  }));
  
  // Handle hotspot click
  const handleHotspotClick = (annotation) => {
    // Find the original annotation with coordinates
    const origAnnotation = photoData.annotations.find(a => a.id === annotation.id);
    if (!origAnnotation) {
      console.error("Original annotation not found");
      return;
    }
    
    // Begin zooming immediately rather than waiting for panel to open
    applyZoom(origAnnotation.coords, annotation.id);
    
    // Notify parent component to open panel - slide in panel at same time as zoom
    if (onSelectAnnotation) {
      onSelectAnnotation(annotation);
    }
  };
  
  // Track last tap for double-click/tap detection
  const [lastTap, setLastTap] = useState(0);
  
  // Add a click handler for the main image area
  const handleImageClick = (e) => {
    // If we're zoomed in and the panel is open, this click should close the panel
    if (zoomedOnHotspot !== null && isPanelOpen) {
      // Reset zoom
      const activeTransformRef = transformRef?.current ? transformRef : internalTransformRef;
      if (activeTransformRef.current) {
        activeTransformRef.current.resetTransform();
      }
      setZoomedOnHotspot(null);
      
      // Create a new event and dispatch it to body to close the panel
      const closeEvent = new CustomEvent('closeAnnotationPanel');
      document.body.dispatchEvent(closeEvent);
      
      // Stop event propagation
      e.stopPropagation();
    }
    
    // Check for double click to return to photo page
    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 300;
    
    if (now - lastTap < DOUBLE_CLICK_DELAY) {
      // This is a double click/tap - dispatch event to trigger navigation
      const doubleClickEvent = new CustomEvent('doubleClickOnImage');
      document.body.dispatchEvent(doubleClickEvent);
    }
    
    setLastTap(now);
  };

  // Marker type is now received from props

  return (
    <div 
      className="relative image-viewer-container w-full h-full m-0 p-0 overflow-visible"
      style={{ 
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'translate(0, 0) rotate(0deg)',
        overflow: 'visible',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* MarkerSelector has been moved to AnnotationPage */}
      
      <div className="relative w-full h-full m-0 p-0 overflow-visible"
           style={{ 
             display: 'flex', 
             justifyContent: 'center', 
             alignItems: 'center',
             position: 'absolute',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0
           }}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          wheel={{ wheelEnabled: true }}
          pinch={{ pinchEnabled: true }}
          doubleClick={{ 
            disabled: true // Disable built-in double-click to handle it ourselves
          }}
          ref={transformRef || internalTransformRef}
          centerOnInit={true}
          limitToBounds={false}
          centerZoomedOut={true}
          zoomAnimation={{ disabled: false, size: 0.5, animationType: "easeOut" }}
          panning={{ disabled: isPanelOpen && !zoomedOnHotspot && !initialFullScreen }}
          onZoom={({ state }) => {
            setScale(state.scale);
            if (state.scale < 2) {
              setZoomedOnHotspot(null);
            }
            // Check marker visibility on zoom
            checkMarkerVisibility();
          }}
          onPanning={({ state }) => {
            // Manually check marker visibility on panning
            checkMarkerVisibility();
          }}
          onDoubleClick={(e) => {
            // Manual double-click handler
            const doubleClickEvent = new CustomEvent('doubleClickOnImage');
            document.body.dispatchEvent(doubleClickEvent);
            e.preventDefault();
          }}
          wrapperStyle={{
            width: '100vw',
            height: '100vh',
            overflow: 'visible'
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent 
                wrapperStyle={{ 
                  zIndex: 50,
                  width: '100vw',
                  height: '100vh',
                  overflow: 'visible'
                }}
                contentStyle={{ 
                  onDoubleClick: () => {
                    const doubleClickEvent = new CustomEvent('doubleClickOnImage');
                    document.body.dispatchEvent(doubleClickEvent);
                  }
                }}
              >
                <div 
                  className="relative w-screen h-screen flex items-center justify-center overflow-visible"
                  onDoubleClick={() => {
                    const doubleClickEvent = new CustomEvent('doubleClickOnImage');
                    document.body.dispatchEvent(doubleClickEvent);
                  }}
                >
                  <div 
                    className="relative flex items-center justify-center overflow-visible"
                    style={{ 
                      transform: 'translate(0, 0) rotate(0deg)',
                      overflow: 'visible',
                      width: '100vw',
                      height: '100vh'
                    }}
                    onDoubleClick={() => {
                      const doubleClickEvent = new CustomEvent('doubleClickOnImage');
                      document.body.dispatchEvent(doubleClickEvent);
                    }}
                  >
                    <img 
                      ref={imageRef}
                      src={image} 
                      alt="Annotated View" 
                      className="max-h-[110vh] max-w-[110vw] object-contain"
                      style={{ 
                        filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.25))',
                        transform: 'rotate(0deg)'
                      }}
                      onClick={handleImageClick} /* Add click handler for double-click detection */
                    />
                    
                    {/* Add hotspots with adjustments for the actual image dimensions */}
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
                        isVisible={visibleMarkers.includes(a.id)}
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