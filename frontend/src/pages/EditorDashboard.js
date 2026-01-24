import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import EditorLayout from '../components/editor/EditorLayout';
import { FileText, TrendingUp, Calendar, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EditorDashboard = () => {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API}/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Articles',
      value: articles.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Banka',
      value: articles.filter((a) => a.category === 'Banka').length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Bihar',
      value: articles.filter((a) => a.category === 'Bihar').length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'This Week',
      value: articles.filter((a) => {
        const articleDate = new Date(a.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return articleDate > weekAgo;
      }).length,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentArticles = articles.slice(0, 5);

  return (
    <EditorLayout>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2" data-testid="dashboard-title">
          Dashboard
        </h1>
        <p className="text-slate-600">Welcome to Banka News Editor Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-slate-900">Recent Articles</h2>
          <button
            onClick={() => navigate('/editor/article/new')}
            className="flex items-center gap-2 bg-[#D90429] text-white hover:bg-[#B90322] rounded-full px-4 py-2 font-medium transition-all"
            data-testid="new-article-btn"
          >
            <Plus size={18} />
            New Article
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="text-center text-slate-600 py-8">Loading...</p>
          ) : recentArticles.length === 0 ? (
            <div className="text-center py-12" data-testid="no-articles-message">
              <FileText className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-600 mb-4">No articles yet</p>
              <button
                onClick={() => navigate('/editor/article/new')}
                className="bg-[#D90429] text-white hover:bg-[#B90322] rounded-full px-6 py-2.5 font-medium transition-all"
                data-testid="create-first-article-btn"
              >
                Create Your First Article
              </button>
            </div>
          ) : (
            <div className="space-y-4" data-testid="recent-articles-list">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => navigate(`/article/${article.id}`)}
                  className="flex gap-4 p-4 rounded-lg border border-slate-200 hover:border-[#D90429] cursor-pointer transition-colors"
                  data-testid={`recent-article-${article.id}`}
                >
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs uppercase tracking-wider bg-[#D90429] text-white px-2 py-1 rounded-sm">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="font-serif font-semibold text-slate-900 line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EditorLayout>
  );
};

export default EditorDashboard;