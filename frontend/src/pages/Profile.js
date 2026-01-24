import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import { User, Settings, Info } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-8" data-testid="profile-title">
          Profile & Settings
        </h1>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-[#D90429]" size={24} />
              <h2 className="font-serif text-2xl font-semibold text-slate-900">About Baka News</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Your trusted source for local news from Bihar and Banka. Stay updated with the latest stories, events, and developments in your community.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-[#D90429]" size={24} />
              <h2 className="font-serif text-2xl font-semibold text-slate-900">Categories</h2>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>• <strong>Bihar</strong> - News and updates from across Bihar</li>
              <li>• <strong>Banka</strong> - Local stories from Banka district</li>
              <li>• <strong>Local News</strong> - Community events and local happenings</li>
              <li>• <strong>Trending</strong> - Popular and breaking news stories</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="text-[#D90429]" size={24} />
              <h2 className="font-serif text-2xl font-semibold text-slate-900">Editor Access</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Are you an editor? Access the dashboard to manage news articles.
            </p>
            <button
              onClick={() => navigate('/editor/login')}
              className="bg-[#D90429] text-white hover:bg-[#B90322] rounded-full px-6 py-2.5 font-medium transition-all shadow-sm hover:shadow-md"
              data-testid="editor-login-btn"
            >
              Editor Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;