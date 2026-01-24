import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import ArticleCard from '../components/user/ArticleCard';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategoryPage = () => {
  const { category } = useParams();
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
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-[#D90429]" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-8" data-testid="category-title">
          {category}
        </h1>

        {articles.length === 0 ? (
          <div className="text-center py-16" data-testid="no-articles-message">
            <h2 className="font-serif text-2xl text-slate-900 mb-2">No Articles Yet</h2>
            <p className="text-slate-600">Check back soon for news in this category.</p>
          </div>
        ) : (
          <div className="bento-grid" data-testid="category-articles-grid">
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;