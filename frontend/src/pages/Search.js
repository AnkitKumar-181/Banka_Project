import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(`${API}/articles/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-2" data-testid="search-title">
          खबरें खोजें
        </h1>
        <p className="text-slate-600 mb-8">Search for news articles</p>

        <form onSubmit={handleSearch} className="mb-12" data-testid="search-form">
          <div className="relative bg-white rounded-lg shadow-sm">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="खबरें खोजें..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C00000] focus:border-transparent"
              data-testid="search-input"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#C00000] text-white hover:bg-[#8B0000] rounded-full px-8 py-3 font-medium transition-all shadow-sm hover:shadow-md"
            disabled={loading}
            data-testid="search-submit-btn"
          >
            {loading ? 'खोज रहे हैं...' : 'खोजें'}
          </button>
        </form>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-[#C00000]" size={48} />
          </div>
        )}

        {!loading && searched && (
          <div>
            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm" data-testid="no-results-message">
                <h2 className="font-serif text-2xl text-slate-900 mb-2">कोई परिणाम नहीं मिला</h2>
                <p className="text-slate-600">अन्य कीवर्ड्स आजमाएं</p>
              </div>
            ) : (
              <div>
                <h2 className="font-medium text-slate-600 mb-6" data-testid="results-count">
                  {results.length} खबरें मिलीं
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="search-results-grid">
                  {results.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="bg-white rounded-lg overflow-hidden cursor-pointer group shadow hover:shadow-lg transition-all"
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;