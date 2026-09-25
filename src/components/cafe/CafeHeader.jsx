import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Clock,
  ArrowLeftRight,
  ChevronDown,
  Coffee,
  Zap,
  Menu,
  X,
  MapPin,
  UtensilsCrossed,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCafe } from '../../context/CafeContext';
import { useToast } from '../../context/ToastContext';

export const CafeHeader = ({ cafe }) => {
  const { user, logout, isCustomer } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { cafes, currentCafe, selectCafeBySlug } = useCafe();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll listener for smooth header animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Reliably identify active café based on route pathname or prop
  const pathSlug = location.pathname.replace(/^\//, '').split('/')[0].toLowerCase();
  const activeSlug = (pathSlug === 'jeccafe' || pathSlug.includes('byte'))
    ? (pathSlug.includes('byte') ? 'jecbytes' : 'jeccafe')
    : (cafe?.slug || currentCafe?.slug || 'jeccafe');

  const isJeccafe = activeSlug === 'jeccafe';

  const activeCafe = cafes.find(c => c.slug === activeSlug || (activeSlug.includes('byte') && c.slug.includes('byte'))) || cafe || currentCafe || {
    slug: activeSlug,
    name: isJeccafe ? 'JECCAFE' : 'JEC BYTES',
    tagline: isJeccafe ? 'Artisanal Coffee & Bistro Combos' : 'Fast Bites, Bowls & Modern Sips',
    openingHours: isJeccafe ? '07:00 AM - 07:00 PM' : '08:00 AM - 11:00 PM',
    address: isJeccafe ? 'East Quad, Central Plaza, JEC Campus' : 'Tech Innovation Hub, Food Street, JEC Campus'
  };

  const otherSlug = isJeccafe ? 'jecbytes' : 'jeccafe';
  const otherCafe = cafes.find(c => c.slug === otherSlug || (otherSlug.includes('byte') && c.slug.includes('byte'))) || {
    slug: otherSlug,
    name: isJeccafe ? 'JEC BYTES' : 'JECCAFE',
    tagline: isJeccafe ? 'Fast Bites, Bowls & Modern Sips' : 'Artisanal Coffee & Bistro Combos',
    openingHours: isJeccafe ? '08:00 AM - 11:00 PM' : '07:00 AM - 07:00 PM'
  };

  const handleSwitchCafe = (targetSlug) => {
    setIsMenuOpen(false);
    selectCafeBySlug(targetSlug, cafes);
    navigate(`/${targetSlug}`);
    toast.success(`Switched to ${targetSlug === 'jeccafe' ? 'JECCAFE' : 'JEC BYTES'}`);
  };

  const accentColor = '#D66C3E'; // Warm copper accent
  const pillBg = '#FFFFFF';
  const pillBorder = '#EADBCC';

  return (
    <>
      <header
        className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          height: '72px',
          background: 'rgba(251, 248, 242, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1.5px solid #EADBCC',
          boxShadow: isScrolled ? '0 4px 16px rgba(50, 30, 15, 0.06)' : '0 2px 8px rgba(50, 30, 15, 0.03)',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div className="cafe-container" style={{ width: '100%' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%'
          }}>
            {/* Left: Brand Logo & Dual Café Segmented Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'nowrap' }}>
              <Link
                to={`/${activeSlug}`}
                className="brand-logo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  color: '#1E140E',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  background: isJeccafe
                    ? 'linear-gradient(135deg, #361D11 0%, #7E4323 100%)'
                    : 'linear-gradient(135deg, #0A3D40 0%, #157E82 100%)',
                  color: '#FFFFFF',
                  padding: '7px 8px',
                  borderRadius: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(50, 30, 15, 0.15)'
                }}>
                  {isJeccafe ? <Coffee size={19} strokeWidth={2.4} /> : <Zap size={19} strokeWidth={2.4} />}
                </div>
                <div>
                  <span style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#1E140E',
                    lineHeight: 1.1,
                    display: 'block'
                  }}>
                    {isJeccafe ? 'JECCAFE' : 'JEC BYTES'}
                  </span>
                  <span className="brand-subtitle" style={{
                    fontSize: '0.68rem',
                    color: '#7A6E63',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    display: 'block'
                  }}>
                    Two Cafés. One Campus.
                  </span>
                </div>
              </Link>

              {/* Segmented Campus Switcher Toggle (Desktop: both pills, Mobile: only next café) */}
              <div className="cafe-header-switcher" style={{ marginLeft: '4px' }}>
                <button
                  type="button"
                  onClick={() => !isJeccafe && handleSwitchCafe('jeccafe')}
                  className={`cafe-switch-pill ${isJeccafe ? 'active jeccafe' : ''}`}
                  title={isJeccafe ? 'Currently viewing JECCAFE' : 'Switch to JECCAFE (Artisanal Coffee & Bistro Combos)'}
                >
                  <Coffee size={13} strokeWidth={2.4} />
                  <span>JECCAFE</span>
                  <span className="cafe-switch-pill-action" aria-hidden="true">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => isJeccafe && handleSwitchCafe('jecbytes')}
                  className={`cafe-switch-pill ${!isJeccafe ? 'active jecbytes' : ''}`}
                  title={!isJeccafe ? 'Currently viewing JEC BYTES' : 'Switch to JEC BYTES (Fast Bites, Bowls & Modern Sips)'}
                >
                  <Zap size={13} strokeWidth={2.4} />
                  <span>JEC BYTES</span>
                  <span className="cafe-switch-pill-action" aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            {/* Right: Desktop Action Controls */}
            <div className="header-desktop-nav">
              <Link
                to="/"
                style={{
                  color: location.pathname === '/' ? '#D66C3E' : '#4A423B',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'color 0.15s'
                }}
              >
                All Cafés
              </Link>

              <button
                type="button"
                onClick={() => {
                  const targetCafe = activeSlug || 'jeccafe';
                  if (location.pathname === `/${targetCafe}`) {
                    const el = document.getElementById('combos-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else window.scrollTo({ top: 380, behavior: 'smooth' });
                  } else {
                    navigate(`/${targetCafe}`);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: (location.pathname.includes('jeccafe') || location.pathname.includes('byte')) ? '#D66C3E' : '#4A423B',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'color 0.15s'
                }}
              >
                Browse Combos
              </button>

              <Link
                to="/my-orders"
                style={{
                  color: location.pathname === '/my-orders' ? '#D66C3E' : '#4A423B',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'color 0.15s'
                }}
              >
                My Orders
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                style={{
                  position: 'relative',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${pillBorder}`,
                  background: pillBg,
                  color: '#1E140E',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(50, 30, 15, 0.04)',
                  transition: 'all 0.15s ease'
                }}
                aria-label="View Cart"
              >
                <ShoppingBag size={18} color="#1E140E" />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: accentColor,
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    width: '19px',
                    height: '19px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(214, 108, 62, 0.35)'
                  }}>
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Profile / Auth */}
              {user && isCustomer ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '0.42rem 0.95rem',
                      borderRadius: '20px',
                      border: `1.5px solid ${pillBorder}`,
                      background: pillBg,
                      color: '#1E140E',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      boxShadow: '0 2px 6px rgba(50, 30, 15, 0.04)'
                    }}
                  >
                    <UserIcon size={15} color={accentColor} />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown size={13} style={{ opacity: 0.6 }} />
                  </button>

                  {showUserDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '10px',
                      background: '#FFFFFF',
                      borderRadius: '14px',
                      boxShadow: '0 14px 36px rgba(50, 30, 15, 0.12)',
                      border: `1.5px solid ${pillBorder}`,
                      minWidth: '220px',
                      zIndex: 100,
                      padding: '8px',
                      animation: 'slideUp 0.15s ease-out'
                    }}>
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid #EADBCC' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E140E' }}>{user.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#7A6E63' }}>{user.email}</div>
                      </div>
                      <Link
                        to="/my-orders"
                        style={{
                          display: 'block',
                          padding: '10px 12px',
                          fontSize: '0.85rem',
                          color: '#3A2E26',
                          fontWeight: 600,
                          textDecoration: 'none',
                          borderRadius: '8px'
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
                          padding: '10px 12px',
                          border: 'none',
                          background: 'transparent',
                          color: '#DC2626',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderRadius: '8px'
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={`/auth?redirect=/${activeSlug}`}
                  style={{
                    background: '#1A1816',
                    color: '#FFFFFF',
                    padding: '0.45rem 1.1rem',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    textDecoration: 'none',
                    boxShadow: '0 3px 10px rgba(26, 24, 22, 0.2)'
                  }}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Right: Mobile-Only Header Controls (Cart + Toggler) */}
            <div className="header-mobile-nav">
              {/* Shopping Bag with Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                style={{
                  position: 'relative',
                  width: '40px',
                  height: '40px',
                  borderRadius: '11px',
                  border: `1.5px solid ${pillBorder}`,
                  background: pillBg,
                  color: '#1E140E',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(50, 30, 15, 0.04)'
                }}
                aria-label="View Cart"
              >
                <ShoppingBag size={18} color="#1E140E" />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: accentColor,
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(214, 108, 62, 0.4)'
                  }}>
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggler Button */}
              <button
                className="header-toggler-btn"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open Navigation Menu"
                title="Open Campus Navigation"
                style={{
                  background: '#F3ECE2',
                  border: '1px solid #E5DDD0',
                  borderRadius: '12px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#1A1816',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Header Spacer */}
      <div
        aria-hidden="true"
        style={{
          height: isScrolled ? '64px' : '72px',
          width: '100%',
          flexShrink: 0,
          transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* ============================================================
          MOBILE SLIDE-OUT NAVIGATION DRAWER (Inside Toggler)
          Ultra-Premium, Responsive Editorial Layout
          ============================================================ */}
      {isMenuOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={() => setIsMenuOpen(false)} />
          <div className="mobile-menu-drawer" style={{
            background: '#FAF6F0',
            borderLeft: '1.5px solid #EADBCC',
            boxShadow: '-12px 0 45px rgba(50, 30, 15, 0.18)',
            color: '#1E140E',
            maxWidth: '350px',
            width: '88vw',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* 1. Drawer Frosted Header */}
            <div style={{
              padding: '1.1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1.5px solid #EADBCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: isJeccafe
                    ? 'linear-gradient(135deg, #361D11 0%, #7E4323 100%)'
                    : 'linear-gradient(135deg, #0A3D40 0%, #157E82 100%)',
                  color: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(50, 30, 15, 0.15)',
                  flexShrink: 0
                }}>
                  {isJeccafe ? <Coffee size={18} strokeWidth={2.4} /> : <Zap size={18} strokeWidth={2.4} />}
                </div>
                <div>
                  <h4 style={{
                    margin: 0,
                    fontSize: '1.18rem',
                    fontWeight: 800,
                    color: '#1E140E',
                    fontFamily: "'Fraunces', Georgia, serif",
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em'
                  }}>
                    {activeCafe?.name}
                  </h4>
                  <div style={{ fontSize: '0.72rem', color: '#7A6E63', marginTop: '2px', fontWeight: 600 }}>
                    Two Cafés. One Campus.
                  </div>
                </div>
              </div>

              {/* Close Circular Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1.5px solid #EADBCC',
                  background: '#FFFFFF',
                  color: '#1E140E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(50, 30, 15, 0.05)',
                  transition: 'all 0.15s ease'
                }}
                aria-label="Close Menu"
              >
                <X size={17} />
              </button>
            </div>

            {/* 2. Scrollable Content Container (Natural cohesive flow, NO giant empty gap) */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Active Café Showcase Card */}
              <div style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF9 100%)',
                border: '1.5px solid #EADBCC',
                borderRadius: '16px',
                padding: '14px',
                boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#15803D',
                    background: '#DCFCE7',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    border: '1px solid #86EFAC'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
                    Active Café
                  </div>

                  <span style={{ fontSize: '0.72rem', color: '#7A6E63', fontWeight: 600 }}>
                    {activeCafe.openingHours || '07:00 AM - 07:00 PM'}
                  </span>
                </div>

                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#1E140E',
                  fontFamily: "'Fraunces', Georgia, serif",
                  lineHeight: 1.2
                }}>
                  {activeCafe.name}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#685F56', marginTop: '3px', lineHeight: 1.35 }}>
                  {activeCafe.tagline}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid #F0E6DA',
                  fontSize: '0.72rem',
                  color: '#7A6E63'
                }}>
                  <MapPin size={12} color="#D66C3E" style={{ flexShrink: 0 }} />
                  <span style={{ truncate: 'true' }}>{activeCafe.address || 'Central Plaza, JEC Campus'}</span>
                </div>
              </div>

              {/* Switch Campus Café Card */}
              <div style={{
                background: '#FFFFFF',
                border: '1.5px solid #EADBCC',
                borderRadius: '16px',
                padding: '12px',
                boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
              }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#8C7E74',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <ArrowLeftRight size={11} color="#D66C3E" />
                  <span>Switch Campus Location</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* JECCAFE Button */}
                  <button
                    onClick={() => {
                      if (!isJeccafe) handleSwitchCafe('jeccafe');
                      else setIsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: isJeccafe ? '1.5px solid #844825' : '1px solid #EADBCC',
                      background: isJeccafe ? 'linear-gradient(135deg, #361D11 0%, #6E3B1E 100%)' : '#FFFFFF',
                      color: isJeccafe ? '#FFFFFF' : '#1E140E',
                      cursor: 'pointer',
                      boxShadow: isJeccafe ? '0 3px 10px rgba(54, 29, 17, 0.25)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isJeccafe ? 'rgba(255,255,255,0.2)' : '#FAF5EE',
                        color: isJeccafe ? '#FFFFFF' : '#C25E30',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Coffee size={15} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.1 }}>
                          JECCAFE {isJeccafe && '✓ Active'}
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: isJeccafe ? 0.85 : 0.65, marginTop: '2px' }}>
                          Artisanal Coffee & Bistro Combos
                        </div>
                      </div>
                    </div>
                    {!isJeccafe && <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#C25E30' }}>Switch →</span>}
                  </button>

                  {/* JEC BYTES Button */}
                  <button
                    onClick={() => {
                      if (isJeccafe) handleSwitchCafe('jecbytes');
                      else setIsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: !isJeccafe ? '1.5px solid #157E82' : '1px solid #EADBCC',
                      background: !isJeccafe ? 'linear-gradient(135deg, #0A3D40 0%, #157E82 100%)' : '#FFFFFF',
                      color: !isJeccafe ? '#FFFFFF' : '#1E140E',
                      cursor: 'pointer',
                      boxShadow: !isJeccafe ? '0 3px 10px rgba(10, 61, 64, 0.25)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: !isJeccafe ? 'rgba(255,255,255,0.2)' : '#EFF6FF',
                        color: !isJeccafe ? '#FFFFFF' : '#0A3D40',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Zap size={15} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.1 }}>
                          JEC BYTES {!isJeccafe && '✓ Active'}
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: !isJeccafe ? 0.85 : 0.65, marginTop: '2px' }}>
                          Fast Bites, Bowls & Modern Sips
                        </div>
                      </div>
                    </div>
                    {isJeccafe && <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0A3D40' }}>Switch →</span>}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '7px',
                    borderRadius: '8px',
                    border: '1px solid #EADBCC',
                    background: '#FAF6F0',
                    color: '#4A423B',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <Layers size={12} color="#D66C3E" />
                  <span>Campus Dining Hub (Both Cafés)</span>
                </button>
              </div>

              {/* Navigation Menu Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    const targetCafe = activeSlug || 'jeccafe';
                    if (location.pathname === `/${targetCafe}`) {
                      const el = document.getElementById('combos-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else window.scrollTo({ top: 380, behavior: 'smooth' });
                    } else {
                      navigate(`/${targetCafe}`);
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #EADBCC',
                    background: '#FFFFFF',
                    color: '#1E140E',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(50, 30, 15, 0.02)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: '#FAF6F0',
                      border: '1px solid #EADBCC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D66C3E'
                    }}>
                      <UtensilsCrossed size={14} />
                    </div>
                    <span>Browse Combo Menu</span>
                  </div>
                  <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#A89F91' }} />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/my-orders');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #EADBCC',
                    background: '#FFFFFF',
                    color: '#1E140E',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(50, 30, 15, 0.02)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: '#FAF6F0',
                      border: '1px solid #EADBCC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D66C3E'
                    }}>
                      <ShoppingBag size={14} />
                    </div>
                    <span>My Orders & Tokens</span>
                  </div>
                  <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#A89F91' }} />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #EADBCC',
                    background: '#FFFFFF',
                    color: '#1E140E',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(50, 30, 15, 0.02)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: '#FAF6F0',
                      border: '1px solid #EADBCC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D66C3E'
                    }}>
                      <ShoppingBag size={14} />
                    </div>
                    <span>Current Order Cart</span>
                  </div>
                  {itemCount > 0 ? (
                    <span style={{
                      background: '#D66C3E',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '20px'
                    }}>
                      {itemCount} items
                    </span>
                  ) : (
                    <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#A89F91' }} />
                  )}
                </button>
              </div>

              {/* Customer Account Box */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px',
                border: '1.5px solid #EADBCC',
                boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
              }}>
                {user && isCustomer ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(214, 108, 62, 0.12)',
                        border: '1.5px solid #D66C3E',
                        color: '#D66C3E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.94rem',
                          fontWeight: 800,
                          color: '#1E140E',
                          fontFamily: "'Fraunces', Georgia, serif",
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {user.name}
                        </div>
                        <div style={{
                          fontSize: '0.74rem',
                          color: '#7A6E63',
                          marginTop: '1px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {user.admissionNumber ? `Adm: ${user.admissionNumber}` : user.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px',
                        borderRadius: '10px',
                        border: '1.5px solid #EADBCC',
                        background: '#FAF6F0',
                        color: '#DC2626',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/auth?redirect=/${activeSlug}`);
                    }}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#1A1816',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(26, 24, 22, 0.25)'
                    }}
                  >
                    <UserIcon size={16} />
                    <span>Sign In / Student Register</span>
                  </button>
                )}
              </div>

              {/* Campus Micro-Footer */}
              <div style={{
                textAlign: 'center',
                padding: '6px 0 2px',
                fontSize: '0.72rem',
                color: '#8C7E74',
                fontWeight: 600
              }}>
                JEC Campus Dining • Smart Express Queue
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
