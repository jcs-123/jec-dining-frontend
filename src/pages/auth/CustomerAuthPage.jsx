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
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const CustomerAuthPage = () => {
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectPath = (rawRedirect && rawRedirect !== '/' && rawRedirect !== '/auth') ? rawRedirect : '/jeccafe';
  const navigate = useNavigate();
  const { user, isAuthenticated, loginCustomer, changeCustomerCafe, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const initialMode = searchParams.get('mode') === 'forgot' || searchParams.get('tab') === 'forgot' ? 'forgot' : 'login';
  const [mode, setMode] = useState(initialMode);
  const [cafes, setCafes] = useState([
    { name: 'JECCAFE', slug: 'jeccafe' },
    { name: 'JEC BYTES', slug: 'jecbytes' }
  ]);

  useEffect(() => {
    const m = searchParams.get('mode') || searchParams.get('tab');
    if (m === 'forgot') {
      setMode('forgot');
    } else if (m === 'login') {
      setMode('login');
    }
  }, [searchParams]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot password multi-step state: 'email' | 'otp' | 'new_password'
  const [forgotStep, setForgotStep] = useState('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetErrorMsg, setResetErrorMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
      const dest = redirectPath || '/jeccafe';
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Email
  const handleForgotSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      setForgotLoading(true);
      setResetErrorMsg('');
      const res = await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      if (res.success) {
        setForgotStep('otp');
        setResendCooldown(30);
        showSuccess(res.message || `Password reset OTP sent to ${forgotEmail}`);
      }
    } catch (err) {
      showError(err.message || 'Failed to send reset OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP Only
  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setResetErrorMsg('');

    const trimmedOtp = (resetOtp || '').trim();
    if (!trimmedOtp || trimmedOtp.length !== 6) {
      setResetErrorMsg('Please enter the 6-digit verification OTP sent to your email.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await api.post('/auth/verify-otp', {
        email: forgotEmail.trim(),
        otp: trimmedOtp
      });

      if (res.success) {
        showSuccess('OTP verified! Now create your new password.');
        setForgotStep('new_password');
        setResetErrorMsg('');
      }
    } catch (err) {
      const msg = err.message || 'Invalid or expired OTP. Please check the code and try again.';
      setResetErrorMsg(msg);
      showError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  // Step 3: Save New Password
  const handleSaveNewPassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setResetErrorMsg('');

    if (resetNewPassword.length < 6) {
      setResetErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetErrorMsg('New password and confirm password do not match.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await api.post('/auth/reset-password', {
        email: forgotEmail.trim(),
        otp: (resetOtp || '').trim(),
        newPassword: resetNewPassword,
        confirmPassword: resetConfirmPassword
      });

      if (res.success) {
        showSuccess('Password updated successfully! You can now log in.');
        setLoginIdentifier(forgotEmail.trim());
        setMode('login');
        setForgotStep('email');
        setResetOtp('');
        setResetNewPassword('');
        setResetConfirmPassword('');
        setResetErrorMsg('');
      }
    } catch (err) {
      const msg = err.message || 'Failed to update password. Please try again.';
      setResetErrorMsg(msg);
      showError(msg);
    } finally {
      setResetLoading(false);
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

        {mode === 'forgot' ? (
          /* FORGOT PASSWORD VIEW - 3 STEPS */
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
              <span>
                {forgotStep === 'email' && 'PASSWORD RECOVERY • STEP 1 OF 3'}
                {forgotStep === 'otp' && 'VERIFY IDENTITY • STEP 2 OF 3'}
                {forgotStep === 'new_password' && 'CREATE PASSWORD • STEP 3 OF 3'}
              </span>
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
              {forgotStep === 'email' && 'Reset Your Password'}
              {forgotStep === 'otp' && 'Verify 6-Digit OTP'}
              {forgotStep === 'new_password' && 'Create New Password'}
            </h1>

            <p style={{ color: '#6E6258', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.55 }}>
              {forgotStep === 'email' && 'Enter your registered Jyothi Engineering College email to receive a verification OTP code.'}
              {forgotStep === 'otp' && `Enter the 6-digit OTP code sent to ${forgotEmail}.`}
              {forgotStep === 'new_password' && 'Enter and confirm your new password to secure your account.'}
            </p>

            {resetErrorMsg && (
              <div
                style={{
                  background: '#FDF2F2',
                  border: '1.5px solid #F8D7DA',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  color: '#9C2525',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem'
                }}
              >
                {resetErrorMsg}
              </div>
            )}

            {/* STEP 1: ENTER EMAIL & SEND OTP */}
            {forgotStep === 'email' && (
              <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                    Campus Email Address *
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
                      placeholder="e.g. rahul@jecc.ac.in"
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
                  <span>{forgotLoading ? 'Sending Verification OTP...' : 'Send 6-Digit OTP'}</span>
                  <ArrowRight size={18} strokeWidth={2.4} />
                </button>
              </form>
            )}

            {/* STEP 2: VERIFY OTP ONLY */}
            {forgotStep === 'otp' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  style={{
                    background: '#F2FAF3',
                    border: '1.5px solid #C5E6CE',
                    borderRadius: '16px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1B6A35', fontWeight: 800, fontSize: '0.92rem' }}>
                    <CheckCircle2 size={18} />
                    <span>OTP Dispatched!</span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#2C5537', margin: 0, lineHeight: 1.5 }}>
                    We sent a 6-digit verification code to <strong>{forgotEmail}</strong>. Check your inbox and enter the code below to continue.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                      <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1A1816' }}>
                        Enter 6-Digit OTP *
                      </label>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C86D44', letterSpacing: '0.04em' }}>
                        15 MIN VALIDITY
                      </span>
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
                          background: '#FDF1EB',
                          border: '1px solid #F0DAC9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <ShieldCheck size={18} color="#C86D44" strokeWidth={2.2} />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="e.g. 123456"
                        required
                        autoFocus
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          letterSpacing: '0.25em',
                          color: '#1A1816',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading || resetOtp.length !== 6}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '14px',
                      marginTop: '0.4rem',
                      background: resetOtp.length === 6 ? 'linear-gradient(135deg, #3A1F12 0%, #1A0F09 100%)' : '#E8DDD0',
                      color: resetOtp.length === 6 ? '#FFFFFF' : '#8A7A6E',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: resetLoading || resetOtp.length !== 6 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{resetLoading ? 'Verifying OTP Code...' : 'Verify OTP & Continue'}</span>
                    <ArrowRight size={18} strokeWidth={2.4} />
                  </button>
                </form>

                {/* Sub-actions: Resend & Change Email */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    disabled={forgotLoading || resendCooldown > 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendCooldown > 0 ? '#8C7E74' : '#C86D44',
                      fontWeight: 700,
                      cursor: forgotLoading || resendCooldown > 0 ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: 0
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>{forgotLoading ? 'Resending...' : resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP Code'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('email');
                      setResetOtp('');
                      setResetErrorMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8C674E',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Change Email
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CREATE NEW PASSWORD */}
            {forgotStep === 'new_password' && (
              <form onSubmit={handleSaveNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div
                  style={{
                    background: '#F2FAF3',
                    border: '1.5px solid #C5E6CE',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#1B6A35',
                    fontWeight: 700,
                    fontSize: '0.84rem'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>OTP Verified for {forgotEmail}</span>
                </div>

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
                      type={showResetNewPassword ? 'text' : 'password'}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      autoFocus
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
                      onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8C7E74',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showResetNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      type={showResetConfirmPassword ? 'text' : 'password'}
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
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
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8C7E74',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showResetConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {resetConfirmPassword.length > 0 && (
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: resetNewPassword === resetConfirmPassword ? '#1B6A35' : '#C53030',
                      marginTop: '-4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {resetNewPassword === resetConfirmPassword ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <span>Passwords do not match yet</span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetLoading || !resetNewPassword || resetNewPassword !== resetConfirmPassword}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '14px',
                    marginTop: '0.4rem',
                    background:
                      resetNewPassword && resetNewPassword === resetConfirmPassword
                        ? 'linear-gradient(135deg, #3A1F12 0%, #1A0F09 100%)'
                        : '#E8DDD0',
                    color: resetNewPassword && resetNewPassword === resetConfirmPassword ? '#FFFFFF' : '#8A7A6E',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor:
                      resetLoading || !resetNewPassword || resetNewPassword !== resetConfirmPassword
                        ? 'not-allowed'
                        : 'pointer',
                    boxShadow:
                      resetNewPassword && resetNewPassword === resetConfirmPassword
                        ? '0 10px 24px rgba(45, 20, 10, 0.32)'
                        : 'none'
                  }}
                >
                  <span>{resetLoading ? 'Saving New Password...' : 'Save New Password & Sign In'}</span>
                  <ArrowRight size={18} strokeWidth={2.4} />
                </button>
              </form>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setForgotStep('email');
                  setResetErrorMsg('');
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
          /* SIGN IN FORM ONLY (REGISTRATION REMOVED) */
          <div>
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
              Welcome to JEC Dining
            </h1>
            <p style={{ color: '#6E6258', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.55 }}>
              Sign in to unlock Breakfast, Lunch, Tea/Snacks, and Dinner combos from JEC Cafe.
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

            {/* LOGIN FORM */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#1A1816', marginBottom: '7px' }}>
                  Username *
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
                    <User size={18} color="#9C5B32" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter username or campus email"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
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
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep('email');
                      setResetErrorMsg('');
                    }}
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
                    autoComplete="new-password"
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
