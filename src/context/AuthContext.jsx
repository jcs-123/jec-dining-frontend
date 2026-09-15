import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const loginCustomer = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}!`);
        return res.user;
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const registerCustomer = async ({ name, email, phone, password }) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.success) {
        setUser(res.user);
        toast.success('Registration successful!');
        return res.user;
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const loginAdmin = async (email, password, cafeSlug) => {
    try {
      const res = await api.post('/auth/admin/login', { email, password, cafeSlug });
      if (res.success) {
        setUser(res.user);
        toast.success(res.message || 'Admin login successful');
        return res.user;
      }
    } catch (err) {
      toast.error(err.message || 'Admin authentication failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
      setUser(null);
      toast.info('You have been logged out.');
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginCustomer,
      registerCustomer,
      loginAdmin,
      logout,
      refreshUser: fetchCurrentUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'cafe_admin',
      isCustomer: user?.role === 'customer'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
