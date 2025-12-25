import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Rooms & Suites', path: '/rooms' },
    { name: 'Features', path: '/features' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Guest Services', path: '/guest-services' },
    { name: 'AI Concierge', path: '/ai-concierge' },
    { name: 'Policies', path: '/rules' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-black sticky top-0 z-50 border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <svg className="h-7 w-7 text-white transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.43L19.57 9L12 13.57L4.43 9L12 4.43Z"></path>
            </svg>
            <h1 className="font-serif text-2xl font-medium tracking-tight group-hover:text-gray-300 transition-colors">
              Zenith Suites
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all duration-200 hover:scale-105 ${
                  isActive(link.path)
                    ? 'text-white font-semibold border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Book Now Button - Desktop */}
            <Link 
              to="/booking" 
              className="hidden lg:inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Reserve Now
            </Link>

            {/* Account Icon */}
            <Link 
              to="/account" 
              className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${
                isActive('/account') ? 'bg-gray-700 shadow-md' : 'hover:bg-gray-800'
              }`}
              title="My Account"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path>
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="p-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 lg:hidden hover:scale-110"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" fillRule="evenodd"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-800 animate-fadeIn">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2.5 px-4 rounded-md transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-white font-semibold bg-gray-800'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Book Now Button */}
              <Link
                to="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 py-3 px-4 bg-white text-black font-semibold text-center rounded-md hover:bg-gray-200 transition-colors"
              >
                Reserve Now
              </Link>

              {/* Mobile Account Link */}
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2.5 px-4 rounded-md transition-all ${
                  isActive('/account')
                    ? 'text-white font-semibold bg-gray-800'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                My Account
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-800 my-2"></div>

              {/* Admin Login */}
              <Link
                to="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-4 text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Portal
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
