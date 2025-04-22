import React from 'react';

export default function BackButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 flex items-center justify-center z-[99999]"
      aria-label="Go Back"
      style={{ 
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: 'none',
        border: 'none'
      }}
    >
      {/* Back arrow icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36" 
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}