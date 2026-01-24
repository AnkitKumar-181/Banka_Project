import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [editor, setEditor] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bakaNewsToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEditor = localStorage.getItem('bakaNewsEditor');
    if (storedEditor && token) {
      setEditor(JSON.parse(storedEditor));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { token, editor } = response.data;
      localStorage.setItem('bakaNewsToken', token);
      localStorage.setItem('bakaNewsEditor', JSON.stringify(editor));
      setToken(token);
      setEditor(editor);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await axios.post(`${API}/auth/signup`, { email, password, name });
      const { token, editor } = response.data;
      localStorage.setItem('bakaNewsToken', token);
      localStorage.setItem('bakaNewsEditor', JSON.stringify(editor));
      setToken(token);
      setEditor(editor);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('bakaNewsToken');
    localStorage.removeItem('bakaNewsEditor');
    setToken(null);
    setEditor(null);
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ editor, token, login, signup, logout, getAuthHeader, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);