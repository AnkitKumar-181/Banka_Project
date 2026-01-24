import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const categories = [
    { name: 'Banka', path: '/category/Banka' },
    { name: 'Bihar', path: '/category/Bihar' },
    { name: 'Local News', path: '/category/Local News' },
    { name: 'Trending', path: '/category/Trending' },
  ];

  return (
    <>
      <div className="bg-[#D90429] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">ताज़ा खबरें | Banka से Bihar तक</span>
            </div>
            <div className="hidden md:block text-xs">
              <span>Banka ki Awaaz | Bihar ka Vishwasniya News Portal</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center" data-testid="nav-home-link">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Banka News
              </h1>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                      isActive(cat.path) ? 'text-[#D90429] border-b-2 border-[#D90429] pb-1' : 'text-slate-700 hover:text-[#D90429]'
                    }`}
                    data-testid={`nav-category-${cat.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="flex gap-4">
                <Link
                  to="/search"
                  className={`p-2 rounded-full transition-colors ${
                    isActive('/search') ? 'bg-[#D90429] text-white' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  data-testid="nav-search-btn"
                >
                  <Search size={20} />
                </Link>
                <Link
                  to="/profile"
                  className={`p-2 rounded-full transition-colors ${
                    isActive('/profile') ? 'bg-[#D90429] text-white' : 'hover:bg-slate-100 text-slate-600'
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
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isActive(cat.path)
                        ? 'bg-[#D90429] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/') ? 'text-[#D90429]' : 'text-slate-600'
            }`}
            data-testid="mobile-nav-home"
          >
            <Home size={22} />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/search') ? 'text-[#D90429]' : 'text-slate-600'
            }`}
            data-testid="mobile-nav-search"
          >
            <Search size={22} />
            <span className="text-xs">Search</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive('/profile') ? 'text-[#D90429]' : 'text-slate-600'
            }`}
            data-testid="mobile-nav-profile"
          >
            <User size={22} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;