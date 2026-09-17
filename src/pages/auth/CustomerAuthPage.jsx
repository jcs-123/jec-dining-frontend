import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  GraduationCap,
  AtSign,
  Store,
  LogOut,
  Sparkles
} from 'lucide-react';

export const CustomerAuthPage = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const navigate = useNavigate();
  const { user, isAuthenticated, loginCustomer, registerCustomer, changeCustomerCafe, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [cafes, setCafes] = useState([
    { name: 'JECCAFE', slug: 'jeccafe' },
    { name: 'JEC BYTES', slug: 'jec-bytest' }
  ]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regAdmissionNumber, setRegAdmissionNumber] = useState('');
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCafeName, setRegCafeName] = useState('JECCAFE');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [switchingCafe, setSwitchingCafe] = useState(false);

  // Fetch available cafes
  useEffect(() => {
    const loadCafes = async () => {
      try {
        const res = await api.get('/cafes');
        if (res.success && Array.isArray(res.cafes) && res.cafes.length > 0) {
          setCafes(res.cafes);
          setRegCafeName(res.cafes[0].name);
        }
      } catch (err) {
        console.error('Failed to load cafes list:', err);
      }
    };
    loadCafes();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      const loggedUser = await loginCustomer(loginIdentifier, loginPassword);
      showSuccess(`Welcome back, ${loggedUser.name}! Signed in to JEC Dining.`);
      const dest = loggedUser.cafe?.slug ? `/${loggedUser.cafe.slug}` : redirectPath;
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regAdmissionNumber.trim()) {
      setErrorMsg('Admission Number is required.');
      return;
    }
    if (!regName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!regUsername.trim()) {
      setErrorMsg('Username is required.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Mail ID is required.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const newUser = await registerCustomer({
        admissionNumber: regAdmissionNumber.trim(),
        name: regName.trim(),
        username: regUsername.trim().toLowerCase(),
        email: regEmail.trim(),
        password: regPassword,
        cafeName: regCafeName
      });

      showSuccess(`Account created! Welcome to ${regCafeName}, ${newUser.name}.`);
      const targetSlug = cafes.find(c => c.name.toLowerCase() === regCafeName.toLowerCase())?.slug || 'jeccafe';
      navigate(`/${targetSlug}`, { replace: true });
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotDevLink, setForgotDevLink] = useState('');

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      setForgotLoading(true);
      const res = await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      if (res.success) {
        setForgotSent(true);
        if (res.resetLink) {
          setForgotDevLink(res.resetLink);
        }
        showSuccess(res.message || `Password reset instructions sent to ${forgotEmail}`);
      }
    } catch (err) {
      showError(err.message || 'Failed to send reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCafeChange = async (cafeName) => {
    try {
      setSwitchingCafe(true);
      const updated = await changeCustomerCafe({ cafeName });
      showSuccess(`Active dining café changed to ${updated.cafe?.name || cafeName}`);
    } catch (err) {
      showError(err.message || 'Failed to switch café');
    } finally {
      setSwitchingCafe(false);
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
          maxWidth: '495px',
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

        {/* ALREADY LOGGED IN VIEW */}
        {isAuthenticated && user?.role === 'customer' ? (
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F2FAF3',
              border: '1.2px solid #C5E6CE',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#1B6A35',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={13} />
              <span>ACTIVE CUSTOMER SESSION</span>
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
              Welcome, {user.name}
            </h1>
            <p style={{ color: '#6E6258', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.55 }}>
              Your campus dining profile is active. You can change your preferred café below.
            </p>

            {/* Profile Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E8DDD0',
              borderRadius: '18px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F4EDE4', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#8A7A6E', fontWeight: 600 }}>Admission Number:</span>
                <strong style={{ fontSize: '0.88rem', color: '#1A1816' }}>{user.admissionNumber || 'Not provided'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F4EDE4', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#8A7A6E', fontWeight: 600 }}>Username:</span>
                <strong style={{ fontSize: '0.88rem', color: '#1A1816' }}>@{user.username || user.email?.split('@')[0]}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F4EDE4', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#8A7A6E', fontWeight: 600 }}>Mail ID:</span>
                <strong style={{ fontSize: '0.88rem', color: '#1A1816' }}>{user.email}</strong>
              </div>

              {/* Cafe Selection Name-Wise */}
              <div style={{ paddingTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#1A1816', marginBottom: '6px' }}>
                  <Store size={15} color="#9C5B32" />
                  <span>Preferred Campus Café (Change Name-Wise):</span>
                </label>
                <select
                  className="form-select"
                  value={user.cafe?.name || 'JECCAFE'}
                  onChange={(e) => handleCafeChange(e.target.value)}
                  disabled={switchingCafe}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid #D8C8B8',
                    fontWeight: 700,
                    color: '#1A1816',
                    background: '#FAF5ED'
                  }}
                >
                  {cafes.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => navigate(user.cafe?.slug ? `/${user.cafe.slug}` : '/')}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3A1F12 0%, #1A0F09 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                Go to {user.cafe?.name || 'Dining Menu'} →
              </button>
              <button
                type="button"
                onClick={logout}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#FFFFFF',
                  border: '1.5px solid #E8DDD0',
                  color: '#8B4822',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : mode === 'forgot' ? (
          /* FORGOT PASSWORD VIEW */
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
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1B6A35', fontWeight: 800, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Password Reset Email Sent!</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: '#2C5537', margin: 0, lineHeight: 1.55 }}>
                  A premium password reset email has been dispatched via Nodemailer to <strong>{forgotEmail}</strong>. Please check your inbox and click the reset button.
                </p>
                {forgotDevLink && (
                  <div style={{ marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #C5E6CE' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1B6A35', marginBottom: '4px' }}>
                      DIRECT RESET SHORTCUT:
                    </div>
                    <Link
                      to={forgotDevLink}
                      style={{
                        display: 'inline-block',
                        background: '#1B6A35',
                        color: '#FFFFFF',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      Open Password Reset Page &rarr;
                    </Link>
                  </div>
                )}
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
                      <Mail size={18} color="#9C5B32" strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
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
                  disabled={forgotLoading}
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
                    cursor: forgotLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>{forgotLoading ? 'Sending Email...' : 'Send Reset Instructions'}</span>
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
          /* AUTH FORMS (SIGN IN / CREATE ACCOUNT) */
          <div>
            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#F0E5D8',
                padding: '4px',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                border: '1px solid #E4D6C6'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                style={{
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: mode === 'login' ? '#FFFFFF' : 'transparent',
                  fontWeight: mode === 'login' ? 800 : 600,
                  color: mode === 'login' ? '#1A1816' : '#8A7A6E',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
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
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: mode === 'register' ? '#FFFFFF' : 'transparent',
                  fontWeight: mode === 'register' ? 800 : 600,
                  color: mode === 'register' ? '#1A1816' : '#8A7A6E',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Create Account
              </button>
            </div>

            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.95rem',
                fontWeight: 800,
                color: '#1A1816',
                margin: '0 0 0.35rem',
                letterSpacing: '-0.02em'
              }}
            >
              {mode === 'login' ? 'Sign In to JEC Dining' : 'Register Customer Profile'}
            </h1>
            <p style={{ color: '#6E6258', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.55 }}>
              {mode === 'login'
                ? 'Sign in using your Mail ID, Username, or Admission Number.'
                : 'Create your campus customer profile to order combos and select your preferred café.'}
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

            {mode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                    Mail ID / Username / Admission No *
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
                      <Mail size={18} color="#9C5B32" strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. rahul@jecc.ac.in, rahul_jec, JEC2024CS042"
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.95rem',
                        color: '#1A1816',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

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
                      Password *
                    </label>
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
                    >
                      Forgot Password?
                    </button>
                  </div>
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
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.95rem',
                        color: '#1A1816',
                        fontWeight: 500
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8C7E74',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                    boxShadow: '0 10px 24px rgba(45, 20, 10, 0.32)'
                  }}
                >
                  <span>{loading ? 'Processing...' : 'Sign In & Unlock Combos'}</span>
                  <ArrowRight size={18} strokeWidth={2.4} />
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {/* Admission Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1A1816', marginBottom: '5px' }}>
                    Admission Number *
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E8DDD0',
                      borderRadius: '14px',
                      padding: '5px 12px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#F9F2EA',
                        border: '1px solid #EADBCC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GraduationCap size={16} color="#9C5B32" />
                    </div>
                    <input
                      type="text"
                      value={regAdmissionNumber}
                      onChange={(e) => setRegAdmissionNumber(e.target.value)}
                      placeholder="e.g. JEC2024CS042"
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.92rem',
                        color: '#1A1816',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1A1816', marginBottom: '5px' }}>
                    Full Name *
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E8DDD0',
                      borderRadius: '14px',
                      padding: '5px 12px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#F9F2EA',
                        border: '1px solid #EADBCC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <User size={16} color="#9C5B32" />
                    </div>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.92rem',
                        color: '#1A1816',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1A1816', marginBottom: '5px' }}>
                    Username *
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E8DDD0',
                      borderRadius: '14px',
                      padding: '5px 12px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#F9F2EA',
                        border: '1px solid #EADBCC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <AtSign size={16} color="#9C5B32" />
                    </div>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. rahul_jec"
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.92rem',
                        color: '#1A1816',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                {/* Mail ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1A1816', marginBottom: '5px' }}>
                    Mail ID (Email) *
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E8DDD0',
                      borderRadius: '14px',
                      padding: '5px 12px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#F9F2EA',
                        border: '1px solid #EADBCC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Mail size={16} color="#9C5B32" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. rahul@jecc.ac.in"
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.92rem',
                        color: '#1A1816',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                {/* Select Café Name-Wise */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1A1816', marginBottom: '5px' }}>
                    Select Campus Dining Café *
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E8DDD0',
                      borderRadius: '14px',
                      padding: '5px 12px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#F9F2EA',
                        border: '1px solid #EADBCC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Store size={16} color="#9C5B32" />
                    </div>
                    <select
                      value={regCafeName}
                      onChange={(e) => setRegCafeName(e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.92rem',
                        color: '#1A1816',
                        fontWeight: 700
                      }}
                    >
                      {cafes.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1A1816', marginBottom: '5px' }}>
                    Password (min 6 chars) *
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#FFFFFF',
                      border: '1.5px solid #E8DDD0',
                      borderRadius: '14px',
                      padding: '5px 12px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#F9F2EA',
                        border: '1px solid #EADBCC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Lock size={16} color="#9C5B32" />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create secure password"
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.92rem',
                        color: '#1A1816',
                        fontWeight: 500
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8C7E74',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    padding: '13px',
                    marginTop: '0.4rem',
                    background: 'linear-gradient(135deg, #9C5B32 0%, #753E1B 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 20px rgba(156, 91, 50, 0.35)'
                  }}
                >
                  <span>{loading ? 'Creating Profile...' : 'Complete Registration & Enter'}</span>
                  <ArrowRight size={18} strokeWidth={2.4} />
                </button>
              </form>
            )}

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
