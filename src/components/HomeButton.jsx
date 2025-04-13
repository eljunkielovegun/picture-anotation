import { useNavigate, useLocation } from 'react-router-dom';

export default function HomeButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show the button on the home page
  if (location.pathname === '/' || location.pathname === '') {
    return null;
  }
  
  return (
    <button 
      onClick={() => navigate('/')}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center shadow-lg transition-colors z-[99999]"
      aria-label="Return to Home Page"
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        bottom: '2rem',
        right: '2rem'
      }}
    >
      {/* Arrow left icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-6 h-6 text-gray-800"
      >
        <path d="M12 19l-7-7 7-7"/>
        <path d="M19 12H5"/>
      </svg>
    </button>
  );
}