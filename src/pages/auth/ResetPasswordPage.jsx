import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const toast = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Invalid or missing password reset token. Please request a new link.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword: password
      });

      if (res.success) {
        setSuccess(true);
        toast.success('Password reset successfully! You can now sign in.');
      }
    } catch (err) {
      const msg = err.message || 'Failed to reset password. The link may have expired.';
      setErrorMsg(msg);
      toast.error(msg);
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
            Good Food<br />
            Brighter Days
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
            JEC DINING
          </div>
        </div>

        {/* Back Link */}
        <Link
          to="/auth"
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
          <span>← BACK TO SIGN IN</span>
        </Link>

        {success ? (
          <div>
            <div
              style={{
                background: '#F2FAF3',
                border: '1.5px solid #C5E6CE',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#E2F4E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: '#1B6A35'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1B6A35', margin: '0 0 6px' }}>
                Password Reset Complete!
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#2C5537', margin: 0, lineHeight: 1.55 }}>
                Your account password has been securely updated. You can now sign in and enjoy dining combos.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/auth')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #3A1F12 0%, #1A0F09 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span>Sign In to JEC Dining</span>
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
          </div>
        ) : (
          <div>
            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.95rem',
                fontWeight: 800,
                color: '#1A1816',
                margin: '0 0 0.45rem',
                lineHeight: 1.2
              }}
            >
              Set New Password
            </h1>
            <p style={{ color: '#6E6258', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.55 }}>
              Enter and confirm a new secure password for your JEC Dining account.
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
              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                  New Password (min 6 characters) *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#FFFFFF',
                    border: '1.5px solid #E8DDD0',
                    borderRadius: '16px',
                    padding: '6px 14px'
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
                    placeholder="Enter new password"
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
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8C7E74',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                  Confirm New Password *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#FFFFFF',
                    border: '1.5px solid #E8DDD0',
                    borderRadius: '16px',
                    padding: '6px 14px'
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8C7E74',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
                <ArrowRight size={18} strokeWidth={2.4} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
