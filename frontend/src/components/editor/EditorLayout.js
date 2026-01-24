import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EditorSidebar from '../../components/editor/EditorSidebar';
import { Loader2 } from 'lucide-react';

const EditorLayout = ({ children }) => {
  const { editor, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !editor) {
      navigate('/editor/login');
    }
  }, [editor, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D90429]" size={48} />
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <EditorSidebar />
      <div className="dashboard-content flex-1">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default EditorLayout;