import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck, CheckCircle2, KeyRound, Eye, EyeOff } from 'lucide-react';

export const CustomerAuthPage = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const navigate = useNavigate();
  const { loginCustomer, registerCustomer } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      if (mode === 'login') {
        await loginCustomer(email, password);
      } else if (mode === 'register') {
        await registerCustomer({ name, email, phone, password });
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
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

        {/* Back link to Home */}
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

        {mode === 'forgot' ? (
          /* Forgot Password View */
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: '#FDF1EB',
                border: '1.2px solid #F0DAC9',
                padding: '5px 14px',
                borderRadius: '24px',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#8B4822',
                marginBottom: '0.85rem'
              }}
            >
              <KeyRound size={13} strokeWidth={2.5} />
              <span>CAMPUS CREDENTIAL HELP</span>
            </div>

            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#1A1816',
                margin: '0 0 0.45rem',
                lineHeight: 1.2
              }}
            >
              Reset Your Password
            </h1>
            <p style={{ color: '#6E6258', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.55 }}>
              Enter your registered Jyothi Engineering College email address to receive password reset instructions.
            </p>

            {forgotSent ? (
              <div
                style={{
                  background: '#F2FAF3',
                  border: '1.5px solid #C5E6CE',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1B6A35', fontWeight: 800, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Reset Link Sent</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#2C5537', margin: 0, lineHeight: 1.5 }}>
                  We've sent recovery steps to <strong>{forgotEmail}</strong>. Please check your student or faculty inbox.
                </p>
                <div style={{ fontSize: '0.78rem', color: '#4A7A57', marginTop: '4px' }}>
                  Dining Office Helpline: <strong>jcs@jecc.ac.in</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                    Campus Email Address
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
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="customer@jec.ac.in"
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

                <button
                  type="submit"
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
                    cursor: 'pointer',
                    boxShadow: '0 10px 24px rgba(45, 20, 10, 0.32)'
                  }}
                >
                  <span>Send Reset Instructions</span>
                  <ArrowRight size={18} strokeWidth={2.4} />
                </button>
              </form>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setForgotSent(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8C674E',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                ← Return to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* Sign In & Register Forms */
          <div>
            {/* Toggle Mode Pills */}
            <div
              style={{
                display: 'flex',
                background: '#EFE7DC',
                padding: '4px',
                borderRadius: '14px',
                marginBottom: '1.5rem',
                border: '1px solid #E2D6C5'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  background: mode === 'login' ? '#FFFFFF' : 'transparent',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: mode === 'login' ? '#1A1816' : '#7C6F65',
                  cursor: 'pointer',
                  boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  background: mode === 'register' ? '#FFFFFF' : 'transparent',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: mode === 'register' ? '#1A1816' : '#7C6F65',
                  cursor: 'pointer',
                  boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Create Account
              </button>
            </div>

            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.92rem',
                fontWeight: 800,
                color: '#1A1816',
                margin: '0 0 0.45rem',
                letterSpacing: '-0.025em'
              }}
            >
              {mode === 'login' ? 'Welcome to JEC Dining' : 'Join JEC Dining'}
            </h1>
            <p style={{ color: '#6E6258', fontSize: '0.88rem', marginBottom: '1.65rem', lineHeight: 1.55 }}>
              {mode === 'login'
                ? 'Sign in to unlock Breakfast, Lunch, Tea/Snacks, and Dinner combos.'
                : 'Register your student or faculty profile for seamless campus combos.'}
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
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                    Full Name
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
                      <User size={18} color="#9C5B32" strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul Sharma"
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
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                  Email Address
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
                    placeholder="customer@jec.ac.in"
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

              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                    Phone Number
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
                      <Phone size={18} color="#9C5B32" strokeWidth={2} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
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
              )}

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '7px'
                  }}
                >
                  <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1A1816' }}>
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9C5B32',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
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
                    placeholder="••••••••••••"
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
                <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In & Unlock Combos' : 'Create Account'}</span>
                <ArrowRight size={18} strokeWidth={2.4} />
              </button>
            </form>

            {/* Elegant footer note */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1.15rem',
                borderTop: '1px solid #EBE0D2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#8A7A6E',
                  textTransform: 'uppercase'
                }}
              >
                GOOD FOOD • BETTER STUDENTS • BRIGHTER DAYS
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAuthPage;
