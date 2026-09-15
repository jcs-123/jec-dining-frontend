import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CafeContext = createContext(null);

export const CafeProvider = ({ children }) => {
  const [cafes, setCafes] = useState([]);
  const [currentCafe, setCurrentCafe] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCafes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cafes');
      if (res.success && res.cafes) {
        setCafes(res.cafes);
      }
    } catch (err) {
      console.error('Failed to fetch cafes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  const selectCafeBySlug = (slug) => {
    if (!slug) {
      setCurrentCafe(null);
      document.documentElement.removeAttribute('data-theme');
      return null;
    }
    const found = cafes.find(c => c.slug === slug.toLowerCase());
    if (found) {
      setCurrentCafe(found);
      document.documentElement.setAttribute('data-theme', found.slug);
      return found;
    }
    return null;
  };

  return (
    <CafeContext.Provider value={{
      cafes,
      currentCafe,
      loading,
      selectCafeBySlug,
      refreshCafes: fetchCafes
    }}>
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) throw new Error('useCafe must be used within a CafeProvider');
  return context;
};
