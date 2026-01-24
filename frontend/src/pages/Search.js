import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import ArticleCard from '../components/user/ArticleCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Search = () => {
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
    <div className="min-h-screen pb-20 md:pb-8">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-8" data-testid="search-title">
          Search News
        </h1>

        <form onSubmit={handleSearch} className="mb-12" data-testid="search-form">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for news articles..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D90429] focus:border-transparent"
              data-testid="search-input"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#D90429] text-white hover:bg-[#B90322] rounded-full px-8 py-3 font-medium transition-all shadow-sm hover:shadow-md"
            disabled={loading}
            data-testid="search-submit-btn"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-[#D90429]" size={48} />
          </div>
        )}

        {!loading && searched && (
          <div>
            {results.length === 0 ? (
              <div className="text-center py-16" data-testid="no-results-message">
                <h2 className="font-serif text-2xl text-slate-900 mb-2">No Results Found</h2>
                <p className="text-slate-600">Try different keywords</p>
              </div>
            ) : (
              <div>
                <h2 className="font-medium text-slate-600 mb-6" data-testid="results-count">
                  Found {results.length} article{results.length !== 1 ? 's' : ''}
                </h2>
                <div className="bento-grid" data-testid="search-results-grid">
                  {results.map((article) => (
                    <ArticleCard key={article.id} article={article} />
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