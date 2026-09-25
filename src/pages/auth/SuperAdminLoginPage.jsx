import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Building2, Store } from 'lucide-react';

export const SuperAdminLoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginSuperAdmin } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter your administrator username or email and password');
      return;
    }

    try {
      setLoading(true);
      await loginSuperAdmin(identifier.trim(), password.trim());
      showSuccess('Master Super Administrator authenticated successfully');
      navigate('/super-admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid super administrator credentials';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-login-wrapper">
      <div className="super-admin-login-glow" />
      <div className="super-admin-login-box">
        {/* Top Header Stamp */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#94A3B8',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            ← BACK TO CAMPUS
          </Link>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#34D399',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            SUPER ADMIN
          </div>
        </div>

        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 12px 28px rgba(16, 185, 129, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <ShieldCheck size={36} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#F8FAFC',
              margin: '0 0 6px',
              letterSpacing: '-0.02em'
            }}
          >
            Master Super Admin
          </h1>
          <p
            style={{
              fontSize: '0.86rem',
              color: '#94A3B8',
              margin: 0,
              lineHeight: 1.4
            }}
          >
            Unified platform governance for JECCAFE & JEC BYTES
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '11px 14px',
              marginBottom: '1.25rem',
              color: '#FCA5A5',
              fontSize: '0.82rem',
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Identifier Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '6px',
                letterSpacing: '0.02em'
              }}
            >
              Super Admin Username / Email
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                  pointerEvents: 'none'
                }}
              >
                <Mail size={18} />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="superadmin@jecc.ac.in"
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1.5px solid #1E293B',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#F8FAFC',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10B981';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1E293B';
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '6px',
                letterSpacing: '0.02em'
              }}
            >
              Super Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                  pointerEvents: 'none'
                }}
              >
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter super admin password"
                required
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1.5px solid #1E293B',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#F8FAFC',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10B981';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1E293B';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.75rem',
              padding: '13px 20px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              fontSize: '0.94rem',
              fontWeight: 700,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.18s ease'
            }}
          >
            <span>{loading ? 'Authenticating Authority...' : 'Access Super Admin Console'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Venue Direct Links */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
            Venue Admin Logins:
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/jeccafe/admin/login"
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#FB923C',
                textDecoration: 'none'
              }}
            >
              JECCAFE
            </Link>
            <span style={{ color: '#334155' }}>•</span>
            <Link
              to="/jecbytes/admin/login"
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#38BDF8',
                textDecoration: 'none'
              }}
            >
              JEC BYTES
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
