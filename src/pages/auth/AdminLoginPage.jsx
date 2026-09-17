import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCafe } from '../../context/CafeContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ArrowRight, Coffee, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage = () => {
  const { cafeSlug: paramSlug } = useParams();
  const pathSlug = window.location.pathname.replace(/^\//, '').split('/')[0].toLowerCase();
  const cafeSlug = paramSlug || (pathSlug === 'jec-bytest' ? 'jec-bytest' : 'jeccafe');

  const { loginAdmin } = useAuth();
  const { selectCafeBySlug } = useCafe();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isJeccafe = cafeSlug === 'jeccafe';
  const cafeName = isJeccafe ? 'JECCAFE' : 'JEC BYTES';

  useEffect(() => {
    if (cafeSlug) {
      selectCafeBySlug(cafeSlug);
    }
  }, [cafeSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      await loginAdmin(email, password, cafeSlug);
      showSuccess(`Welcome! Authenticated as ${cafeName} Administrator`);
      navigate(`/${cafeSlug}/admin/dashboard`, { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid administrator credentials';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 80% 12%, #FFF9F0 0%, #FAF5ED 50%, #F4ECE0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem'
      }}
    >
      <div
        style={{
          maxWidth: '465px',
          width: '100%',
          position: 'relative',
          background: 'linear-gradient(175deg, #FFFDF9 0%, #FAF5ED 55%, #F6EDE2 100%)',
          borderRadius: '28px',
          boxShadow: '0 32px 75px -12px rgba(32, 17, 8, 0.38), 0 0 0 1px rgba(255,255,255,0.85) inset',
          border: '1.5px solid #EBE0D2',
          padding: '2.5rem 2.25rem 2rem',
          overflow: 'hidden'
        }}
      >
        {/* Top-Right Handwritten Accent Stamp */}
        <div
          style={{
            position: 'absolute',
            top: '26px',
            right: '24px',
            textAlign: 'right',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.24rem',
              color: '#9C5B32',
              fontWeight: 600,
              transform: 'rotate(-4deg)',
              lineHeight: 1.15
            }}
          >
            Admin Panel<br />
            Manager Desk
            <div style={{ width: '44px', height: '2px', background: '#9C5B32', margin: '3px 0 4px auto', borderRadius: '2px', opacity: 0.8 }} />
          </div>
          <div
            style={{
              fontSize: '0.56rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#8C674E',
              textTransform: 'uppercase',
              lineHeight: 1.35
            }}
          >
            {cafeName} PORTAL
          </div>
        </div>

        {/* Back link to Dining Home */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FDF1EB',
            border: '1.2px solid #F0DAC9',
            padding: '5px 14px',
            borderRadius: '24px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#8B4822',
            letterSpacing: '0.04em',
            marginBottom: '1.25rem',
            textDecoration: 'none'
          }}
        >
          <span>← BACK TO DINING HOME</span>
        </Link>

        {/* Café Identity Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: '#2E1C14',
              color: '#C86D44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
              flexShrink: 0
            }}
          >
            <Coffee size={26} />
          </div>

          <div>
            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#1A1816',
                margin: 0,
                lineHeight: 1.15
              }}
            >
              {cafeName} Admin
            </h1>
          </div>
        </div>

        <p style={{ color: '#6E6258', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.55 }}>
          Sign in to manage live kitchen orders, menu combos, stock levels, and revenue analytics.
        </p>

        {errorMsg && (
          <div
            style={{
              background: '#FDF2F2',
              border: '1.5px solid #F8D7DA',
              borderRadius: '14px',
              padding: '10px 14px',
              color: '#9C2525',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
              Admin Email Address
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#FFFFFF',
                border: '1.5px solid #E8DDD0',
                borderRadius: '16px',
                padding: '6px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#F9F2EA',
                  border: '1px solid #EADBCC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Mail size={18} color="#9C5B32" strokeWidth={2} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.96rem',
                  color: '#1A1816',
                  fontWeight: 500
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
              Security Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#FFFFFF',
                border: '1.5px solid #E8DDD0',
                borderRadius: '16px',
                padding: '6px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#F9F2EA',
                  border: '1px solid #EADBCC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Lock size={18} color="#9C5B32" strokeWidth={2} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.96rem',
                  color: '#1A1816',
                  fontWeight: 500
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8C7E74',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '14px',
              marginTop: '0.4rem',
              background: 'linear-gradient(135deg, #3A1F12 0%, #1A0F09 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 24px rgba(45, 20, 10, 0.32)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <span>{loading ? 'Authenticating...' : `Enter ${cafeName} Workspace`}</span>
            <ArrowRight size={18} strokeWidth={2.4} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
