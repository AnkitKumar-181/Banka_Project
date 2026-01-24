import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const categories = [
    { name: 'BANKA', path: '/category/Banka' },
    { name: 'BIHAR', path: '/category/Bihar' },
    { name: 'LOCAL NEWS', path: '/category/Local News' },
    { name: 'TRENDING', path: '/category/Trending' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center" data-testid="nav-home-link">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Banka News
              </h1>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-6">
                {categories.map((cat) => {
                  const active = isActive(cat.path);
                  return (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className={`text-sm font-bold uppercase tracking-wide transition-all duration-200 pb-1 border-b-2 ${
                        active 
                          ? 'text-[#C00000] border-[#C00000]' 
                          : 'text-black border-transparent hover:text-[#8B0000]'
                      }`}
                      data-testid={`nav-category-${cat.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <Link
                  to="/search"
                  className={`p-2 rounded-full transition-colors ${
                    isActive('/search') ? 'bg-[#C00000] text-white' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  data-testid="nav-search-btn"
                >
                  <Search size={20} />
                </Link>
                <Link
                  to="/profile"
                  className={`p-2 rounded-full transition-colors ${
                    isActive('/profile') ? 'bg-[#C00000] text-white' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  data-testid="nav-profile-btn"
                >
                  <User size={20} />
                </Link>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200" data-testid="mobile-menu">
              <div className="flex flex-col gap-3">
                {categories.map((cat) => {
                  const active = isActive(cat.path);
                  return (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2 rounded-md text-sm font-bold ${
                        active
                          ? 'bg-[#C00000] text-white'
                          : 'text-black hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Scrolling Headline Strip */}
      <div className="sticky top-16 z-40 bg-[#C00000] text-white py-2 overflow-hidden shadow-md" data-testid="headline-strip">
        <div className="headline-marquee">
          <div className="headline-content">
            <span className="font-bold text-sm md:text-base tracking-wide">
              ⚡ ताज़ा खबरें | Banka से Bihar तक • Breaking News • स्थानीय समाचार • Latest Updates • 
              ताज़ा खबरें | Banka से Bihar तक • Breaking News • स्थानीय समाचार • Latest Updates • 
              ताज़ा खबरें | Banka से Bihar तक • Breaking News • स्थानीय समाचार • Latest Updates
            </span>
          </div>
        </div>
      </div>

      <div className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/') ? 'text-[#C00000]' : 'text-slate-600'
            }`}
            data-testid="mobile-nav-home"
          >
            <Home size={22} />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/search') ? 'text-[#C00000]' : 'text-slate-600'
            }`}
            data-testid="mobile-nav-search"
          >
            <Search size={22} />
            <span className="text-xs">Search</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/profile') ? 'text-[#C00000]' : 'text-slate-600'
            }`}
            data-testid="mobile-nav-profile"
          >
            <User size={22} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .headline-marquee {
          display: flex;
          width: 100%;
        }
        
        .headline-content {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-left 40s linear infinite;
        }
        
        .headline-marquee:hover .headline-content {
          animation-play-state: paused;
        }
        
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;