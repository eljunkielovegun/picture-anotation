import gsap from 'gsap';

// Entry animations (when page enters)
export const pageEnterAnimations = {
  // PhotoPage -> AnnotationPage (left to right)
  photoToAnnotation: (node, done) => {
    const tl = gsap.timeline({
      onComplete: done,
      defaults: { duration: 0.6, ease: 'power2.out' }
    });

    // Start with the new page (node) off-screen to the right
    tl.fromTo(node, 
      { 
        autoAlpha: 0,
        x: '100%'
      }, 
      { 
        autoAlpha: 1,
        x: '0%'
      }
    );

    return tl;
  },

  // AnnotationPage -> PhotoPage (right to left)
  annotationToPhoto: (node, done) => {
    const tl = gsap.timeline({
      onComplete: done,
      defaults: { duration: 0.6, ease: 'power2.out' }
    });

    // Start with the new page (node) off-screen to the left
    tl.fromTo(node, 
      { 
        autoAlpha: 0,
        x: '-100%'
      }, 
      { 
        autoAlpha: 1,
        x: '0%'
      }
    );

    return tl;
  }
};

// Exit animations (when page exits)
export const pageExitAnimations = {
  // PhotoPage -> AnnotationPage (left to right)
  photoToAnnotation: (node, done) => {
    const tl = gsap.timeline({
      onComplete: done,
      defaults: { duration: 0.6, ease: 'power2.out' }
    });

    // Move the old page (node) off-screen to the left
    tl.to(node, { 
      autoAlpha: 0,
      x: '-100%'
    });

    return tl;
  },

  // AnnotationPage -> PhotoPage (right to left)
  annotationToPhoto: (node, done) => {
    const tl = gsap.timeline({
      onComplete: done,
      defaults: { duration: 0.6, ease: 'power2.out' }
    });

    // Move the old page (node) off-screen to the right
    tl.to(node, { 
      autoAlpha: 0,
      x: '100%'
    });

    return tl;
  }
};