import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Coffee,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cafeSlug = user?.cafe?.slug || 'jeccafe';
  const cafeName = user?.cafe?.name || 'Café Admin';
  const isJeccafe = cafeSlug === 'jeccafe';

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: `/${cafeSlug}/admin/dashboard` },
    { label: 'Live Orders', icon: ShoppingBag, path: `/${cafeSlug}/admin/orders` },
    { label: 'Combo Catalog', icon: UtensilsCrossed, path: `/${cafeSlug}/admin/combos` },
    { label: 'Categories', icon: Tags, path: `/${cafeSlug}/admin/categories` },
    { label: 'Sales Reports', icon: BarChart3, path: `/${cafeSlug}/admin/reports` },
    { label: 'Café Settings', icon: Settings, path: `/${cafeSlug}/admin/settings` }
  ];

  const handleLogout = async () => {
    await logout();
    navigate(`/${cafeSlug}/admin/login`);
  };

  return (
    <aside style={{
      width: '260px',
      background: 'var(--brand-primary)',
      color: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          background: 'var(--brand-accent)',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          {isJeccafe ? <Coffee size={22} /> : <Zap size={22} />}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>{cafeName}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Admin Portal
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                background: isActive ? 'var(--brand-accent)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div style={{
        padding: '1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.15)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name || 'Administrator'}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm btn-full"
          style={{
            color: '#F87171',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
