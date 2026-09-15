import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomerAuthPage = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const navigate = useNavigate();
  const { loginCustomer, registerCustomer } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === 'login') {
        await loginCustomer(email, password);
      } else {
        await registerCustomer({ name, email, phone, password });
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '440px', padding: '3rem 1rem' }}>
      <div className="card" style={{ padding: '2.25rem', borderRadius: '24px', boxShadow: 'var(--shadow-xl)' }}>
        {/* Toggle Mode Pills */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-subtle)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '1.75rem',
          border: '1px solid var(--border-light)'
        }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'login' ? '#FFFFFF' : 'transparent',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: mode === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'register' ? '#FFFFFF' : 'transparent',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: mode === 'register' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
          {mode === 'login' ? 'Welcome Back' : 'Join JEC Dining'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {mode === 'login'
            ? 'Sign in to checkout combos and view order status.'
            : 'Register your student or faculty account to order.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="customer@jec.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

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
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--divider)',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ marginBottom: '8px' }}>Demo Customer Account:</div>
          <button
            type="button"
            onClick={async () => {
              setEmail('customer@jec.ac.in');
              setPassword('Customer@2026');
              try {
                setLoading(true);
                await loginCustomer('customer@jec.ac.in', 'Customer@2026');
                navigate(redirectPath, { replace: true });
              } catch (err) {
                console.error('Auth error:', err);
              } finally {
                setLoading(false);
              }
            }}
            className="btn btn-outline btn-full btn-sm"
            style={{ borderRadius: '10px', fontWeight: 700 }}
          >
            ⚡ 1-Click Demo Sign In (customer@jec.ac.in)
          </button>
        </div>
      </div>
    </div>
  );
};
