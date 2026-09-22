import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CafeContext = createContext(null);

export const normalizeCafeSlug = (slug) => {
  if (!slug) return 'jeccafe';
  const lower = slug.toLowerCase().trim();
  if (lower.includes('byte')) return 'jecbytes';
  if (lower.includes('cafe')) return 'jeccafe';
  return lower;
};

export const CafeProvider = ({ children }) => {
  const [cafes, setCafes] = useState([]);
  const [currentCafe, setCurrentCafe] = useState(() => {
    try {
      const saved = localStorage.getItem('jec_active_cafe');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.slug === 'jec-bytest' || parsed.slug === 'jec-bytes')) {
          parsed.slug = 'jecbytes';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchCafes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cafes');
      if (res.success && res.cafes) {
        setCafes(res.cafes);

        // Auto-detect active cafe from URL or storage
        const pathSlug = window.location.pathname.replace(/^\//, '').split('/')[0].toLowerCase();
        let target = null;
        if (pathSlug === 'jeccafe' || pathSlug === 'jecbytes' || pathSlug === 'jec-bytes' || pathSlug === 'jec-bytest') {
          const querySlug = pathSlug.includes('byte') ? 'jecbytes' : 'jeccafe';
          target = res.cafes.find(c => c.slug === querySlug || c.slug === pathSlug);
        }
        if (!target && currentCafe) {
          const currentSlug = (currentCafe.slug || '').includes('byte') ? 'jecbytes' : currentCafe.slug;
          target = res.cafes.find(c => c.slug === currentSlug || c.slug === currentCafe.slug);
        }
        if (!target && res.cafes.length > 0) {
          target = res.cafes[0];
        }

        if (target) {
          setCurrentCafe(target);
          localStorage.setItem('jec_active_cafe', JSON.stringify(target));
          document.documentElement.setAttribute('data-theme', target.slug);
        }
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

  const selectCafeBySlug = (slug, list = cafes) => {
    if (!slug) {
      setCurrentCafe(null);
      document.documentElement.removeAttribute('data-theme');
      return null;
    }
    const raw = slug.toLowerCase();
    const targetSlug = raw.includes('byte') ? 'jecbytes' : (raw.includes('cafe') ? 'jeccafe' : raw);
    const sourceList = list && list.length > 0 ? list : cafes;
    const found = sourceList.find(c => c.slug === targetSlug || c.slug === raw);
    if (found) {
      setCurrentCafe(found);
      localStorage.setItem('jec_active_cafe', JSON.stringify(found));
      document.documentElement.setAttribute('data-theme', found.slug);
      return found;
    }
    // Fallback stub if cafes list hasn't resolved yet
    const fallback = {
      slug: targetSlug,
      name: targetSlug === 'jeccafe' ? 'JECCAFE' : 'JEC BYTES'
    };
    setCurrentCafe(fallback);
    document.documentElement.setAttribute('data-theme', targetSlug);
    return fallback;
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
