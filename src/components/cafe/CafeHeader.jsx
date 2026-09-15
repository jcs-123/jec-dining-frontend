import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LogOut, Clock, ArrowLeftRight, ChevronDown, Coffee, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCafe } from '../../context/CafeContext';

export const CafeHeader = ({ cafe }) => {
  const { user, logout, isCustomer } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { cafes } = useCafe();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCafeDropdown, setShowCafeDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const otherCafe = cafes.find(c => c.slug !== cafe?.slug);

  const handleSwitchCafe = (targetSlug) => {
    setShowCafeDropdown(false);
    navigate(`/${targetSlug}`);
  };

  return (
    <header className="navbar">
      <div className="app-container">
        <div className="nav-inner">
          {/* Logo & Cafe Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to={`/${cafe?.slug || ''}`} className="brand-logo">
              {cafe?.slug === 'jeccafe' ? (
                <div style={{ background: '#2E1C14', color: '#C86D44', padding: '6px 8px', borderRadius: '8px' }}>
                  <Coffee size={22} />
                </div>
              ) : (
                <div style={{ background: '#0C383E', color: '#E86034', padding: '6px 8px', borderRadius: '8px' }}>
                  <Zap size={22} />
                </div>
              )}
              <span>{cafe?.name || 'JEC Dining'}</span>
            </Link>

            {/* Quick Switch Dropdown */}
            {otherCafe && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCafeDropdown(!showCafeDropdown)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px', fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: '20px' }}
                >
                  <ArrowLeftRight size={13} />
                  <span>Switch Café</span>
                  <ChevronDown size={13} />
                </button>

                {showCafeDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-light)',
                    minWidth: '220px',
                    zIndex: 100,
                    padding: '6px',
                    animation: 'slideUp 0.15s ease-out'
                  }}>
                    <div style={{ padding: '8px 12px', fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>
                      SWITCH LOCATION
                    </div>
                    <button
                      onClick={() => handleSwitchCafe(otherCafe.slug)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F4EFEB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {otherCafe.slug === 'jeccafe' ? <Coffee size={18} color="#C86D44" /> : <Zap size={18} color="#E86034" />}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{otherCafe.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C' }}>{otherCafe.openingHours}</div>
                      </div>
                    </button>
                    <div style={{ borderTop: '1px solid var(--divider)', margin: '4px 0' }} />
                    <Link
                      to="/"
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        color: '#78716C',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}
                      onClick={() => setShowCafeDropdown(false)}
                    >
                      View Both Cafés
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Status & Hours */}
            <div style={{ display: 'none', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }} className="hours-indicator">
              <Clock size={15} color="#78716C" />
              <span style={{ color: '#78716C' }}>{cafe?.openingHours}</span>
            </div>

            {/* My Orders link if authenticated */}
            {user && (
              <Link
                to="/my-orders"
                className="btn btn-ghost btn-sm"
                style={{
                  color: location.pathname === '/my-orders' ? 'var(--brand-accent)' : 'inherit',
                  fontWeight: 600
                }}
              >
                My Orders
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-outline"
              style={{
                position: 'relative',
                padding: '0.55rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                borderColor: itemCount > 0 ? 'var(--brand-accent)' : 'var(--border-light)'
              }}
              aria-label="View Cart"
            >
              <ShoppingBag size={19} color={itemCount > 0 ? 'var(--brand-accent)' : 'currentColor'} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-7px',
                  right: '-7px',
                  background: 'var(--brand-accent)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px', borderRadius: 'var(--radius-md)' }}
                >
                  <UserIcon size={16} />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {showUserDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-light)',
                    minWidth: '190px',
                    zIndex: 100,
                    padding: '6px',
                    animation: 'slideUp 0.15s ease-out'
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--divider)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#78716C' }}>{user.email}</div>
                    </div>
                    <Link
                      to="/my-orders"
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        color: '#1C1917',
                        textDecoration: 'none'
                      }}
                      onClick={() => setShowUserDropdown(false)}
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'transparent',
                        color: '#DC2626',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to={`/auth?redirect=/${cafe?.slug || ''}`} className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
