import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import EditorLayout from '../components/editor/EditorLayout';
import { Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ArticlesList = () => {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API}/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setDeleting(articleId);
    try {
      await axios.delete(`${API}/articles/${articleId}`, {
        headers: getAuthHeader(),
      });
      toast.success('Article deleted successfully');
      setArticles(articles.filter((a) => a.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <EditorLayout>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2" data-testid="articles-list-title">
          All Articles
        </h1>
        <p className="text-slate-600">Manage your published articles</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#D90429]" size={48} />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center" data-testid="no-articles-message">
          <p className="text-slate-600 mb-4">No articles found</p>
          <button
            onClick={() => navigate('/editor/article/new')}
            className="bg-[#D90429] text-white hover:bg-[#B90322] rounded-full px-6 py-2.5 font-medium transition-all"
            data-testid="create-article-btn"
          >
            Create Your First Article
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="articles-table">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50" data-testid={`article-row-${article.id}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-slate-900 line-clamp-1">{article.title}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {article.body.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block text-xs uppercase tracking-wider bg-[#D90429] text-white px-2 py-1 rounded-sm">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {format(new Date(article.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/article/${article.id}`)}
                          className="p-2 text-slate-600 hover:text-[#002FA7] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View"
                          data-testid={`view-article-${article.id}`}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/editor/article/edit/${article.id}`)}
                          className="p-2 text-slate-600 hover:text-[#D90429] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                          data-testid={`edit-article-${article.id}`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                          data-testid={`delete-article-${article.id}`}
                        >
                          {deleting === article.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </EditorLayout>
  );
};

export default ArticlesList;