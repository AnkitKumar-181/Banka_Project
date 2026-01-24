import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import '@/App.css';

import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Search from './pages/Search';
import CategoryPage from './pages/CategoryPage';
import Profile from './pages/Profile';
import EditorLogin from './pages/EditorLogin';
import EditorDashboard from './pages/EditorDashboard';
import ArticlesList from './pages/ArticlesList';
import ArticleForm from './pages/ArticleForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/editor/login" element={<EditorLogin />} />
            <Route path="/editor/dashboard" element={<EditorDashboard />} />
            <Route path="/editor/articles" element={<ArticlesList />} />
            <Route path="/editor/article/new" element={<ArticleForm />} />
            <Route path="/editor/article/edit/:id" element={<ArticleForm />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
