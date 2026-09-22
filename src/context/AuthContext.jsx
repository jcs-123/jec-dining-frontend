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

  const loginCustomer = async (identifierOrEmail, password) => {
    try {
      const payload = typeof identifierOrEmail === 'object'
        ? identifierOrEmail
        : { identifier: identifierOrEmail, password };
      const res = await api.post('/auth/login', payload);
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

  const registerCustomer = async ({ name, email, username, admissionNumber, phone, password, cafeId, cafeName }) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        username,
        admissionNumber,
        phone,
        password,
        cafeId,
        cafeName
      });
      if (res.success) {
        setUser(res.user);
        toast.success('Registration successful! Welcome to JEC Dining.');
        return res.user;
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const changeCustomerCafe = async ({ cafeId, cafeName, cafeSlug }) => {
    try {
      const res = await api.put('/auth/customer/cafe', { cafeId, cafeName, cafeSlug });
      if (res.success && res.user) {
        setUser(res.user);
        toast.success(res.message || 'Café updated successfully');
        return res.user;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change café');
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

  const loginSuperAdmin = async (identifier, password) => {
    try {
      const res = await api.post('/auth/super-admin/login', { identifier, password });
      if (res.success) {
        setUser(res.user);
        toast.success(res.message || 'Super Admin login successful');
        return res.user;
      }
    } catch (err) {
      toast.error(err.message || 'Super Admin authentication failed');
      throw err;
    }
  };

  const logout = async (redirectUrl = null) => {
    const wasSuperAdmin = user?.role === 'super_admin';
    const wasAdmin = user?.role === 'cafe_admin';
    const rawCafeSlug = user?.cafe?.slug || (window.location.pathname.replace(/^\//, '').split('/')[0]);
    const adminLoginSlug = (rawCafeSlug && rawCafeSlug.includes('byte')) ? 'jecbytes' : 'jeccafe';

    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignore
    } finally {
      setUser(null);
      toast.info('You have been logged out.');
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (wasSuperAdmin) {
        window.location.href = '/super-admin/login';
      } else if (wasAdmin) {
        window.location.href = `/${adminLoginSlug}/admin/login`;
      } else if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginCustomer,
      registerCustomer,
      changeCustomerCafe,
      loginAdmin,
      loginSuperAdmin,
      logout,
      refreshUser: fetchCurrentUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'cafe_admin',
      isSuperAdmin: user?.role === 'super_admin',
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
