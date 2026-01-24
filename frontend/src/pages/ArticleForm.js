import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import EditorLayout from '../components/editor/EditorLayout';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Bihar',
    body: '',
    image_url: '',
    image_public_id: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${API}/articles/${id}`);
      const article = response.data;
      setFormData({
        title: article.title,
        category: article.category,
        body: article.body,
        image_url: article.image_url,
        image_public_id: article.image_public_id,
      });
      setImagePreview(article.image_url);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Failed to load article');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const sigResponse = await axios.get(`${API}/cloudinary/signature`, {
        headers: getAuthHeader(),
      });
      const sig = sigResponse.data;

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('api_key', sig.api_key);
      formData.append('timestamp', sig.timestamp);
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
        formData
      );

      return {
        image_url: uploadResponse.data.secure_url,
        image_public_id: uploadResponse.data.public_id,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.body) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditMode && !imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);

    try {
      let imageData = {
        image_url: formData.image_url,
        image_public_id: formData.image_public_id,
      };

      if (imageFile) {
        const uploadResult = await uploadImage();
        if (!uploadResult) {
          setLoading(false);
          return;
        }
        imageData = uploadResult;
      }

      const articleData = {
        ...formData,
        ...imageData,
      };

      if (isEditMode) {
        await axios.put(`${API}/articles/${id}`, articleData, {
          headers: getAuthHeader(),
        });
        toast.success('Article updated successfully!');
      } else {
        await axios.post(`${API}/articles`, articleData, {
          headers: getAuthHeader(),
        });
        toast.success('Article created successfully!');
      }

      navigate('/editor/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (!isEditMode) {
      setFormData({ ...formData, image_url: '', image_public_id: '' });
    }
  };

  return (
    <EditorLayout>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2" data-testid="article-form-title">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
        <p className="text-slate-600">Fill in the details below</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl" data-testid="article-form">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Article Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C00000] focus:border-transparent"
              placeholder="Enter article headline"
              data-testid="article-title-input"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C00000] focus:border-transparent"
              data-testid="article-category-select"
            >
              <option value="Bihar">Bihar</option>
              <option value="Banka">Banka</option>
              <option value="Local News">Local News</option>
              <option value="Trending">Trending</option>
            </select>
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-2">
              Article Body *
            </label>
            <textarea
              id="body"
              name="body"
              required
              value={formData.body}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C00000] focus:border-transparent resize-none"
              placeholder="Write your article content here..."
              data-testid="article-body-textarea"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Featured Image {!isEditMode && '*'}
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-64 object-cover rounded-lg border border-slate-200"
                  data-testid="image-preview"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  data-testid="remove-image-btn"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#C00000] transition-colors"
                data-testid="image-upload-area"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <Loader2 className="animate-spin text-[#C00000] mb-3" size={48} />
                  ) : (
                    <ImageIcon className="text-slate-400 mb-3" size={48} />
                  )}
                  <p className="mb-2 text-sm text-slate-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  data-testid="image-file-input"
                />
              </label>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-[#C00000] text-white hover:bg-[#8B0000] rounded-full px-8 py-3 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              data-testid="submit-article-btn"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {uploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                isEditMode ? 'Update Article' : 'Publish Article'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/editor/articles')}
              className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-full px-8 py-3 font-medium transition-all"
              data-testid="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </EditorLayout>
  );
};

export default ArticleForm;