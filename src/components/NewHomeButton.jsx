import { useNavigate, useLocation } from 'react-router-dom';

export default function NewHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show the button on the home page
  if (location.pathname === '/' || location.pathname === '') {
    return null;
  }
  
  return (
    <button 
      onClick={() => navigate('/')}
      className="fixed bottom-8 right-8 w-14 h-14 flex items-center justify-center z-[99999]"
      aria-label="Return to Home Page"
      style={{ 
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: 'none',
        border: 'none'
      }}
    >
      {/* Home icon with no background */}
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
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </button>
  );
}