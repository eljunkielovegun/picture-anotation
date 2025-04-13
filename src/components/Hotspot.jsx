export default function Hotspot({ top, left, label, onClick, id }) {
  // Apply correction for x-axis offset (4vw) in the opposite direction
  const adjustedLeft = left - 4;
  
  // Calculate a unique phase offset for each dot based on its ID
  // We'll start with PI/1.6 and add incremental phases for each dot
  const basePhase = Math.PI / 1.6; // Approximately 1.963 radians
  const idOffset = id ? (id - 1) *  Math.random(): 0; // Add 0.5s offset per ID
  const phaseInSeconds = basePhase + idOffset;
  
  // Generate a unique animation ID to prevent conflicts
  const animationId = `sine-fade-${id || Math.floor(Math.random() * 1000)}`;
  
  return (
    <button
      onClick={onClick}
      className="absolute z-10 pointer-events-auto p-0 m-0 border-0 bg-transparent outline-none"
      style={{ top: `${top}%`, left: `${adjustedLeft}%`, transform: 'translate(-50%, -50%)', backgroundColor: 'transparent' }}
      aria-label={label}
    >
      {/* White circle SVG with sine wave fade animation and glow effect */}
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
          {/* Use SMIL animation with phase offset following a sine pattern */}
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
    </button>
  );
}
