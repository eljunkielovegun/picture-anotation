import React from 'react';
import { Link } from 'react-router-dom';
import { getAssetPath } from '../utils/assetUtils';
// Import styles directly in index.css with Tailwind

function HomePage() {
  return (
    <Link to="/photo" style={{ textDecoration: 'none' }}>
      <div className="home-page">
        {/* Corner images with their respective labels and arrows */}
        <div className="corner-image top-right">
          <img src={getAssetPath('assets/images/lavaStone.png')} alt="" aria-hidden="true" />
        </div>
        
        <div className="corner-image bottom-right">
          <img src={getAssetPath('assets/images/eagle.png')} alt="" aria-hidden="true" />
        </div>
        
        <div className="corner-image bottom-left">
          <img src={getAssetPath('assets/images/frame.png')} alt="" aria-hidden="true" />
      </div>

        {/* Labels with arrows */}
        <div className="corner-label lava-stone">
          <span>Lava Stone</span>
          <svg className="arrow" viewBox="0 0 100 100" width="100" height="100">
            <path d="M20,20 Q50,10 80,20" fill="none" stroke="#F5F7DC" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="corner-label eagle">
          <span>Eagle</span>
          <svg className="arrow" viewBox="0 0 100 100" width="100" height="100">
            <path d="M20,80 Q40,50 80,80" fill="none" stroke="#F5F7DC" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="corner-label frame">
          <span>Frame</span>
          <svg className="arrow" viewBox="0 0 100 100" width="100" height="100">
            <path d="M80,20 Q50,30 20,20" fill="none" stroke="#F5F7DC" strokeWidth="2" />
          </svg>
        </div>

        {/* Main content */}
        <div className="content">
          <h1 className="title font-p22-freely">Photo<br />Annotations</h1>
          <h2 className="author font-felt-tip">by Curtis Quam</h2>
          <h2 className="author font-felt-tip">THIS IS AN UPDATE</h2>
          
          <Link to="/photo" className="cta-button font-urw-din">
            Tap to start
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default HomePage;