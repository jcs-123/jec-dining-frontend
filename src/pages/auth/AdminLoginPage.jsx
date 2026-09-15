import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCafe } from '../../context/CafeContext';
import { Lock, Mail, ShieldAlert, ArrowRight, Coffee, Zap } from 'lucide-react';

export const AdminLoginPage = () => {
  const { cafeSlug } = useParams();
  const { loginAdmin } = useAuth();
  const { selectCafeBySlug } = useCafe();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isJeccafe = cafeSlug === 'jeccafe';
  const cafeName = isJeccafe ? 'JECCAFE' : 'JEC BYTEST';

  useEffect(() => {
    if (cafeSlug) {
      selectCafeBySlug(cafeSlug);
      // Pre-populate default admin email for quick testing
      if (isJeccafe) {
        setEmail('admin@jeccafe.com');
      } else {
        setEmail('admin@jecbytest.com');
      }
    }
  }, [cafeSlug, isJeccafe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await loginAdmin(email, password, cafeSlug);
      navigate(`/${cafeSlug}/admin/dashboard`, { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isJeccafe ? '#2E1C14' : '#0C383E',
      padding: '2rem 1rem'
    }}>
      <div className="card" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        background: '#FFFFFF'
      }}>
        {/* Café Identity Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: isJeccafe ? '#2E1C14' : '#0C383E',
            color: isJeccafe ? '#C86D44' : '#E86034',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
          }}>
            {isJeccafe ? <Coffee size={28} /> : <Zap size={28} />}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {cafeName}
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
            Administrative Portal
          </div>
        </div>

        {/* Security Notice */}
        <div style={{
          background: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-light)',
          padding: '10px 14px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <ShieldAlert size={16} color="var(--brand-accent)" />
          <span>Server-enforced café tenant isolation active</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Admin Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', gap: '8px' }}
          >
            <span>{loading ? 'Authenticating...' : `Enter ${cafeName} Admin`}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--divider)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Demo Credentials:</div>
          <div>Email: <code>{isJeccafe ? 'admin@jeccafe.com' : 'admin@jecbytest.com'}</code></div>
          <div>Password: <code>{isJeccafe ? 'JeccafeAdmin@2026' : 'BytestAdmin@2026'}</code></div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link
              to={isJeccafe ? '/jec-bytest/admin/login' : '/jeccafe/admin/login'}
              style={{ color: 'var(--brand-accent)', textDecoration: 'none', fontWeight: 600 }}
            >
              Switch to {isJeccafe ? 'JEC BYTEST' : 'JECCAFE'} Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
