import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import { ArrowLeft, Loader2, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${API}/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-[#D90429]" size={48} />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="font-serif text-3xl text-slate-900 mb-4">Article Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-[#D90429] text-white hover:bg-[#B90322] rounded-full px-6 py-2.5 font-medium transition-all"
            data-testid="back-to-home-btn"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-slate-50">
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8" data-testid="article-detail">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#D90429] mb-6 transition-colors font-medium"
          data-testid="back-button"
        >
          <ArrowLeft size={20} />
          <span>वापस जाएं</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <span className="inline-block bg-[#D90429] text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider mb-4" data-testid="article-category">
                {article.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-slate-900 mb-4" data-testid="article-title">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm" data-testid="article-meta">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{format(new Date(article.created_at), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Banka, Bihar</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto rounded-lg"
                data-testid="article-image"
              />
            </div>

            <div className="prose prose-lg max-w-none" data-testid="article-body">
              <div className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                {article.body}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;