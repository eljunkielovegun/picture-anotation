import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-lg font-semibold text-gray-800">
              Zuni Eagle Cage
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/photo"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/photo' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Photo
            </Link>
            <Link 
              to="/interview"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/interview' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Interview
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
