import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-[#D90429]" size={48} />
        </div>
      </div>
    );
  }

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);
  const trendingArticles = articles.slice(4, 8);

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {articles.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm" data-testid="no-articles-message">
            <h2 className="font-serif text-3xl text-slate-900 mb-4">अभी कोई खबर नहीं है</h2>
            <p className="text-slate-600">Banka और Bihar की ताज़ा खबरों के लिए जल्द ही वापस आएं</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Featured News - Left Column */}
            <div className="lg:col-span-2">
              {featuredArticle && (
                <div
                  onClick={() => navigate(`/article/${featuredArticle.id}`)}
                  className="relative h-[500px] rounded-lg overflow-hidden cursor-pointer group shadow-lg"
                  data-testid={`featured-article-${featuredArticle.id}`}
                >
                  <img
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-[#C00000] px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider" data-testid={`featured-category-${featuredArticle.id}`}>
                        {featuredArticle.category}
                      </span>
                      <span className="text-sm text-slate-200" data-testid={`featured-time-${featuredArticle.id}`}>
                        {formatDistanceToNow(new Date(featuredArticle.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-3" data-testid={`featured-title-${featuredArticle.id}`}>
                      {featuredArticle.title}
                    </h2>
                    <p className="text-slate-200 text-base line-clamp-2">
                      {featuredArticle.body.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              )}

              {/* Secondary News Below Featured */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {secondaryArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => navigate(`/article/${article.id}`)}
                    className="bg-white rounded-lg overflow-hidden cursor-pointer group shadow hover:shadow-lg transition-shadow"
                    data-testid={`secondary-article-${article.id}`}
                  >
                    <div className="relative h-40">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-2 left-2 bg-[#D90429] px-2 py-1 rounded text-xs font-bold uppercase text-white">
                        {article.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-slate-900 text-base line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Sidebar - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-5 sticky top-20">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-[#D90429]">
                  <TrendingUp className="text-[#D90429]" size={24} />
                  <h3 className="font-serif text-2xl font-bold text-slate-900">ट्रेंडिंग</h3>
                </div>
                <div className="space-y-4">
                  {trendingArticles.map((article, index) => (
                    <div
                      key={article.id}
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="group cursor-pointer border-b border-slate-100 pb-4 last:border-0"
                      data-testid={`trending-article-${article.id}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-slate-100 text-[#D90429] px-2 py-0.5 rounded text-xs font-bold uppercase">
                              {article.category}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-[#D90429] transition-colors">
                            {article.title}
                          </h4>
                          <span className="text-xs text-slate-500 mt-1 inline-block">
                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;