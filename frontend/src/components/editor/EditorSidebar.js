import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, FileText, Plus, LogOut, Newspaper } from 'lucide-react';

const EditorSidebar = () => {
  const { editor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/editor/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/editor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/editor/articles', icon: FileText, label: 'All Articles' },
    { path: '/editor/article/new', icon: Plus, label: 'New Article' },
  ];

  return (
    <div className="dashboard-sidebar">
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2" data-testid="sidebar-home-link">
          <Newspaper className="text-[#D90429]" size={28} />
          <div>
            <h1 className="font-serif text-xl font-bold text-white">Baka News</h1>
            <p className="text-xs text-gray-400">Editor Panel</p>
          </div>
        </Link>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#1F2937] text-white'
                    : 'text-gray-300 hover:bg-[#1F2937] hover:text-white'
                }`}
                data-testid={`sidebar-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="mb-3 px-2">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="text-white font-medium truncate" data-testid="editor-name">{editor?.name}</p>
          <p className="text-xs text-gray-400 truncate" data-testid="editor-email">{editor?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          data-testid="logout-btn"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default EditorSidebar;