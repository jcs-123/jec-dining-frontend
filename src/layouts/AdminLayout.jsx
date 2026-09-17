import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useCafe } from '../context/CafeContext';

export const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const { selectCafeBySlug } = useCafe();
  const { cafeSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (cafeSlug) {
      selectCafeBySlug(cafeSlug);
    }
  }, [cafeSlug]);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        navigate(`/${cafeSlug || 'jeccafe'}/admin/login`, { replace: true });
      } else if (user.cafe && user.cafe.slug !== cafeSlug) {
        // Enforce frontend route isolation matching user's assigned café
        navigate(`/${user.cafe.slug}/admin/dashboard`, { replace: true });
      }
    }
  }, [user, loading, isAdmin, cafeSlug, navigate]);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Verifying Administrator Credentials...</div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF6EE' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
};
