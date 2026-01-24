import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [category]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/articles?category=${encodeURIComponent(category)}`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-[#C00000]" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8 pb-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#C00000] mb-2" data-testid="category-title">
            {category}
          </h1>
          <div className="w-24 h-1 bg-[#C00000] mb-3"></div>
          <p className="text-slate-600 text-lg">{category} से जुड़ी ताज़ा खबरें</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm" data-testid="no-articles-message">
            <h2 className="font-serif text-2xl text-slate-900 mb-2">अभी कोई खबर नहीं है</h2>
            <p className="text-slate-600">इस श्रेणी में खबरों के लिए जल्द ही वापस आएं</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="category-articles-grid">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/article/${article.id}`)}
                className="bg-white rounded-lg overflow-hidden cursor-pointer group shadow hover:shadow-lg transition-all"
                data-testid={`category-article-${article.id}`}
              >
                <div className="relative h-48">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#C00000] px-2 py-1 rounded text-xs font-bold uppercase text-white">
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-slate-900 text-lg line-clamp-2 mb-3 group-hover:text-[#C00000] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {article.body.substring(0, 100)}...
                  </p>
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;