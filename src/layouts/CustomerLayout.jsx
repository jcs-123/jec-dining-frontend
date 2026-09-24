import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { CafeHeader } from '../components/cafe/CafeHeader';
import { CartDrawer } from '../components/cart/CartDrawer';
import { StickyCartBar } from '../components/cart/StickyCartBar';
import { CafeSwitchAlertModal } from '../components/ui/CafeSwitchAlertModal';
import { useCafe } from '../context/CafeContext';
import { useAuth } from '../context/AuthContext';

export const CustomerLayout = () => {
  const { currentCafe, selectCafeBySlug, cafes } = useCafe();
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const slug = location.pathname.replace(/^\//, '').split('/')[0].toLowerCase();
    if (slug === 'jeccafe' || slug === 'jecbytes' || slug === 'jec-bytes' || slug === 'jec-bytest') {
      selectCafeBySlug(slug, cafes);
    }
  }, [location.pathname, cafes]);

  if (loading && !isAuthenticated) {
    return null;
  }

  if (!isAuthenticated && !loading) {
    // After login only: redirect unauthenticated users to login
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <div className="page-wrapper">
      <CafeHeader cafe={currentCafe} />
      <main className="main-content">
        <Outlet key={location.pathname} />
      </main>
      <CartDrawer />
      <StickyCartBar />
      <CafeSwitchAlertModal />
    </div>
  );
};
