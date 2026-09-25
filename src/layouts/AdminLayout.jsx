import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useCafe } from '../context/CafeContext';
import {
  Menu,
  Coffee,
  Zap
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const { selectCafeBySlug } = useCafe();
  const { cafeSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const rawSlug = (cafeSlug || '').toLowerCase();
  const normalizedSlug = rawSlug.includes('byte') ? 'jecbytes' : 'jeccafe';
  const isJeccafe = normalizedSlug === 'jeccafe';
  const cafeName = user?.cafe?.name || (isJeccafe ? 'JECCAFE' : 'JEC BYTES');

  useEffect(() => {
    if (normalizedSlug) {
      selectCafeBySlug(normalizedSlug);
    }
  }, [normalizedSlug]);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        navigate(`/${normalizedSlug || 'jeccafe'}/admin/login`, { replace: true });
      } else if (user.cafe) {
        const userSlug = (user.cafe.slug || '').includes('byte') ? 'jecbytes' : user.cafe.slug;
        if (userSlug !== normalizedSlug) {
          navigate(`/${userSlug}/admin/dashboard`, { replace: true });
        }
      }
    }
  }, [user, loading, isAdmin, cafeSlug, normalizedSlug, navigate]);

  // Close drawer when location changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  if (loading && !user) {
    return null;
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="admin-shell">
      {/* 1. Desktop & Tablet Sticky Sidebar */}
      <AdminSidebar />

      {/* 2. Mobile Slide-Over Drawer & Backdrop Overlay */}
      <div
        className={`admin-drawer-backdrop ${isMobileDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsMobileDrawerOpen(false)}
        aria-hidden="true"
      />
      <div className={`admin-drawer-panel ${isMobileDrawerOpen ? 'open' : ''}`}>
        <AdminSidebar isMobile={true} onClose={() => setIsMobileDrawerOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="admin-main-viewport">
        {/* 3. Mobile Top App Bar (< 768px) */}
        <header className="admin-mobile-topbar">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FAF6F0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px'
            }}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Café Brand Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: isJeccafe
                ? 'linear-gradient(135deg, #7E4323 0%, #D66C3E 100%)'
                : 'linear-gradient(135deg, #0A3D40 0%, #157E82 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              {isJeccafe ? <Coffee size={16} /> : <Zap size={16} />}
            </div>
            <div>
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#FAF6F0',
                lineHeight: 1.1
              }}>
                {cafeName}
              </div>
              <div style={{
                fontSize: '0.62rem',
                color: '#D66C3E',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                Admin Portal
              </div>
            </div>
          </div>
        </header>

        {/* Child Pages (AdminDashboardPage, etc.) */}
        <Outlet />
      </div>
    </div>
  );
};
