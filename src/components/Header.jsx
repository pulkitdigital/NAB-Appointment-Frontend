import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLink = (path) =>
    `font-archivo text-[16px] font-bold transition duration-300 ${
      location.pathname === path
        ? "text-green-600"
        : "text-[#0f172a] hover:text-green-600"
    }`;

  const mobileNavLink = (path) =>
    `block font-archivo text-lg font-bold py-3 transition duration-300 ${
      location.pathname === path
        ? "text-green-600"
        : "text-[#0f172a] hover:text-green-600"
    }`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#f3f3f3] border-b border-gray-300 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMenu}>
              <img
                src="/nab.png"
                alt="logo"
                className="h-12 sm:h-14 md:h-16 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
            <Link to="/" className={navLink("/")}>Home</Link>
            <Link to="/about" className={navLink("/about")}>About</Link>
            <Link to="/services" className={navLink("/services")}>Services</Link>
            <Link to="/blog" className={navLink("/blog")}>Blog</Link>
            <Link to="/contact" className={navLink("/contact")}>Contact</Link>
          </nav>

          {/* Call Section - Desktop */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            
            {/* Phone Icon */}
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 lg:w-7 lg:h-7 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011-.24c1.12.37 2.33.57 3.59.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.26.2 2.47.57 3.59a1 1 0 01-.24 1l-2.21 2.2z" />
              </svg>
            </div>

            <div className="leading-tight">
              <p className="font-poppins text-xs text-gray-500 mb-1">
                Requesting A Call
              </p>
              <a
                href="tel:+919506554198"
                className="font-archivo text-sm lg:text-[15px] font-bold text-[#0f172a] hover:text-green-600 transition duration-300"
              >
                +91 9506554198
              </a>
              <a
                  href="tel:+918400357357"
                  className="font-archivo text-sm font-bold text-[#0f172a] hover:text-green-600 transition duration-300 block"
                >
                  +91 8400357357
                </a>
            </div>

          </div>

          {/* Hamburger Menu Button - Visible on mobile/tablet */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-[#0f172a] hover:text-green-600 hover:bg-white/50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 sm:w-80 bg-[#f3f3f3] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <img
              src="/nab.png"
              alt="logo"
              className="h-12 object-contain"
            />
            <button
              onClick={closeMenu}
              className="p-2 rounded-md text-[#0f172a] hover:text-green-600 hover:bg-white/50 transition duration-300"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link to="/" className={mobileNavLink("/")} onClick={closeMenu}>
              Home
            </Link>
            <Link to="/about" className={mobileNavLink("/about")} onClick={closeMenu}>
              About
            </Link>
            <Link to="/services" className={mobileNavLink("/services")} onClick={closeMenu}>
              Services
            </Link>
            <Link to="/blog" className={mobileNavLink("/blog")} onClick={closeMenu}>
              Blog
            </Link>
            <Link to="/contact" className={mobileNavLink("/contact")} onClick={closeMenu}>
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Footer - Contact Info */}
          <div className="border-t border-gray-300 p-5 space-y-3 bg-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011-.24c1.12.37 2.33.57 3.59.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.26.2 2.47.57 3.59a1 1 0 01-.24 1l-2.21 2.2z" />
                </svg>
              </div>
              <div>
                <p className="font-poppins text-xs text-gray-500 mb-1">
                  Contact Us
                </p>
                <a
                  href="tel:+919506554198"
                  className="font-archivo text-sm font-bold text-[#0f172a] hover:text-green-600 transition duration-300 block"
                >
                  +91 9506554198
                </a>
                <a
                  href="tel:+918400357357"
                  className="font-archivo text-sm font-bold text-[#0f172a] hover:text-green-600 transition duration-300 block"
                >
                  +91 8400357357
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;