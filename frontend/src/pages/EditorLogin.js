import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const EditorLogin = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        toast.success(isLogin ? 'Login successful!' : 'Account created successfully!');
        navigate('/editor/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1759668358583-09cdcae2ba36?crop=entropy&cs=srgb&fm=jpg&q=85"
          alt="Banka News"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="font-serif text-5xl font-bold mb-2">Banka News</h1>
          <p className="text-xl text-white/90">Editor Dashboard</p>
          <p className="text-sm text-white/80 mt-2">Banka ki Awaaz | Bihar ka Vishwasniya News Portal</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2" data-testid="editor-login-title">
              {isLogin ? 'Editor Login' : 'Create Editor Account'}
            </h1>
            <p className="text-slate-600">Manage your news articles</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="editor-auth-form">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D90429] focus:border-transparent"
                  placeholder="Enter your name"
                  data-testid="editor-name-input"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D90429] focus:border-transparent"
                placeholder="editor@bankanews.com"
                data-testid="editor-email-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D90429] focus:border-transparent"
                  placeholder="Enter your password"
                  data-testid="editor-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D90429] text-white hover:bg-[#B90322] rounded-full px-6 py-3 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              data-testid="editor-submit-btn"
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#D90429] hover:text-[#B90322] font-medium"
              data-testid="toggle-auth-mode-btn"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-slate-600 hover:text-slate-900 text-sm" data-testid="back-to-news-link">
              ← Back to Banka News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLogin;