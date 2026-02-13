import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#f9fafb] font-poppins">
      {/* Main Footer Content */}
      <div className="footer-bg">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Column 1: Logo & Description */}
            <div className="lg:col-span-4 space-y-6">
              <img 
                src="/nab.png" 
                className="h-20 w-auto" 
                alt="NAB Logo" 
              />
              <p className="text-white text-md leading-relaxed font-poppins">
                Welcome to NATIONAL ACCOUNTANCY BUREAU, your trusted partner in financial excellence.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href="mailto:nab01062019@gmail.com"
                  className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  aria-label="Email"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
                <a  
                  href="https://www.instagram.com/national_accountancy.bureau?igsh=cXBmb3RvYnMxbzEw&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-300 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Explore Links */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 font-archivo flex items-center gap-3">
                  Explore
                  {/* <span className="flex-grow h-px bg-blue-600"></span> */}
                </h3>
              </div>
              <nav className="space-y-4">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About Company' },
                  { to: '/services', label: 'Services' },
                  { to: '/blog', label: 'Blog & Media' },
                  { to: '/contact', label: 'Contact us' }
                ].map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className="block text-white hover:text-blue-500 transition-colors duration-300 text-md font-poppins font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Contact Information */}
            <div className="lg:col-span-5">
              <div className="mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 font-archivo flex items-center gap-3">
                  Contact
                  {/* <span className="flex-grow h-px bg-blue-600"></span> */}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center text-blue-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-white text-md font-medium leading-relaxed font-poppins">
                    14 Sammelan Marg, <br /> 
                    Near Chandralok Theatre, Prayagraj - <br />
                    211003
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center text-blue-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a 
                      href="tel:+919506554198"
                      className="block text-white text-md font-medium hover:text-blue-500 transition-colors duration-300 text-sm font-poppins"
                    >
                      +91 9506554198
                    </a>
                    <a 
                      href="tel:+918400357357"
                      className="block text-white text-md font-medium hover:text-blue-500 transition-colors duration-300 text-sm font-poppins"
                    >
                      +91 8400357357
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center text-blue-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <a 
                      href="mailto:nab01062019@gmail.com"
                      className="text-white text-md font-medium hover:text-blue-500 transition-colors duration-300 text-sm break-all font-poppins"
                    >
                      nab01062019@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-white text-md font-poppins">
            Created by{' '}
            <a 
              href="https://bebeyond.digital/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors duration-300 hover:underline"
            >
              BeBeyond Digital Solutions
            </a>
          </p>
        </div>
      </div>
      </div>

      {/* Footer Bottom */}
      
    </footer>
  );
};

export default Footer;