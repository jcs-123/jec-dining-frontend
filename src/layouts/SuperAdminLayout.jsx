import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Users,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SuperAdminLayout = () => {
  const { user, loading, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isSuperAdmin)) {
      navigate('/super-admin/login', { replace: true });
    }
  }, [user, loading, isSuperAdmin, navigate]);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading && !user) {
    return null;
  }

  if (!user || !isSuperAdmin) return null;

  const navItems = [
    { label: 'Overview Dashboard', icon: LayoutDashboard, path: '/super-admin/dashboard' },
    { label: 'All Campus Orders', icon: ShoppingBag, path: '/super-admin/orders' },
    { label: '2-Café Sales Reports', icon: BarChart3, path: '/super-admin/reports' },
    { label: 'Users Management', icon: Users, path: '/super-admin/users' }
  ];

  return (
    <div className="super-admin-layout">
      {/* Mobile Top Header */}
      <header className="super-admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={18} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>
              JEC DINING
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.08em' }}>
              SUPER ADMIN
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="super-admin-mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Backdrop for mobile drawer */}
      <div
        className={`super-admin-backdrop ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Super Admin Executive Sidebar */}
      <aside className={`super-admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem 1.35rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(16, 185, 129, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <ShieldCheck size={24} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{
              fontSize: '0.98rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#F8FAFC',
              lineHeight: 1.2
            }}>
              JEC DINING
            </div>
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#10B981',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '3px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
              Super Admin Console
            </div>
          </div>
        </div>

        {/* Cafés Quick Switch / Scope */}
        <div style={{ padding: '1rem 1.25rem 0.6rem' }}>
          <div style={{
            fontSize: '0.64rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#64748B',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Managed Campus Venues
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              flex: 1,
              background: 'rgba(234, 88, 12, 0.1)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EA580C' }}></span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FB923C' }}>JECCAFE</span>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.25)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0EA5E9' }}></span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8' }}>JEC BYTES</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            fontSize: '0.64rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#64748B',
            textTransform: 'uppercase',
            padding: '4px 8px 8px'
          }}>
            Master Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.08) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.18s ease'
                })}
              >
                <Icon size={18} strokeWidth={2} />
                <span style={{ flex: 1 }}>{item.label}</span>
                <ChevronRight size={14} opacity={0.4} />
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div style={{
          padding: '1.1rem 1.15rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              border: '1px solid #475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#E2E8F0'
            }}>
              SA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#F8FAFC',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.name || 'Super Admin'}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: '#64748B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => logout('/super-admin/login')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#F87171',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
            }}
          >
            <LogOut size={15} />
            Sign Out of Super Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="super-admin-main">
        <div className="super-admin-content-wrap">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
