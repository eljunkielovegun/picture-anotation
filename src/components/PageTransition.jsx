import React, { useRef, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import { pageEnterAnimations, pageExitAnimations } from '../utils/transitions';

const PageTransition = ({ 
  children, 
  location, 
  transitionKey,
  inProp, 
  transitionType = 'photoToAnnotation',
  onExited = () => {}
}) => {
  const nodeRef = useRef(null);
  
  // Use this for debugging if needed
  useEffect(() => {
    console.log(`PageTransition: ${transitionType}, inProp: ${inProp}`);
  }, [inProp, transitionType]);

  return (
    <Transition
      nodeRef={nodeRef}
      in={inProp}
      timeout={600} // Match this to your GSAP animation duration
      mountOnEnter
      unmountOnExit
      onEnter={(node) => {
        // Reset transforms before animation starts
        node.style.transform = '';
        node.style.opacity = '0';
      }}
      onEntering={(node) => {
        // Run enter animation
        const animation = pageEnterAnimations[transitionType];
        if (animation) {
          animation(node);
        }
      }}
      onExit={(node) => {
        // Run exit animation
        const animation = pageExitAnimations[transitionType];
        if (animation) {
          animation(node, onExited);
        }
      }}
      addEndListener={(node, done) => {
        // This will be called when the transition is complete
        // The animation itself calls done() when finished
      }}
    >
      <div ref={nodeRef} className="page-container w-screen h-screen absolute top-0 left-0">
        {children}
      </div>
    </Transition>
  );
};

export default PageTransition;