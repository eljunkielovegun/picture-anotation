import React, { useState, useRef, useEffect } from 'react';
import { getAssetPath } from '../utils/assetUtils';

const IntroCarousel = ({ introData, curtisData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const carouselRef = useRef(null);

  // Handle dot navigation
  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Handle touch/mouse events for swiping
  const handleTouchStart = (e) => {
    // Stop event propagation to prevent parent handlers from firing
    e.stopPropagation();
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    // Stop event propagation to prevent parent handlers from firing
    e.stopPropagation();
    if (!startX || !isSwiping) return;
    setCurrentX(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const handleTouchEnd = (e) => {
    // Stop event propagation to prevent parent handlers from firing
    e.stopPropagation();
    if (!startX || !currentX || !isSwiping) {
      setIsSwiping(false);
      return;
    }

    const diff = startX - currentX;
    
    // Determine if swipe was significant enough to change slide
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left, go to next slide
        setActiveIndex(prev => Math.min(prev + 1, 1));
      } else {
        // Swiped right, go to previous slide
        setActiveIndex(prev => Math.max(prev - 1, 0));
      }
    }
    
    // Reset swipe state
    setStartX(null);
    setCurrentX(null);
    setIsSwiping(false);
  };

  return (
    <div className="intro-carousel relative w-full">
      {/* Carousel container */}
      <div 
        ref={carouselRef}
        className="carousel-container overflow-hidden relative w-full"
        style={{ minHeight: '370px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Slides container with transform for slide effect */}
        <div 
          className="slides-container flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {/* Card 1: Intro Text */}
          <div className="slide flex-shrink-0 w-full">
            <div className="rounded-lg text-s sm:text-sm leading-relaxed h-full"
             style={{paddingLeft: "2vw"}}
            >

              <h2 className="font-p22-freely text-3xl">
                About This Photo
              </h2>
              {introData.paragraphs.map((p, idx) => (
                <p key={idx} className="text-left">{p}</p>
              ))}
            </div>
          </div>

          {/* Card 2: Curtis Photo and Title */}
          <div className="slide flex-shrink-0 w-full">
            <div className="rounded-lg flex flex-col h-full">
              <h2 className="font-p22-freely text-3xl">
                {curtisData.titleText}
              </h2>
              <div className="flex flex-col items-center">
                <img 
                  src={getAssetPath(curtisData.url)} 
                  alt={curtisData.title}
                  className="max-w-full rounded-lg"
                  style={{ maxWidth: '75%', objectFit: 'contain' }}
                  onTouchStart={(e) => {
                    // Custom handling for Curtis photo
                    e.stopPropagation();
                    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
                    setIsSwiping(true);
                  }}
                  onTouchMove={(e) => {
                    e.stopPropagation();
                    if (!startX || !isSwiping) return;
                    setCurrentX(e.touches ? e.touches[0].clientX : e.clientX);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    if (!startX || !currentX || !isSwiping) {
                      setIsSwiping(false);
                      return;
                    }

                    const diff = startX - currentX;
                    
                    // Swiping left should always go to first slide (info panel)
                    if (diff > 50 && activeIndex === 1) {
                      setActiveIndex(0); // Go to info panel
                    } 
                    // Swiping right when on info panel should go to Curtis photo
                    else if (diff < -50 && activeIndex === 0) {
                      setActiveIndex(1); // Go to Curtis photo
                    }
                    
                    setStartX(null);
                    setCurrentX(null);
                    setIsSwiping(false);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setStartX(e.clientX);
                    setIsSwiping(true);
                  }}
                  onMouseMove={(e) => {
                    e.stopPropagation();
                    if (!startX || !isSwiping) return;
                    setCurrentX(e.clientX);
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    if (!startX || !currentX || !isSwiping) {
                      setIsSwiping(false);
                      return;
                    }

                    const diff = startX - currentX;
                    
                    // Same swipe behavior for mouse as for touch
                    if (diff > 50 && activeIndex === 1) {
                      setActiveIndex(0); // Go to info panel
                    } 
                    else if (diff < -50 && activeIndex === 0) {
                      setActiveIndex(1); // Go to Curtis photo
                    }
                    
                    setStartX(null);
                    setCurrentX(null);
                    setIsSwiping(false);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setIsSwiping(false);
                  }}
                />
              
              </div>
              <div className="text-xs text-gray-600 text-center"
              style={{ fontSize: '0.5em'}}
              >
                <p>Photo: {curtisData.credit.photographer} ({curtisData.credit.year})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation circles */}
      <div className="dots-container flex justify-center mt-2">
        {[0, 1].map((index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              margin: '0 3px',
              borderRadius: '50%',
              cursor: 'pointer',
              backgroundColor: activeIndex === index ? 'black' : '#d1d1d1'
            }}
            aria-label={`Go to slide ${index + 1}`}
            role="button"
            tabIndex={0}
          />
        ))}
      </div>
    </div>
  );
};

export default IntroCarousel;