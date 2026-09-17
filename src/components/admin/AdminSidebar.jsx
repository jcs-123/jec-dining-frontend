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
      width: '264px',
      background: 'linear-gradient(180deg, #1A0E08 0%, #120904 100%)',
      color: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1.5px solid #2D1A10',
      boxShadow: '4px 0 24px rgba(20, 10, 5, 0.25)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.4rem 1.25rem',
        borderBottom: '1px solid rgba(234, 219, 204, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          background: isJeccafe
            ? 'linear-gradient(135deg, #7E4323 0%, #D66C3E 100%)'
            : 'linear-gradient(135deg, #0A3D40 0%, #157E82 100%)',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(214, 108, 62, 0.3)'
        }}>
          {isJeccafe ? <Coffee size={21} strokeWidth={2.3} /> : <Zap size={21} strokeWidth={2.3} />}
        </div>
        <div>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 800,
            fontSize: '1.15rem',
            letterSpacing: '-0.02em',
            color: '#FAF6F0'
          }}>
            {cafeName}
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: '#D66C3E',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginTop: '1px'
          }}>
            Admin Portal
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1.1rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
                borderRadius: '12px',
                color: isActive ? '#FFFFFF' : '#C2B2A4',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(214, 108, 62, 0.28) 0%, rgba(214, 108, 62, 0.08) 100%)'
                  : 'transparent',
                borderLeft: isActive ? '3.5px solid #D66C3E' : '3.5px solid transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                textDecoration: 'none',
                transition: 'all 0.18s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={13} style={{ opacity: 0.4 }} />
            </NavLink>
          );
        })}

        {/* Live Customer Menu Link */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(234, 219, 204, 0.08)' }}>
          <a
            href={`/${cafeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#D66C3E',
              background: 'rgba(214, 108, 62, 0.12)',
              textDecoration: 'none',
              transition: 'background 0.15s ease'
            }}
          >
            <span>Live Customer Menu ↗</span>
          </a>
        </div>
      </nav>

      {/* User Info & Logout */}
      <div style={{
        padding: '1.1rem 1.25rem',
        borderTop: '1px solid rgba(234, 219, 204, 0.1)',
        background: 'rgba(10, 5, 2, 0.4)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FAF6F0' }}>
            {user?.name || 'Administrator'}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#9E8E82', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#F87171',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
