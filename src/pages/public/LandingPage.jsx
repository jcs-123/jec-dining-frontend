import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Store,
  UtensilsCrossed,
  CreditCard,
  Truck,
  Coffee,
  ShieldCheck,
  Star,
  Leaf,
  Heart,
  Award,
  Lock,
  ArrowRight,
  ChevronRight,
  UserCheck,
  LogOut,
  LogIn,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Headphones,
  Landmark,
  X,
  Users,
  Menu as MenuIcon
} from 'lucide-react';

// Dedicated Vector Logo Component for JEC Dining (Header / Top Bar)
const JecDiningLogo = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="14" fill="url(#jec_grad)" />
    {/* Stylized Steam */}
    <path d="M18 12C18 12 17 14.5 19 16.5" stroke="#E89B6A" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M24 10C24 10 23 13.5 25 15.5" stroke="#E89B6A" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30 12C30 12 29 14.5 31 16.5" stroke="#E89B6A" strokeWidth="2.2" strokeLinecap="round" />
    {/* Cup Body */}
    <path d="M13 21C13 19.8954 13.8954 19 15 19H31C32.1046 19 33 19.8954 33 21V27C33 31.4183 29.4183 35 25 35H21C16.5817 35 13 31.4183 13 27V21Z" fill="#FAF8F5" />
    {/* Cup Handle */}
    <path d="M33 22.5H35C36.933 22.5 38.5 24.067 38.5 26C38.5 27.933 36.933 29.5 35 29.5H33" stroke="#FAF8F5" strokeWidth="2.4" strokeLinecap="round" />
    {/* Saucer Base */}
    <path d="M11 38.5H37" stroke="#FAF8F5" strokeWidth="2.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="jec_grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2E1C14" />
        <stop offset="1" stopColor="#C86D44" />
      </linearGradient>
    </defs>
  </svg>
);

// Footer Coffee Cup Logo with Cutlery Steam matching user's exact mockup
const JecDiningFooterCup = ({ width = 74, height = 62 }) => (
  <svg width={width} height={height} viewBox="0 0 116 92" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Soft ground shadow under saucer */}
    <ellipse cx="50" cy="85" rx="44" ry="5.5" fill="rgba(60, 35, 20, 0.15)" />

    {/* Saucer */}
    <ellipse cx="50" cy="78" rx="46" ry="8" fill="#FAF6EE" stroke="#3D2314" strokeWidth="3" />
    <ellipse cx="50" cy="78.5" rx="38" ry="5" fill="#EAE0D1" />

    {/* Coffee Cup Body */}
    <path d="M18 42 C18 70 30 76 50 76 C70 76 82 70 82 42 Z" fill="#3D2314" />
    {/* Cup Rim */}
    <ellipse cx="50" cy="42" rx="32" ry="7" fill="#FAF6EE" stroke="#3D2314" strokeWidth="3" />
    {/* Dark Coffee surface with rich crema sheen */}
    <ellipse cx="50" cy="42" rx="27" ry="5" fill="#221006" />
    <ellipse cx="44" cy="41" rx="15" ry="2.6" fill="#5A2E14" opacity="0.65" />

    {/* Cup Handle */}
    <path d="M80 46 C95 46 97 63 78 67" stroke="#3D2314" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M80 46 C93 46 95 63 78 67" stroke="#FAF6EE" strokeWidth="1.8" strokeLinecap="round" fill="none" />

    {/* Cutlery Steam wisps rising */}
    {/* Fork on the left */}
    <path d="M33 11 V28 M29 11 V20 C29 22.5 33 23.5 33 28 M37 11 V20 C37 22.5 33 23.5 33 28" stroke="#3D2314" strokeWidth="2.2" strokeLinecap="round" />
    {/* Spoon in the middle */}
    <ellipse cx="49" cy="14" rx="4.8" ry="6.5" fill="#3D2314" />
    <path d="M49 20.5 V33" stroke="#3D2314" strokeWidth="2.4" strokeLinecap="round" />
    {/* Graceful steam swirls */}
    <path d="M60 9 C55 17 64 24 59 34" stroke="#7A4E32" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <path d="M68 15 C65 21 71 27 67 34" stroke="#A87A5B" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// Botanical Leaves on Footer Left
const BotanicalLeavesLeft = () => (
  <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0, pointerEvents: 'none', opacity: 0.88, zIndex: 1 }}>
    {/* Main curving stem */}
    <path d="M-20 260 C20 210 40 160 85 130 C120 108 160 98 195 90" stroke="#CBBBA8" strokeWidth="3" strokeLinecap="round" />
    {/* Leaf pairs */}
    <path d="M35 210 C20 190 38 170 58 185 C65 202 48 215 35 210 Z" fill="#D7C9B8" />
    <path d="M65 175 C58 150 82 138 100 155 C104 172 82 186 65 175 Z" fill="#C3B29E" />
    <path d="M102 142 C94 118 122 108 140 125 C142 142 120 154 102 142 Z" fill="#D7C9B8" />
    <path d="M142 115 C138 95 165 88 178 105 C178 122 158 128 142 115 Z" fill="#C3B29E" />
    <path d="M180 96 C182 80 204 78 210 92 C210 106 195 110 180 96 Z" fill="#D7C9B8" />
    {/* Secondary lower branch */}
    <path d="M15 260 C40 235 75 220 110 225" stroke="#CBBBA8" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M55 240 C44 228 60 215 72 224 C75 236 62 244 55 240 Z" fill="#C3B29E" />
    <path d="M92 228 C84 216 100 205 110 215 C112 226 98 232 92 228 Z" fill="#D7C9B8" />
  </svg>
);

// Botanical Leaves on Footer Right
const BotanicalLeavesRight = () => (
  <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 10, right: 0, pointerEvents: 'none', opacity: 0.72, zIndex: 1 }}>
    <path d="M200 220 C160 170 135 120 95 90 C75 75 50 65 25 60" stroke="#CBBBA8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M165 178 C178 160 160 148 148 162 C142 174 155 184 165 178 Z" fill="#D7C9B8" />
    <path d="M130 140 C144 122 125 110 112 125 C108 138 120 146 130 140 Z" fill="#C3B29E" />
    <path d="M96 105 C110 90 92 78 80 92 C76 104 88 112 96 105 Z" fill="#D7C9B8" />
    <path d="M60 76 C70 64 56 54 46 66 C44 76 54 82 60 76 Z" fill="#C3B29E" />
  </svg>
);

// Realistic Roasted Coffee Beans at Bottom Right
const CoffeeBeansDeco = () => (
  <div style={{ position: 'absolute', bottom: '16px', right: '28px', display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none', zIndex: 2 }}>
    {/* Bean 1 (Small tilted) */}
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" style={{ transform: 'rotate(-25deg)', filter: 'drop-shadow(0 4px 6px rgba(46, 22, 8, 0.28))' }}>
      <ellipse cx="17" cy="12" rx="16" ry="11" fill="url(#bean_grad1)" />
      {/* S-curve crease */}
      <path d="M4 12 C10 8 12 16 17 12 C22 8 24 16 30 12" stroke="#231005" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <radialGradient id="bean_grad1" cx="35%" cy="35%" r="65%">
          <stop stopColor="#6E3B1C" />
          <stop offset="60%" stopColor="#43210E" />
          <stop offset="100%" stopColor="#241005" />
        </radialGradient>
      </defs>
    </svg>

    {/* Bean 2 (Large bold upright) */}
    <svg width="44" height="30" viewBox="0 0 44 30" fill="none" style={{ transform: 'rotate(22deg)', filter: 'drop-shadow(0 5px 8px rgba(46, 22, 8, 0.32))' }}>
      <ellipse cx="22" cy="15" rx="20" ry="14" fill="url(#bean_grad2)" />
      {/* S-curve crease */}
      <path d="M5 15 C13 9 17 21 22 15 C27 9 31 21 39 15" stroke="#200E04" strokeWidth="2.4" strokeLinecap="round" />
      <defs>
        <radialGradient id="bean_grad2" cx="35%" cy="30%" r="70%">
          <stop stopColor="#7A4220" />
          <stop offset="65%" stopColor="#4A2510" />
          <stop offset="100%" stopColor="#251106" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

export const LandingPage = () => {
  const { selectCafeBySlug } = useCafe();
  const { user, isAuthenticated, loginCustomer, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();


  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [targetCafeAfterLogin, setTargetCafeAfterLogin] = useState('jeccafe');
  const [loginEmail, setLoginEmail] = useState('customer@jec.ac.in');
  const [loginPassword, setLoginPassword] = useState('Customer@2026');
  const [authLoading, setAuthLoading] = useState(false);
  const [footerPolicyModal, setFooterPolicyModal] = useState(null); // 'privacy' | 'terms' | 'contact' | 'support'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // IntersectionObserver for scroll animations
  const sectionRefs = useRef([]);
  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleCafeSelection = (slug) => {
    if (!isAuthenticated) {
      setTargetCafeAfterLogin(slug);
      setShowLoginModal(true);
      return;
    }
    selectCafeBySlug(slug);
    navigate(`/${slug}`);
  };

  const handleQuickLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      setAuthLoading(true);
      await loginCustomer(loginEmail, loginPassword);
      showSuccess('Signed in successfully! Opening café menu...');
      setShowLoginModal(false);

      const nextCafe = targetCafeAfterLogin || 'jeccafe';
      selectCafeBySlug(nextCafe);
      navigate(`/${nextCafe}`);
    } catch (err) {
      showError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 80% 12%, #FFF9F0 0%, #FAF5ED 50%, #F4ECE0 100%)',
      color: '#1A1816',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Responsive Stylesheet for Entire Landing Page */}
      <style>{`
        /* Header Responsiveness */
        .landing-header {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 1.15rem 3.5rem;
          background: rgba(251, 248, 242, 0.90);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(224, 212, 196, 0.45);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          transition: all 0.25s ease;
        }
        /* Header Navigation Links */
        .header-nav-links {
          display: flex;
          align-items: center;
          gap: 2.2rem;
        }
        .header-nav-item {
          background: none;
          border: none;
          padding: 6px 0;
          font-size: 0.94rem;
          font-weight: 600;
          color: #4A423B;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
          font-family: inherit;
        }
        .header-nav-item:hover {
          color: #1A1816;
        }
        .header-nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #8A5838;
          transition: width 0.2s ease;
        }
        .header-nav-item:hover::after {
          width: 100%;
        }

        .mobile-menu-btn {
          display: none;
          background: #F3ECE2;
          border: 1px solid #E5DDD0;
          border-radius: 12px;
          padding: 7px;
          cursor: pointer;
          color: #1A1816;
        }
        @media (max-width: 960px) {
          .header-nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }

        .mobile-nav-drawer {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 1.2rem 1.5rem 1.5rem;
          background: rgba(250, 248, 245, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1.5px solid #EADBCC;
          position: sticky;
          top: 66px;
          z-index: 49;
          box-shadow: 0 16px 32px rgba(45, 30, 15, 0.08);
          animation: slideDownMenu 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDownMenu {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-nav-link {
          background: none;
          border: none;
          text-align: left;
          font-size: 1.02rem;
          font-weight: 700;
          color: #2D241D;
          padding: 10px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .mobile-nav-link:hover {
          background: #EFE8DE;
        }

        @media (max-width: 768px) {
          .landing-header {
            padding: 0.85rem 1.25rem;
          }
        }
        @media (max-width: 480px) {
          .landing-header {
            padding: 0.75rem 1rem;
          }
          .landing-header-sub {
            display: none !important;
          }
        }

        /* Hero Responsiveness */
        .landing-hero-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3.5rem 3rem 4rem;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 3.5rem;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1024px) {
          .landing-hero-grid {
            grid-template-columns: 1fr;
            padding: 2.5rem 1.75rem 3.5rem;
            gap: 2.5rem;
          }
        }
        @media (max-width: 640px) {
          .landing-hero-grid {
            padding: 1.75rem 1.25rem 2.5rem;
            gap: 2rem;
          }
        }

        /* Hero Image Container */
        .hero-visual-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        /* Story Section Responsiveness */
        .story-banner-header {
          padding: 2.5rem 3rem 2rem;
        }
        .story-body-content {
          padding: 2.5rem 3rem;
        }
        @media (max-width: 768px) {
          .story-banner-header {
            padding: 1.75rem 1.25rem 1.5rem;
          }
          .story-body-content {
            padding: 1.75rem 1.25rem;
          }
        }

        /* Sections Common */
        .landing-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 3rem;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .landing-section {
            padding: 2.5rem 1.25rem;
          }
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1100px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
          }
        }

        /* Cafes 2-Card Grid */
        .cafes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.25rem;
        }
        @media (max-width: 960px) {
          .cafes-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
        }

        /* Individual Cafe Card */
        .cafe-card-inner {
          background: #FFFFFF;
          border-radius: 28px;
          border: 1.5px solid #EAE5DC;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
          display: grid;
          grid-template-columns: 220px 1fr;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 640px) {
          .cafe-card-inner {
            grid-template-columns: 1fr;
          }
          .cafe-card-banner {
            min-height: 180px !important;
            height: 180px !important;
          }
        }

        /* Stats Row */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          padding: 2.5rem 0;
          border-top: 1px solid #ECE7DF;
          border-bottom: 1px solid #ECE7DF;
          align-items: center;
        }
        @media (max-width: 860px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            padding: 1.75rem 0;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        /* Warm Artisan Campus Dining Footer */
        .jec-campus-footer {
          margin-top: auto;
          background: #FAF7F2;
          background: radial-gradient(circle at 10% 20%, #F5EDE1 0%, transparent 45%),
                      radial-gradient(circle at 90% 80%, #F3E9DB 0%, transparent 45%),
                      linear-gradient(180deg, #FDFBF8 0%, #F7EFE6 100%);
          border-top: 1.5px solid #E8DFD2;
          padding: 4.5rem 3.5rem 2rem;
          color: #5C544B;
          font-size: 0.88rem;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .jec-campus-footer {
            padding: 3rem 1.25rem 1.75rem;
          }
        }

        .mockup-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.72fr 0.72fr 1.35fr;
          gap: 3.25rem;
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 1100px) {
          .mockup-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }
        @media (max-width: 620px) {
          .mockup-footer-grid {
            grid-template-columns: 1fr;
            gap: 2.25rem;
          }
        }

        .social-square-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #EAE2D5;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #2B221B;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(45, 30, 15, 0.05);
        }
        .social-square-btn:hover {
          background: #DFD4C4;
          transform: translateY(-2px);
          color: #1E1813;
          box-shadow: 0 4px 10px rgba(45, 30, 15, 0.1);
        }

        .footer-nav-link {
          background: none;
          border: none;
          padding: 2px 0;
          margin: 0;
          font-size: 0.92rem;
          font-weight: 500;
          color: #5C544B;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .footer-nav-link:hover {
          color: #1E1813;
          transform: translateX(3px);
        }

        .footer-handwritten-script {
          position: absolute;
          top: 2.75rem;
          right: 3.5rem;
          font-family: 'Caveat', cursive;
          font-size: 2.3rem;
          line-height: 0.95;
          color: #523B2A;
          transform: rotate(-7.5deg);
          text-align: right;
          user-select: none;
          pointer-events: none;
          z-index: 2;
        }
        @media (max-width: 960px) {
          .footer-handwritten-script {
            display: none;
          }
        }

        .footer-bottom-bar-new {
          max-width: 1280px;
          margin: 3.5rem auto 0;
          padding-top: 1.5rem;
          border-top: 1px solid #E5DCD0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          font-size: 0.84rem;
          color: #786F65;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 768px) {
          .footer-bottom-bar-new {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem;
          }
        }
      `}</style>

      {/* Premium Luxury Background Decor matching User Reference Mockup */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '900px', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Soft warm radial ambient lights */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '15%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 235, 195, 0.45) 0%, rgba(250, 246, 240, 0) 70%)',
          filter: 'blur(50px)'
        }} />
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '5%',
          width: '720px',
          height: '720px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235, 160, 90, 0.22) 0%, rgba(250, 246, 240, 0) 70%)',
          filter: 'blur(60px)'
        }} />

        {/* Golden Flowing Satin Ribbons / Waves flowing behind Headline */}
        <svg width="100%" height="100%" viewBox="0 0 1440 850" fill="none" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.88 }}>
          <defs>
            <linearGradient id="goldRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5BD7F" stopOpacity="0.36" />
              <stop offset="50%" stopColor="#D29A56" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FAF5EE" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="goldRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D69F5D" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#E6C497" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#FAF5EE" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="goldRibbonGlow" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#EFCB97" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#D49A58" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Sweeping satin ribbons arching behind hero headline */}
          <path d="M440,0 C560,130 630,250 530,400 C410,560 170,640 -60,700" stroke="url(#goldRibbon1)" strokeWidth="52" fill="none" opacity="0.45" />
          <path d="M420,-20 C530,140 590,270 490,430 C370,590 130,670 -90,740" stroke="url(#goldRibbon2)" strokeWidth="26" fill="none" opacity="0.6" />
          <path d="M450,25 C570,170 620,300 510,450 C390,610 110,690 -110,770" stroke="url(#goldRibbonGlow)" strokeWidth="3.2" fill="none" opacity="0.75" />
          {/* Golden Bokeh Sparkles */}
          <circle cx="510" cy="200" r="3.5" fill="#E8A850" opacity="0.75" />
          <circle cx="550" cy="300" r="2.5" fill="#E8A850" opacity="0.85" />
          <circle cx="475" cy="400" r="3.2" fill="#E8A850" opacity="0.7" />
          <circle cx="350" cy="510" r="2.2" fill="#E8A850" opacity="0.55" />
        </svg>

        {/* Top-Left Corner Lush Leaves Overlay */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '240px', height: '260px', opacity: 0.95, pointerEvents: 'none' }} viewBox="0 0 240 260" fill="none">
          <path d="M-10,0 C35,45 65,95 45,160" stroke="#3A4D28" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M12,28 C50,22 82,48 72,80 C50,83 22,58 12,28 Z" fill="#435B2D" />
          <path d="M12,28 Q50,54 72,80" stroke="#688548" strokeWidth="1.2" />
          <path d="M40,70 C82,60 115,86 104,124 C76,129 48,102 40,70 Z" fill="#354A23" />
          <path d="M40,70 Q76,96 104,124" stroke="#5A763E" strokeWidth="1.2" />
          <path d="M45,130 C88,124 120,150 110,188 C82,191 55,166 45,130 Z" fill="#435B2D" />
          <path d="M45,130 Q82,156 110,188" stroke="#688548" strokeWidth="1.2" />
          <path d="M22,105 C50,100 72,116 66,138 C50,141 33,126 22,105 Z" fill="#58753B" />
        </svg>

        {/* Left Margin Gold Wireframe Botanical Branch */}
        <svg style={{ position: 'absolute', top: '180px', left: '15px', width: '140px', height: '340px', opacity: 0.6, pointerEvents: 'none' }} viewBox="0 0 100 240" fill="none" stroke="#B88E58" strokeWidth="1.5">
          <path d="M10,230 Q40,160 30,80 Q25,30 20,0" strokeLinecap="round" />
          <path d="M28,60 C48,45 65,55 60,75 C45,78 32,70 28,60 Z" fill="rgba(215, 175, 120, 0.14)" />
          <path d="M26,105 C50,88 70,100 64,122 C48,124 32,115 26,105 Z" fill="rgba(215, 175, 120, 0.14)" />
          <path d="M27,155 C52,138 72,150 66,172 C50,174 33,165 27,155 Z" fill="rgba(215, 175, 120, 0.14)" />
          <path d="M24,200 C48,185 66,195 60,215 C46,217 30,210 24,200 Z" fill="rgba(215, 175, 120, 0.14)" />
        </svg>
      </div>

      {/* 1. Header Navigation Bar with Center Links matching User Mockup */}
      <header className="landing-header">
        {/* Brand Logo: JEC Dining with Custom Vector Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1A1816' }}>
          <JecDiningLogo size={42} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em', color: '#1A1816', lineHeight: 1.1 }}>
              JEC Dining
            </div>
            <div className="landing-header-sub" style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 600 }}>
              Two Cafés. One Campus.
            </div>
          </div>
        </Link>

        {/* Center Desktop Navigation Links (matching user mockup) */}
        <nav className="header-nav-links">
          <button
            onClick={() => {
              const el = document.getElementById('our-cafes-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="header-nav-item"
          >
            Our Cafés
          </button>

          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/jeccafe');
              } else {
                setTargetCafeAfterLogin('jeccafe');
                setShowLoginModal(true);
              }
            }}
            className="header-nav-item"
          >
            Menu
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="header-nav-item"
          >
            Features
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('about-story-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="header-nav-item"
          >
            About
          </button>

          <button
            onClick={() => setFooterPolicyModal('support')}
            className="header-nav-item"
          >
            Support
          </button>
        </nav>

        {/* Right Controls: Direct Login / Authenticated Customer Profile + Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigate('/my-orders')}
                className="btn btn-ghost btn-sm"
                style={{ fontWeight: 700, fontSize: '0.88rem' }}
              >
                My Orders
              </button>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '30px',
                background: '#FFFFFF',
                border: '1px solid #E5DFD5',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#1A1816'
              }}>
                <UserCheck size={16} color="#16A34A" />
                <span>{user?.name?.split(' ')[0] || 'Customer'}</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="btn btn-outline btn-sm"
                style={{ padding: '7px 10px', borderRadius: '10px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => {
                  setTargetCafeAfterLogin('jeccafe');
                  setShowLoginModal(true);
                }}
                className="btn"
                style={{
                  background: '#1A1816',
                  color: '#FFFFFF',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  padding: '9px 24px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26, 24, 22, 0.18)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(26, 24, 22, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(26, 24, 22, 0.18)';
                }}
              >
                <LogIn size={15} />
                <span>Sign In / Login</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer (Visible on screens <= 960px when toggled) */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('our-cafes-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mobile-nav-link"
          >
            Our Cafés
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (isAuthenticated) {
                navigate('/jeccafe');
              } else {
                setTargetCafeAfterLogin('jeccafe');
                setShowLoginModal(true);
              }
            }}
            className="mobile-nav-link"
          >
            Menu
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mobile-nav-link"
          >
            Features
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('about-story-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mobile-nav-link"
          >
            About
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setFooterPolicyModal('support');
            }}
            className="mobile-nav-link"
          >
            Support
          </button>
        </div>
      )}
      {/* 2. Hero Section (Matching User's Reference with Artisan Burger Spread & Student Social Proof) */}
      <section
        ref={addToRefs}
        className="landing-hero-grid reveal-on-scroll is-revealed"
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Left Column: Heading & Value Proposition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', zIndex: 2 }}>
          {/* Tag Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#78604F'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#8A5838' }} />
            <span>GOOD FOOD • BRIGHTER DAYS</span>
          </div>

          {/* Headline in Editorial Serif matching user mockup */}
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(2.15rem, 5.2vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            color: '#1A1816',
            margin: 0
          }}>
            Two Cafés.<br />
            One Campus<br />
            <span style={{ fontStyle: 'italic', color: '#8A502E', fontWeight: 600 }}>Experience.</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(0.95rem, 1.35vw, 1.12rem)',
            color: '#5C5650',
            lineHeight: 1.62,
            maxWidth: '460px',
            margin: 0
          }}>
            Order your favourite meals and combos from JEC Cafe and JEC Bytes. Fresh food, great taste, and a better campus dining experience — all in one place.
          </p>

          {/* Action CTA (Get Started with Circular Arrow Badge matching User Mockup) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '0.35rem' }}>
            <button
              onClick={() => handleCafeSelection('jeccafe')}
              className="btn"
              style={{
                background: '#1A120B',
                color: '#FFFFFF',
                padding: '0.72rem 0.95rem 0.72rem 2.2rem',
                borderRadius: '40px',
                fontWeight: 700,
                fontSize: '0.98rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 8px 24px rgba(26, 18, 11, 0.28)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(26, 18, 11, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(26, 18, 11, 0.28)';
              }}
            >
              <span>Get Started</span>
              <span style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ArrowRight size={16} color="#FFFFFF" />
              </span>
            </button>
          </div>

          {/* 3 Feature Pills matching User Reference Image */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '14px 20px',
            marginTop: '1.25rem',
            paddingTop: '0.5rem'
          }}>
            {/* Feature 1: Fresh Food */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1.5px solid #8A5A38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8A5A38',
                flexShrink: 0
              }}>
                <Leaf size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1A1816', lineHeight: 1.2 }}>Fresh Food</div>
                <div style={{ fontSize: '0.74rem', color: '#78716C' }}>Made for You</div>
              </div>
            </div>

            {/* Feature 2: Great Taste */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1.5px solid #8A5A38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8A5A38',
                flexShrink: 0
              }}>
                <Heart size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1A1816', lineHeight: 1.2 }}>Great Taste</div>
                <div style={{ fontSize: '0.74rem', color: '#78716C' }}>Every Day</div>
              </div>
            </div>

            {/* Feature 3: A Better Campus Life */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1.5px solid #8A5A38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8A5A38',
                flexShrink: 0
              }}>
                <Users size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1A1816', lineHeight: 1.2 }}>A Better</div>
                <div style={{ fontSize: '0.74rem', color: '#78716C' }}>Campus Life</div>
              </div>
            </div>
          </div>

          {/* Handwritten Brand Script matching User Mockup: Food Connects People */}
          <div style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#8A5838',
            marginTop: '1.25rem',
            lineHeight: 1.1,
            transform: 'rotate(-4deg)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>Food Connects People</span>
            <span style={{ fontSize: '1.3rem' }}>🤎</span>
          </div>
        </div>

        {/* Right Column: Hero Visual Spread */}
        <div className="hero-visual-wrapper">
          {/* Ambient Warm Glow */}
          <div style={{
            position: 'absolute',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(235, 145, 70, 0.22) 0%, rgba(250, 248, 245, 0) 70%)',
            filter: 'blur(30px)',
            zIndex: 0
          }} />

          {/* Seamless Dual-Card Artisan Artwork matching User Reference Mockup */}
          <div className="animate-float" style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: '690px' }}>
            <img
              src="/images/hero-artisan-scene.png"
              alt="JEC Dining Authentic Masala Dosa, Filter Kaapi, Idli Vada & Campus Dining"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '24px',
                filter: 'drop-shadow(0 20px 48px rgba(46, 26, 14, 0.16))'
              }}
            />
          </div>
        </div>

        {/* Slogan Divider Row across the bottom with accent lines matching User Mockup */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          padding: '1.4rem 0 0.4rem',
          marginTop: '2.5rem',
          fontSize: '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#84786C',
          textTransform: 'uppercase',
          gridColumn: '1 / -1',
          width: '100%'
        }}>
          <div style={{ flex: 1, maxWidth: '180px', height: '1px', background: '#DEC9B5' }} />
          <span>JEC DINING • GOOD FOOD • BRIGHTER DAYS</span>
          <div style={{ flex: 1, maxWidth: '180px', height: '1px', background: '#DEC9B5' }} />
        </div>
      </section>

      {/* 3. Section: "WHY CHOOSE JEC DINING? / A Smarter Way to Dine on Campus" */}
      <section
        id="features-section"
        ref={addToRefs}
        className="landing-section reveal-on-scroll"
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#78716C',
              marginBottom: '6px'
            }}>
              — WHY CHOOSE JEC DINING?
            </div>
            <h2 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: '2.4rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#1A1816',
              margin: 0
            }}>
              A Smarter Way to Dine on Campus
            </h2>
          </div>

          <div style={{ textAlign: 'right', color: '#78716C', fontSize: '0.92rem' }}>
            <div style={{ fontWeight: 700, color: '#1A1816' }}>Simple. Secure. Satisfying.</div>
            <div>Everything you need for a better campus dining experience.</div>
          </div>
        </div>

        {/* 6 Clean Feature Cards Matching User Reference */}
        <div className="features-grid">
          {[
            { IconComponent: Store, title: 'Choose Your Café', desc: 'Order from JEC Cafe or JEC Bytes' },
            { IconComponent: UtensilsCrossed, title: 'Browse Combos', desc: 'Tasty combos curated for you' },
            { IconComponent: CreditCard, title: 'Easy Payment', desc: 'Multiple secure payment options' },
            { IconComponent: Truck, title: 'Order Tracking', desc: 'Stay updated in real-time' },
            { IconComponent: Coffee, title: 'Fast Pickup', desc: 'Quick and convenient campus pickup' },
            { IconComponent: ShieldCheck, title: 'Secure Login', desc: 'Your data stays safe with us' },
          ].map((card, i) => {
            const CardIcon = card.IconComponent;
            return (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '2.2rem 1.25rem',
                  textAlign: 'center',
                  border: '1px solid #ECE7DF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(46, 28, 20, 0.08)';
                  e.currentTarget.style.borderColor = '#1A1816';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#ECE7DF';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#F5EFE6',
                  color: '#2E1C14',
                  margin: '0 auto 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CardIcon size={24} color="#C86D44" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1A1816', marginBottom: '6px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#78716C', margin: 0, lineHeight: 1.45 }}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Section: "OUR CAFÉS / Two Unique Cafés. One Amazing Platform." */}
      <section
        id="our-cafes-section"
        ref={addToRefs}
        className="landing-section reveal-on-scroll"
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#78716C',
              marginBottom: '6px'
            }}>
              — OUR CAFÉS
            </div>
            <h2 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: '2.4rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#1A1816',
              margin: 0
            }}>
              Two Unique Cafés. One Amazing Platform.
            </h2>
          </div>

          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/jeccafe');
              } else {
                setTargetCafeAfterLogin('jeccafe');
                setShowLoginModal(true);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.94rem',
              color: '#1A1816',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span>Learn more about our cafés</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 2 Big Side-by-Side Café Cards (Responsive: single-col on mobile/tablet, 2-col on desktop) */}
        <div className="cafes-grid">
          {/* Card 1: JEC Cafe */}
          <div
            className="cafe-card-inner"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 18px 36px rgba(46, 28, 20, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)';
            }}
          >
            {/* Left Photo with Glowing Neon Sign */}
            <div className="cafe-card-banner" style={{ position: 'relative', height: '100%', minHeight: '260px', overflow: 'hidden', background: '#2E1C14' }}>
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
                alt="JEC Cafe Interior"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(46, 28, 20, 0.85) 0%, rgba(200, 109, 68, 0.4) 100%)'
              }} />
              {/* Neon JEC Café Sign */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#FFE2CC',
                fontFamily: 'var(--font-script)',
                fontSize: '2.5rem',
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: 1,
                textShadow: '0 0 10px rgba(255, 226, 204, 0.9), 0 0 24px rgba(200, 109, 68, 0.85), 0 0 40px rgba(200, 109, 68, 0.5)'
              }}>
                JEC<br />Café
              </div>
            </div>

            {/* Right Details */}
            <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                opacity: 0.07,
                pointerEvents: 'none'
              }}>
                <Coffee size={76} color="#2E1C14" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1816', margin: 0 }}>
                    JEC Cafe
                  </h3>
                  <span style={{
                    background: '#FDF3EE',
                    color: '#C86D44',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    📍 On Campus
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C86D44', marginBottom: '8px' }}>
                  Classic flavours. Everyday favourites.
                </div>

                <p style={{ fontSize: '0.88rem', color: '#68625D', lineHeight: 1.5, margin: 0 }}>
                  A warm and cozy space serving freshly prepared meals, beverages and snacks loved across campus.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleCafeSelection('jeccafe')}
                  className="btn"
                  style={{
                    background: '#1A1816',
                    color: '#FFFFFF',
                    padding: '0.75rem 1.6rem',
                    borderRadius: '30px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(26, 24, 22, 0.15)'
                  }}
                >
                  <span>View Café</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: JEC Bytes */}
          <div
            className="cafe-card-inner"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 18px 36px rgba(12, 56, 62, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)';
            }}
          >
            {/* Left Photo with Glowing Neon Overlay */}
            <div className="cafe-card-banner" style={{ position: 'relative', height: '100%', minHeight: '260px', overflow: 'hidden', background: '#0C383E' }}>
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                alt="JEC Bytes Modern Interior"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82 }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(12, 56, 62, 0.88) 0%, rgba(232, 96, 52, 0.4) 100%)'
              }} />
              {/* Neon JEC Bytes Sign */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.8rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textAlign: 'center',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(232, 96, 52, 0.8), 0 0 35px rgba(232, 96, 52, 0.6)'
              }}>
                JEC Bytes
              </div>
            </div>

            {/* Right Details */}
            <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                opacity: 0.07,
                pointerEvents: 'none'
              }}>
                <UtensilsCrossed size={76} color="#0C383E" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1816', margin: 0 }}>
                    JEC Bytes
                  </h3>
                  <span style={{
                    background: '#FDF1ED',
                    color: '#E86034',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    📍 On Campus
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E86034', marginBottom: '8px' }}>
                  Quick bites. Bold flavours.
                </div>

                <p style={{ fontSize: '0.88rem', color: '#68625D', lineHeight: 1.5, margin: 0 }}>
                  Your go-to spot for delicious quick meals, snacks and refreshing drinks — perfect for busy campus days.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleCafeSelection('jec-bytest')}
                  className="btn"
                  style={{
                    background: '#1A1816',
                    color: '#FFFFFF',
                    padding: '0.75rem 1.6rem',
                    borderRadius: '30px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(26, 24, 22, 0.15)'
                  }}
                >
                  <span>View Café</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: "OUR STORY / Dedicated to JEC Hostellers" */}
      <section
        id="about-story-section"
        ref={addToRefs}
        className="landing-section reveal-on-scroll"
        style={{ paddingBottom: '3.5rem' }}
      >
        <div style={{
          background: '#FFFFFF',
          borderRadius: '32px',
          border: '1.5px solid #EAE5DC',
          boxShadow: '0 12px 36px rgba(46, 28, 20, 0.05)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Top Banner Tag */}
          <div className="story-banner-header" style={{
            background: 'linear-gradient(135deg, #2E1C14 0%, #1A1816 100%)',
            color: '#FFFFFF',
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(200, 109, 68, 0.22)',
                border: '1px solid rgba(200, 109, 68, 0.45)',
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#FFE2CC',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}>
                <GraduationCap size={14} color="#E89B6A" />
                <span>OUR STORY • BUILT FOR JEC HOSTELLERS</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 700,
                color: '#FAF8F5',
                letterSpacing: '-0.03em',
                margin: 0,
                lineHeight: 1.15
              }}>
                Dedicated to Hostellers for Effortless Meal Combos.
              </h2>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '10px 18px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <Heart size={18} color="#E86034" fill="#E86034" />
              <div style={{ fontSize: '0.82rem', color: '#E8DFD3', fontWeight: 600 }}>
                Crafted for Every Student Living on Campus
              </div>
            </div>
          </div>

          {/* Narrative Story Body + 3 Pillars Grid */}
          <div className="story-body-content">
            {/* Story Paragraphs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              paddingBottom: '2.5rem',
              borderBottom: '1px solid #ECE7DF'
            }}>
              <div>
                <p style={{
                  fontSize: '1.08rem',
                  color: '#2E1C14',
                  lineHeight: 1.75,
                  fontWeight: 600,
                  margin: '0 0 1rem'
                }}>
                  Hostel life at Jabalpur Engineering College brings unforgettable memories, late-night hackathons, and tight assignment deadlines — but finding hot, wholesome food on a busy schedule shouldn't be a struggle.
                </p>
                <p style={{
                  fontSize: '0.94rem',
                  color: '#68625D',
                  lineHeight: 1.65,
                  margin: 0
                }}>
                  Between 8:00 AM engineering lab sessions, missing hostel mess timings, or craving fresh, delicious meals after sunset, JEC Dining was born. We created this dedicated platform so every hosteller can access budget-friendly, chef-curated Breakfast, Lunch, High-Tea, and Dinner combos from JECCAFE and JEC Bytes in just a few taps.
                </p>
              </div>

              {/* Hosteller Quote Card */}
              <div style={{
                background: '#FDFBF7',
                borderRadius: '24px',
                padding: '1.75rem 2rem',
                border: '1.5px dashed #DEC9B5',
                position: 'relative'
              }}>
                <div style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '2.8rem',
                  color: '#C86D44',
                  lineHeight: 0.8,
                  marginBottom: '6px'
                }}>
                  “
                </div>
                <div style={{
                  fontSize: '0.96rem',
                  fontStyle: 'italic',
                  color: '#443E38',
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}>
                  "No more standing in canteen rush lines between classes. We pre-order our lunch and tea combos directly from our hostel room, walk down, and pick them up instantly."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#C86D44',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem'
                  }}>
                    JEC
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1A1816' }}>Hosteller Community Voices</div>
                    <div style={{ fontSize: '0.74rem', color: '#78716C' }}>Hostels 1–8 & Girls Hostel Residents</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Hosteller Life Solution Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              margin: '2.5rem 0'
            }}>
              {/* Card 1 */}
              <div style={{
                background: '#FAF8F5',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid #ECE7DF'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FDF3EE',
                  color: '#C86D44',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Clock size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A1816', marginBottom: '6px' }}>
                  Skip The Mess Rush
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#68625D', lineHeight: 1.5, margin: 0 }}>
                  Pre-order freshly made combos while wrapping up lectures or studying. Your food is ready the minute you arrive at the counter.
                </p>
              </div>

              {/* Card 2 */}
              <div style={{
                background: '#FAF8F5',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid #ECE7DF'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#F0F9FF',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <UtensilsCrossed size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A1816', marginBottom: '6px' }}>
                  Student-Friendly Combos
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#68625D', lineHeight: 1.5, margin: 0 }}>
                  Nutritious, high-portion meals designed to keep students energized — crispy dosas, biryani platters, rolls, and refreshing kaapi.
                </p>
              </div>

              {/* Card 3 */}
              <div style={{
                background: '#FAF8F5',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid #ECE7DF'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FDF2F8',
                  color: '#DB2777',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Coffee size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A1816', marginBottom: '6px' }}>
                  Late Study Night Fuel
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#68625D', lineHeight: 1.5, margin: 0 }}>
                  Both cafés serve until 10:00 PM so hostellers can grab evening tea, samosas, burgers, and comfort food without leaving campus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Stats Row */}
      <section
        id="about-section"
        ref={addToRefs}
        className="landing-section reveal-on-scroll"
        style={{ paddingTop: '1rem', paddingBottom: '3rem' }}
      >
        <div className="stats-grid">
          {/* Card 1: Handcrafted */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#F5EFE6',
              color: '#C86D44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1A1816', lineHeight: 1 }}>Handcrafted</div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '4px' }}>Fresh Daily Recipes</div>
            </div>
          </div>

          {/* Card 2: Best Combos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#FDF3EE',
              color: '#C86D44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} color="#C86D44" />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1A1816', lineHeight: 1 }}>Best Combos</div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '4px' }}>Breakfast to Dinner</div>
            </div>
          </div>

          {/* Card 3: Fresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1A1816', lineHeight: 1 }}>Fresh</div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '4px' }}>Quality Ingredients</div>
            </div>
          </div>

          {/* Card 4: Two Cafés */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#FDF1ED',
              color: '#E86034',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1A1816', lineHeight: 1 }}>Two Cafés</div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '4px' }}>One Great Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Warm Artisan Campus Dining Footer (Exact User Mockup) */}
      <footer className="jec-campus-footer">
        {/* Subtle Decorative Botanical Leaves */}
        <BotanicalLeavesLeft />
        <BotanicalLeavesRight />

        {/* Scattered Roasted Coffee Beans Deco */}
        <CoffeeBeansDeco />

        {/* Top-Right Handwritten Script Accent */}
        <div className="footer-handwritten-script">
          <div>Good</div>
          <div style={{ marginRight: '6px' }}>Food</div>
          <div style={{ marginRight: '4px' }}>Brighter</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
            <span>Days</span>
            <span style={{ fontSize: '1.4rem' }}>🤎</span>
          </div>
        </div>

        {/* 4 Professional Columns matching Mockup Grid */}
        <div className="mockup-footer-grid">
          {/* Column 1: Brand & Identity */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <JecDiningFooterCup width={68} height={58} />
              <div>
                <h3 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 'clamp(1.9rem, 2.6vw, 2.4rem)',
                  fontWeight: 800,
                  color: '#1E1813',
                  lineHeight: 1,
                  margin: 0,
                  letterSpacing: '-0.025em'
                }}>
                  JEC Dining
                </h3>
                <div style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#7A543B',
                  letterSpacing: '0.04em',
                  marginTop: '5px'
                }}>
                  — Two Cafés. One Campus. —
                </div>
              </div>
            </div>

            {/* Description matching mockup */}
            <p style={{
              fontSize: '0.88rem',
              color: '#60584F',
              lineHeight: 1.62,
              maxWidth: '380px',
              margin: '1.15rem 0 1.4rem'
            }}>
              JEC Dining brings together JEC Cafe and JEC Bytes in one simple campus dining experience. Discover fresh meals, quick bites, secure ordering, and a smarter way to enjoy food on campus.
            </p>

            {/* Pill Badge: Powered by JCS */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#EFE8DE',
              border: '1px solid #E2D8C9',
              borderRadius: '40px',
              padding: '8px 18px',
              boxShadow: '0 2px 6px rgba(40, 25, 15, 0.04)',
              maxWidth: 'max-content'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#744C2E' }}>
                <Landmark size={20} color="#744C2E" />
                <span style={{ fontSize: '0.9rem', color: '#5A4E44' }}>
                  Powered by <strong style={{ color: '#1E1813', fontWeight: 800 }}>JCS</strong>
                </span>
              </div>
              <div style={{ width: '1.5px', height: '22px', background: '#D5C7B5' }} />
              <div style={{ fontSize: '0.74rem', color: '#685D52', fontWeight: 600, lineHeight: 1.25 }}>
                Building Brighter<br />Campus Experiences
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#1E1813',
              margin: 0
            }}>
              Quick Links
            </h4>
            <div style={{ width: '32px', height: '2.5px', background: '#8B5838', borderRadius: '2px', margin: '7px 0 1.25rem' }} />

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="footer-nav-link"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('our-cafes-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="footer-nav-link"
                >
                  Our Cafés
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('features-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="footer-nav-link"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('hosteller-story-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="footer-nav-link"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => setFooterPolicyModal('support')}
                  className="footer-nav-link"
                >
                  Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#1E1813',
              margin: 0
            }}>
              Legal
            </h4>
            <div style={{ width: '32px', height: '2.5px', background: '#8B5838', borderRadius: '2px', margin: '7px 0 1.25rem' }} />

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button
                  onClick={() => setFooterPolicyModal('privacy')}
                  className="footer-nav-link"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setFooterPolicyModal('terms')}
                  className="footer-nav-link"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setFooterPolicyModal('contact')}
                  className="footer-nav-link"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#1E1813',
              margin: 0
            }}>
              Stay Connected
            </h4>
            <div style={{ width: '32px', height: '2.5px', background: '#8B5838', borderRadius: '2px', margin: '7px 0 1.25rem' }} />

            <p style={{
              fontSize: '0.88rem',
              color: '#60584F',
              lineHeight: 1.55,
              margin: '0 0 1.25rem',
              maxWidth: '340px'
            }}>
              Follow our journey for the latest updates, new menus, and campus dining moments.
            </p>

            {/* 4 Beige Rounded Square Social Media Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a href="#instagram" title="Instagram" className="social-square-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#facebook" title="Facebook" className="social-square-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#youtube" title="YouTube" className="social-square-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              <a href="#linkedin" title="LinkedIn" className="social-square-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>

            {/* Subtle Divider Line */}
            <div style={{ height: '1px', background: '#E2D8C9', margin: '1.4rem 0 1.15rem', width: '100%' }} />

            {/* 3 Contact items row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <a href="mailto:jcs@jecc.ac.in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px', textDecoration: 'none' }}>
                <Headphones size={20} color="#2A211B" style={{ marginBottom: '3px' }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E1813' }}>Get Support</div>
                <div style={{ fontSize: '0.74rem', color: '#746A60', lineHeight: 1.2 }}>We're here to help</div>
              </a>

              <a href="mailto:jcs@jecc.ac.in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px', textDecoration: 'none' }}>
                <Mail size={20} color="#2A211B" style={{ marginBottom: '3px' }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E1813' }}>Email Us</div>
                <div style={{ fontSize: '0.74rem', color: '#746A60', lineHeight: 1.2 }}>jcs@jecc.ac.in</div>
              </a>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                <MapPin size={20} color="#2A211B" style={{ marginBottom: '3px' }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E1813' }}>Find Us</div>
                <div style={{ fontSize: '0.74rem', color: '#746A60', lineHeight: 1.2 }}>On Campus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching Mockup */}
        <div className="footer-bottom-bar-new">
          <div>
            © 2024 JEC Dining. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '32px', height: '1px', background: '#CBBFA' || '#D2C6B6', display: 'inline-block' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.12em', color: '#786F65' }}>
              GOOD FOOD &nbsp;•&nbsp; BRIGHTER DAYS &nbsp;•&nbsp; TOGETHER ON CAMPUS
            </span>
            <span style={{ width: '32px', height: '1px', background: '#D2C6B6', display: 'inline-block' }} />
          </div>
        </div>
      </footer>

      {/* 8. Direct 1-Click Login Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26, 24, 22, 0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            maxWidth: '440px',
            width: '100%',
            padding: '2.25rem',
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
            border: '1px solid #EAE6DF',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#F5F3EF',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: '#57534E',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FDF3EE',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#C86D44',
              marginBottom: '0.85rem'
            }}>
              <LogIn size={13} />
              <span>DIRECT LOGIN • NO SIGNUP NEEDED</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1816', margin: '0 0 0.35rem' }}>
              Welcome to JEC Dining
            </h2>
            <p style={{ color: '#78716C', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Sign in to unlock Breakfast, Lunch, Tea/Snacks, and Dinner combos from {targetCafeAfterLogin === 'jec-bytest' ? 'JEC Bytes' : 'JEC Cafe'}.
            </p>

            <form onSubmit={handleQuickLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email or Username</label>
                <input
                  type="email"
                  className="form-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="customer@jec.ac.in"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn btn-primary btn-full"
                style={{
                  background: '#1A1816',
                  color: '#FFFFFF',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  borderRadius: '14px',
                  fontWeight: 700,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                }}
              >
                {authLoading ? 'Signing In...' : 'Sign In & Unlock Combos'}
              </button>
            </form>

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #ECE7DF',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '8px' }}>
                Instant 1-Click Access:
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('customer@jec.ac.in');
                  setLoginPassword('Customer@2026');
                  handleQuickLogin();
                }}
                className="btn btn-outline btn-full btn-sm"
                style={{ borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', padding: '8px' }}
              >
                ⚡ 1-Click Sign In (Rahul Sharma)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Footer Policy & Helpdesk Info Modal */}
      {footerPolicyModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26, 24, 22, 0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            maxWidth: '480px',
            width: '100%',
            padding: '2.25rem',
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)',
            border: '1px solid #EAE6DF',
            position: 'relative'
          }}>
            <button
              onClick={() => setFooterPolicyModal(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#F5F3EF',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: '#57534E',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FDF3EE',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#8B5838',
              marginBottom: '0.85rem'
            }}>
              <span>JEC DINING CAMPUS POLICIES</span>
            </div>

            <h3 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.55rem',
              fontWeight: 800,
              color: '#1E1813',
              margin: '0 0 0.85rem'
            }}>
              {footerPolicyModal === 'privacy' && 'Privacy Policy'}
              {footerPolicyModal === 'terms' && 'Terms of Service'}
              {footerPolicyModal === 'contact' && 'Contact Campus Dining'}
              {footerPolicyModal === 'support' && 'Student Helpdesk & Support'}
            </h3>

            <div style={{ color: '#5C544B', fontSize: '0.9rem', lineHeight: 1.6, maxHeight: '320px', overflowY: 'auto', paddingRight: '6px' }}>
              {footerPolicyModal === 'privacy' && (
                <div>
                  <p style={{ marginTop: 0 }}>
                    At <strong>JEC Dining</strong>, your privacy and student records are strictly safeguarded. We use your student email (<code>@jec.ac.in</code>) solely to authenticate cafeteria orders, track token numbers, and manage hostel combo allocations.
                  </p>
                  <p>
                    • <strong>No third-party trackers:</strong> Your meal histories and payment data remain confidential on campus servers.<br />
                    • <strong>Security:</strong> All transactions are protected via 256-bit encryption compliant with digital campus standards.
                  </p>
                </div>
              )}

              {footerPolicyModal === 'terms' && (
                <div>
                  <p style={{ marginTop: 0 }}>
                    Welcome to the Jabalpur Engineering College meal booking service.
                  </p>
                  <p>
                    1. <strong>Pre-Orders & Pickup:</strong> Scheduled meal combos must be claimed at JEC Cafe or JEC Bytes within 30 minutes of preparation to guarantee maximum freshness.<br />
                    2. <strong>Cancellations:</strong> Orders may be cancelled up to 15 minutes before the preparation slot begins.<br />
                    3. <strong>Hosteller Courtesy:</strong> Please present your digital order token at the designated express pickup counter.
                  </p>
                </div>
              )}

              {footerPolicyModal === 'contact' && (
                <div>
                  <p style={{ marginTop: 0 }}>
                    <strong>Jabalpur Engineering College (JEC)</strong><br />
                    Gokalpur, Jabalpur, Madhya Pradesh – 482011
                  </p>
                  <div style={{ background: '#F8F4EE', padding: '14px 18px', borderRadius: '14px', border: '1px solid #EBE2D5', marginTop: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#1E1813', marginBottom: '4px' }}>Dining Services Directorate</div>
                    <div>Email: <a href="mailto:jcs@jecc.ac.in" style={{ color: '#8B5838', fontWeight: 600 }}>jcs@jecc.ac.in</a></div>
                    <div style={{ fontSize: '0.8rem', color: '#786F65', marginTop: '6px' }}>Hours: 07:30 AM – 10:00 PM Daily</div>
                  </div>
                </div>
              )}

              {footerPolicyModal === 'support' && (
                <div>
                  <p style={{ marginTop: 0 }}>
                    Need urgent assistance with a combo order or special dietary requirements? Our student dining liaison team is active 7 days a week.
                  </p>
                  <div style={{ background: '#F8F4EE', padding: '14px 18px', borderRadius: '14px', border: '1px solid #EBE2D5', marginTop: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#1E1813', marginBottom: '4px' }}>Hosteller Helpdesk</div>
                    <div>📧 Support Email: <a href="mailto:jcs@jecc.ac.in" style={{ color: '#8B5838', fontWeight: 600 }}>jcs@jecc.ac.in</a></div>
                    <div>📍 Help Desk: East Quad Dining Office, JEC Campus</div>
                    <div>⚡ Online Response: 07:30 AM – 10:00 PM Daily</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setFooterPolicyModal(null)}
                style={{
                  background: '#1E1813',
                  color: '#FAF6F0',
                  border: 'none',
                  padding: '8px 22px',
                  borderRadius: '24px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
