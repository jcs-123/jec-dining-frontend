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
  Moon,
  FileText,
  Menu as MenuIcon
} from 'lucide-react';

// Dedicated Vector Logo Component for JEC Dining (Header / Top Bar)
const JecDiningLogo = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="13" fill="url(#jec_grad)" />
    {/* Stylized Steam */}
    <path d="M18 12C18 12 17 14.5 19 16.5" stroke="#F6E7D2" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M24 10C24 10 23 13.5 25 15.5" stroke="#F6E7D2" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30 12C30 12 29 14.5 31 16.5" stroke="#F6E7D2" strokeWidth="2.2" strokeLinecap="round" />
    {/* Cup Body */}
    <path d="M13 21C13 19.8954 13.8954 19 15 19H31C32.1046 19 33 19.8954 33 21V27C33 31.4183 29.4183 35 25 35H21C16.5817 35 13 31.4183 13 27V21Z" fill="#FAF5ED" />
    {/* Cup Handle */}
    <path d="M33 22.5H35C36.933 22.5 38.5 24.067 38.5 26C38.5 27.933 36.933 29.5 35 29.5H33" stroke="#FAF5ED" strokeWidth="2.4" strokeLinecap="round" />
    {/* Saucer Base */}
    <path d="M11 38.5H37" stroke="#FAF5ED" strokeWidth="2.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="jec_grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#361D11" />
        <stop offset="1" stopColor="#7E4323" />
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
          .header-desktop-auth {
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

        /* Features Section 8-Card Grid (Extra Compact & Sleek) */
        .features-grid-8 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.9rem;
        }
        @media (max-width: 1100px) {
          .features-grid-8 {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
          }
        }
        @media (max-width: 600px) {
          .features-grid-8 {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
        }

        .feature-card-item {
          background: #FFFCF7;
          border: 1.5px solid #EFE6DC;
          border-radius: 16px;
          padding: 1.1rem 1.05rem 0.95rem;
          box-shadow: 0 4px 14px rgba(50, 30, 15, 0.03);
          position: relative;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          cursor: pointer;
        }
        .feature-card-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(138, 88, 56, 0.1);
          border-color: #DFC8B2;
          background: #FFFFFF;
        }
        .feature-card-item:hover .feature-icon-disk {
          transform: scale(1.08) rotate(3deg);
          box-shadow: 0 5px 14px rgba(180, 120, 60, 0.16);
        }
        .feature-card-item:hover .feature-arrow-btn {
          background: #8A522E;
          color: #FFFFFF;
          transform: scale(1.06);
          box-shadow: 0 3px 8px rgba(138, 82, 46, 0.22);
        }

        .feature-icon-halo {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 215, 170, 0.55) 0%, rgba(255, 250, 242, 0) 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.45rem;
          position: relative;
        }
        .feature-icon-disk {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid #EFE1D2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8A522E;
          box-shadow: 0 2px 8px rgba(180, 120, 60, 0.08);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-arrow-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #FAF3E8;
          border: 1px solid #EADBCE;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8A522E;
          margin-left: auto;
          margin-top: auto;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Staggered Scroll Animation for Feature Cards */
        .features-scroll-card {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .is-revealed .features-scroll-card,
        .landing-section.is-revealed .features-scroll-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* Cafes 2-Card Grid (Exact User Mockup) */
        .cafes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.25rem;
        }
        @media (max-width: 1024px) {
          .cafes-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        /* Individual Cafe Card */
        .cafe-card-inner {
          background: #FFFFFF;
          border-radius: 24px;
          border: 1.5px solid #EAE5DC;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(50, 30, 15, 0.05);
          display: grid;
          grid-template-columns: 44% 56%;
          position: relative;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cafe-card-inner:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 42px rgba(46, 28, 20, 0.12);
          border-color: #DFC9B5;
        }
        .cafe-card-inner:hover .cafe-card-banner img {
          transform: scale(1.04);
        }
        .cafe-card-inner:hover .cafe-view-btn {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(35, 20, 10, 0.25);
        }

        .cafe-card-banner {
          position: relative;
          height: 100%;
          min-height: 220px;
          overflow: hidden;
          background: #1E150F;
        }
        .cafe-card-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 680px) {
          .cafe-card-inner {
            grid-template-columns: 1fr;
          }
          .cafe-card-banner {
            min-height: 200px !important;
            height: 200px !important;
          }
        }

        .cafe-view-btn {
          background: #1A120B;
          color: #FFFFFF;
          padding: 8px 20px;
          border-radius: 24px;
          font-weight: 700;
          font-size: 0.86rem;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.25s ease;
        }

        /* ========================================================
           OUR STORY / ABOUT SECTION (EXACT USER MOCKUP & ANIMATIONS)
           ======================================================== */
        .about-section-wrapper {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding: 2.5rem 3rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 2.75rem;
          position: relative;
        }
        @media (max-width: 960px) {
          .about-section-wrapper {
            padding: 2rem 1.75rem 3.5rem;
            gap: 2.25rem;
          }
        }
        @media (max-width: 640px) {
          .about-section-wrapper {
            padding: 1.5rem 1.25rem 2.75rem;
            gap: 1.85rem;
          }
        }

        /* Top Hero Banner */
        .about-top-card {
          background: #1C1008;
          border: 1.5px solid rgba(220, 180, 140, 0.25);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 16px 44px rgba(32, 19, 10, 0.25);
          position: relative;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-top-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 50px rgba(32, 19, 10, 0.32);
        }
        .about-top-banner-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 26px;
        }

        /* Middle 2-Column Grid */
        .about-middle-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
          position: relative;
        }
        @media (max-width: 960px) {
          .about-middle-container {
            grid-template-columns: 1fr;
            gap: 2.25rem;
          }
        }

        /* Quote Card */
        .about-quote-box {
          background: #FFFDF9;
          border: 1.5px dashed #DFC9B4;
          border-radius: 26px;
          padding: 2.25rem 2.25rem 1.85rem;
          box-shadow: 0 10px 30px rgba(50, 32, 15, 0.05);
          position: relative;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-quote-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(50, 32, 15, 0.09);
          border-color: #CCA88B;
        }
        @media (max-width: 480px) {
          .about-quote-box {
            padding: 1.5rem 1.25rem;
          }
        }

        /* 3 Solution Highlights Grid */
        .about-tri-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.65rem;
        }
        @media (max-width: 960px) {
          .about-tri-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        .about-pillar-card {
          background: #FFFCF7;
          border: 1.5px solid #EFE6DC;
          border-radius: 22px;
          padding: 1.85rem 1.65rem 1.65rem;
          box-shadow: 0 6px 20px rgba(50, 30, 15, 0.035);
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        .about-pillar-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 36px rgba(140, 80, 40, 0.12);
          border-color: #DFC8B2;
        }
        .about-pillar-card:hover .about-icon-circle {
          transform: scale(1.08) rotate(4deg);
          box-shadow: 0 6px 18px rgba(74, 38, 16, 0.35);
        }

        .about-icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4A2610 0%, #1A1009 100%);
          border: 2px solid #D59B58;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(74, 38, 16, 0.25);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        /* Scroll Animations */
        .story-scroll-item {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .is-revealed .story-scroll-item,
        .landing-section.is-revealed .story-scroll-item {
          opacity: 1;
          transform: translateY(0);
        }
        .is-revealed .story-item-delay-1,
        .landing-section.is-revealed .story-item-delay-1 {
          transition-delay: 0.12s;
        }
        .is-revealed .story-item-delay-2,
        .landing-section.is-revealed .story-item-delay-2 {
          transition-delay: 0.24s;
        }
        .is-revealed .story-item-delay-3,
        .landing-section.is-revealed .story-item-delay-3 {
          transition-delay: 0.36s;
        }
        .is-revealed .story-item-delay-4,
        .landing-section.is-revealed .story-item-delay-4 {
          transition-delay: 0.48s;
        }

        @keyframes floatHandwritten {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-4px) rotate(-6deg); }
        }
        .anim-float-script {
          animation: floatHandwritten 3.6s ease-in-out infinite;
        }

        @keyframes floatHandwrittenAlt {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-3.5px) rotate(-5deg); }
        }
        .anim-float-script-alt {
          animation: floatHandwrittenAlt 3.8s ease-in-out infinite 0.6s;
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

        /* Support & Helpdesk Luxury Modal */
        .support-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(22, 16, 12, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 120;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          animation: modalFadeIn 0.25s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .support-modal-container {
          background: linear-gradient(175deg, #FFFDF9 0%, #FAF5ED 100%);
          border-radius: 28px;
          max-width: 680px;
          width: 100%;
          padding: 2.4rem 2.6rem 2.1rem;
          box-shadow: 0 30px 70px rgba(35, 20, 10, 0.32);
          border: 1.5px solid #EBE2D5;
          position: relative;
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 640px) {
          .support-modal-container {
            padding: 1.6rem 1.25rem 1.4rem;
            border-radius: 22px;
          }
        }
        .support-close-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #F8F3ED;
          border: 1px solid #EADBCE;
          color: #554A40;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .support-close-btn:hover {
          background: #EFE4D6;
          color: #1A120B;
          transform: rotate(90deg);
        }
        .support-item-row {
          padding: 13px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: background 0.2s ease;
        }
        .support-item-row:hover {
          background: #FDFBF8;
        }
        @media (max-width: 480px) {
          .support-item-row {
            padding: 12px 14px;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
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
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 800, fontSize: '1.36rem', letterSpacing: '-0.02em', color: '#1E140E', lineHeight: 1.1 }}>
              JEC Dining
            </div>
            <div className="landing-header-sub" style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 600 }}>
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
        </nav>

        {/* Right Controls: Desktop Auth + Mobile Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Desktop Only Auth Display (hidden on screens <= 960px) */}
          <div className="header-desktop-auth">
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
            )}
          </div>

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

          {/* Sign In / Login set INSIDE Toggler for Mobile Screens */}
          <div style={{ paddingTop: '0.85rem', marginTop: '0.6rem', borderTop: '1.5px solid #EADBCC' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '1px solid #E5DFD5',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#1A1816'
                }}>
                  <UserCheck size={18} color="#16A34A" />
                  <span>{user?.name || 'Customer'}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/my-orders');
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center', fontWeight: 700, borderRadius: '14px', padding: '10px' }}
                >
                  My Orders
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', color: '#DC2626', fontWeight: 700, borderRadius: '14px' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTargetCafeAfterLogin('jeccafe');
                  setShowLoginModal(true);
                }}
                className="btn"
                style={{
                  background: '#1A1816',
                  color: '#FFFFFF',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  padding: '12px 20px',
                  width: '100%',
                  justifyContent: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26, 24, 22, 0.18)',
                  cursor: 'pointer'
                }}
              >
                <LogIn size={16} />
                <span>Sign In / Login</span>
              </button>
            )}
          </div>
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

      {/* 3. Section: "WHY CHOOSE JEC DINING? / A Smarter Way to Dine on Campus" (Exact User Mockup) */}
      <section
        id="features-section"
        ref={addToRefs}
        className="landing-section reveal-on-scroll"
        style={{ padding: '3.5rem 2.5rem 4.5rem', maxWidth: '1280px', margin: '0 auto', position: 'relative', width: '100%' }}
      >
        {/* Heritage Campus Sketch Decor in Background */}
        <img
          src="/images/about-campus-sketch.png"
          alt=""
          style={{
            position: 'absolute',
            right: '25px',
            top: '15px',
            width: '135px',
            opacity: 0.28,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3rem',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left: Tag & Heading */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9C5B32',
              marginBottom: '8px'
            }}>
              <span style={{ width: '24px', height: '2px', background: '#9C5B32' }} />
              <span>WHY CHOOSE JEC DINING?</span>
            </div>

            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2.1rem, 3.6vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#1A1816',
              margin: 0,
              lineHeight: 1.15
            }}>
              A Smarter Way to<br />
              Dine on Campus
              {/* Golden Sunburst Spark */}
              <span style={{ display: 'inline-block', position: 'relative', marginLeft: '10px', verticalAlign: 'middle' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D59B58" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="2" x2="12" y2="7" />
                  <line x1="20" y1="5" x2="16" y2="9" />
                  <line x1="22" y1="12" x2="17" y2="12" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Center Handwritten Script Accent */}
          <div className="anim-float-script" style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.45rem',
            color: '#9C5B32',
            transform: 'rotate(-6deg)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            userSelect: 'none'
          }}>
            <span>Good Food Brighter Days</span>
            <span style={{ fontSize: '1.1rem' }}>♥</span>
          </div>

          {/* Right: Simple. Secure. Satisfying. */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 800,
              fontSize: '1.3rem',
              color: '#1A1816',
              letterSpacing: '-0.015em',
              marginBottom: '4px'
            }}>
              Simple. Secure. Satisfying.
            </div>
            <div style={{ color: '#685F56', fontSize: '0.92rem' }}>
              Everything you need for a better campus dining experience.
            </div>
          </div>
        </div>

        {/* 8 Feature Cards Matching User Reference Mockup */}
        <div className="features-grid-8">
          {[
            {
              num: '01',
              IconComponent: Store,
              title: 'Choose Your Café',
              desc: 'Order from JEC Cafe or JEC Bytes',
              action: () => {
                const el = document.getElementById('our-cafes-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            },
            {
              num: '02',
              IconComponent: UtensilsCrossed,
              title: 'Browse Combos',
              desc: 'Explore curated meals and combo deals',
              action: () => handleCafeSelection('jeccafe')
            },
            {
              num: '03',
              IconComponent: CreditCard,
              title: 'Easy Payment',
              desc: 'Pay quickly with secure payment options',
              action: () => handleCafeSelection('jeccafe')
            },
            {
              num: '04',
              IconComponent: FileText,
              title: 'Instant Receipt',
              desc: 'Get your digital receipt immediately after payment',
              action: () => navigate(isAuthenticated ? '/my-orders' : '/login')
            },
            {
              num: '05',
              IconComponent: Truck,
              title: 'Order Tracking',
              desc: 'Track your order status in real time',
              action: () => navigate(isAuthenticated ? '/my-orders' : '/login')
            },
            {
              num: '06',
              IconComponent: Clock,
              title: 'Past Orders',
              desc: 'View order history and previous receipts anytime',
              action: () => navigate(isAuthenticated ? '/my-orders' : '/login')
            },
            {
              num: '07',
              IconComponent: Coffee,
              title: 'Fast Pickup',
              desc: 'Quick and convenient campus pickup',
              action: () => handleCafeSelection('jeccafe')
            },
            {
              num: '08',
              IconComponent: ShieldCheck,
              title: 'Secure Login',
              desc: 'Your data and orders stay safe with us',
              action: () => setShowLoginModal(true)
            },
          ].map((item, i) => {
            const CardIcon = item.IconComponent;
            return (
              <div
                key={i}
                className="feature-card-item features-scroll-card"
                style={{ transitionDelay: `${0.06 * (i + 1)}s` }}
                onClick={item.action}
              >
                {/* Number on top-right */}
                <div style={{
                  position: 'absolute',
                  top: '0.65rem',
                  right: '0.75rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#A89F93',
                  letterSpacing: '0.04em'
                }}>
                  {item.num}
                </div>

                {/* Glowing Sunburst Halo Icon Disk */}
                <div className="feature-icon-halo">
                  {/* Subtle Sparkle Accents */}
                  <Sparkles size={7} color="#D59B58" style={{ position: 'absolute', top: '5px', left: '5px', opacity: 0.8 }} />
                  <Sparkles size={8} color="#D59B58" style={{ position: 'absolute', bottom: '6px', right: '5px', opacity: 0.85 }} />

                  <div className="feature-icon-disk">
                    <CardIcon size={17} strokeWidth={2} />
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  color: '#1A1816',
                  margin: '0 0 0.25rem',
                  letterSpacing: '-0.015em'
                }}>
                  {item.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.76rem',
                  color: '#6B6258',
                  lineHeight: 1.4,
                  margin: '0 0 0.65rem',
                  flex: 1
                }}>
                  {item.desc}
                </p>

                {/* Bottom-right Arrow Button */}
                <div className="feature-arrow-btn">
                  <ArrowRight size={11} strokeWidth={2.4} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Handwritten Script + Slogan Divider */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginTop: '3.5rem',
          position: 'relative'
        }}>
          {/* Left: Students Fuel Change */}
          <div className="anim-float-script" style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.4rem',
            color: '#9C5B32',
            transform: 'rotate(-6deg)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            userSelect: 'none'
          }}>
            <span>Students Fuel Change</span>
            <span style={{ fontSize: '1.1rem' }}>♥</span>
          </div>

          {/* Center Slogan Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flex: 1
          }}>
            <span style={{ flex: 1, maxWidth: '120px', height: '1px', background: '#D8C6B2' }} />
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#786F65',
              textTransform: 'uppercase'
            }}>
              GOOD FOOD • BETTER TOMORROWS
            </span>
            <span style={{ flex: 1, maxWidth: '120px', height: '1px', background: '#D8C6B2' }} />
          </div>
        </div>
      </section>

      {/* 4. Section: "OUR CAFÉS / Two Unique Cafés. One Amazing Platform." (Exact User Reference Mockup) */}
      <section
        id="our-cafes-section"
        ref={addToRefs}
        className="landing-section reveal-on-scroll"
        style={{ padding: '3.5rem 2.5rem 4.5rem', maxWidth: '1280px', margin: '0 auto', position: 'relative', width: '100%' }}
      >
        {/* Heritage Campus Sketch Decor behind Right Header */}
        <img
          src="/images/about-campus-sketch.png"
          alt=""
          style={{
            position: 'absolute',
            right: '25px',
            top: '0px',
            width: '135px',
            opacity: 0.28,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.75rem',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9C5B32',
              marginBottom: '8px'
            }}>
              <span style={{ width: '24px', height: '2px', background: '#9C5B32' }} />
              <span>OUR CAFÉS</span>
            </div>

            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2.1rem, 3.6vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#1A1816',
              margin: 0,
              lineHeight: 1.15
            }}>
              Two Unique Cafés. One Amazing Platform.
            </h2>

            {/* Slogan pill row */}
            <div style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#8A7E72',
              textTransform: 'uppercase',
              marginTop: '10px'
            }}>
              GOOD FOOD • BRIGHTER DAYS • A STRONGER CAMPUS
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('about-story-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.96rem',
              color: '#1A1816',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              borderBottom: '2px solid #1A1816',
              paddingBottom: '3px',
              transition: 'color 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8A522E';
              e.currentTarget.style.borderColor = '#8A522E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#1A1816';
              e.currentTarget.style.borderColor = '#1A1816';
            }}
          >
            <span>Learn more about our cafés</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 2 Big Side-by-Side Café Cards (Matching User Mockup) */}
        <div className="cafes-grid">
          {/* Card 1: JEC Cafe */}
          <div className="cafe-card-inner">
            {/* Left Photo with Real Glowing Neon Sign */}
            <div className="cafe-card-banner">
              <img
                src="/images/cafe-jec-neon.png"
                alt="JEC Cafe Interior Dining with Glowing Neon Sign"
              />
            </div>

            {/* Right Details */}
            <div style={{ padding: '1.45rem 1.45rem 1.3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              {/* Coffee cup watermark illustration in bottom-right */}
              <svg style={{ position: 'absolute', bottom: '10px', right: '14px', width: '74px', height: '74px', opacity: 0.22, pointerEvents: 'none' }} viewBox="0 0 100 100" fill="none" stroke="#D6C2AC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M25,40 H65 V65 C65,76 56,85 45,85 C34,85 25,76 25,65 Z" />
                <path d="M65,48 H75 C80,48 84,52 84,57 C84,62 80,66 75,66 H65" />
                <path d="M15,88 H75" />
                <path d="M35,28 Q37,20 35,15" strokeWidth="2" />
                <path d="M45,26 Q47,18 45,13" strokeWidth="2" />
                <path d="M55,28 Q57,20 55,15" strokeWidth="2" />
                <circle cx="20" cy="78" r="4" fill="#D6C2AC" opacity="0.6" stroke="none" />
                <circle cx="16" cy="84" r="3" fill="#D6C2AC" opacity="0.6" stroke="none" />
              </svg>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    background: '#FDF1EB',
                    color: '#C86D44',
                    padding: '3px 11px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    📍 On Campus
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  color: '#1A1816',
                  margin: '0 0 4px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }}>
                  JEC Cafe
                </h3>

                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#9C5B32',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  CLASSIC FLAVOURS. EVERYDAY FAVOURITES.
                </div>

                <p style={{ fontSize: '0.84rem', color: '#68625D', lineHeight: 1.5, margin: 0 }}>
                  A warm and cozy space serving freshly prepared meals, beverages and snacks loved across campus.
                </p>
              </div>

              <div style={{ marginTop: '1.15rem', position: 'relative', zIndex: 2 }}>
                <button
                  onClick={() => handleCafeSelection('jeccafe')}
                  className="cafe-view-btn"
                  style={{
                    background: '#462511',
                    boxShadow: '0 4px 12px rgba(70, 37, 17, 0.22)'
                  }}
                >
                  <span>View Café</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: JEC Bytes */}
          <div className="cafe-card-inner">
            {/* Left Photo with Real Glowing Neon Sign */}
            <div className="cafe-card-banner">
              <img
                src="/images/cafe-bytes-neon.png"
                alt="JEC Bytes Interior with Glowing Neon Sign"
              />
            </div>

            {/* Right Details */}
            <div style={{ padding: '1.45rem 1.45rem 1.3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              {/* Crossed Cutlery watermark illustration in bottom-right */}
              <svg style={{ position: 'absolute', bottom: '10px', right: '14px', width: '74px', height: '74px', opacity: 0.22, pointerEvents: 'none' }} viewBox="0 0 100 100" fill="none" stroke="#D6C2AC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="28" y1="28" x2="72" y2="72" />
                <line x1="72" y1="28" x2="28" y2="72" />
                <path d="M22,22 Q30,20 34,28 L30,32 Z" />
                <path d="M78,22 Q70,20 66,28 L70,32 Z" />
              </svg>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    background: '#FDF1EB',
                    color: '#E86034',
                    padding: '3px 11px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    📍 On Campus
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  color: '#1A1816',
                  margin: '0 0 4px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }}>
                  JEC Bytes
                </h3>

                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#9C5B32',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  QUICK BITES. BOLD FLAVOURS.
                </div>

                <p style={{ fontSize: '0.84rem', color: '#68625D', lineHeight: 1.5, margin: 0 }}>
                  Your go-to spot for delicious quick meals, snacks and refreshing drinks — perfect for busy campus days.
                </p>
              </div>

              <div style={{ marginTop: '1.15rem', position: 'relative', zIndex: 2 }}>
                <button
                  onClick={() => handleCafeSelection('jec-bytest')}
                  className="cafe-view-btn"
                  style={{
                    background: '#1A120B',
                    boxShadow: '0 4px 12px rgba(26, 18, 11, 0.22)'
                  }}
                >
                  <span>View Café</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slogan Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '3.5rem'
        }}>
          <span style={{ width: '60px', height: '1px', background: '#D8C6B2' }} />
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#786F65',
            textTransform: 'uppercase'
          }}>
            GOOD FOOD • BETTER TOMORROWS
          </span>
          <span style={{ width: '60px', height: '1px', background: '#D8C6B2' }} />
        </div>
      </section>

      {/* 5. Section: "OUR STORY / Dedicated to JEC Hostellers" (Exact User Reference Design) */}
      <section
        id="about-story-section"
        ref={addToRefs}
        className="landing-section reveal-on-scroll"
        style={{ paddingBottom: '3.5rem', position: 'relative' }}
      >
        <div id="about-section" style={{ position: 'absolute', top: '-70px' }} />

        <div className="about-section-wrapper">
          {/* 1. Top Hero Banner: Luxury Espresso Card with Seamless HD Banner */}
          <div className="about-top-card story-scroll-item story-item-delay-1">
            <img
              src="/images/about-top-banner.png"
              alt="Dedicated to Hostellers for Effortless Meal Combos - Built for JEC Hostellers at Jyothi Engineering College"
              className="about-top-banner-img"
            />
          </div>

          {/* 2. Middle Section: Campus Architecture Story + Real Voices Quote Card */}
          <div className="about-middle-container story-scroll-item story-item-delay-2">
            {/* Left Column: Campus Life Story with Architectural Clock Tower Sketch */}
            <div style={{ position: 'relative', paddingLeft: '10px' }}>
              {/* JEC Heritage Architectural Clock Tower Watermark */}
              <img
                src="/images/about-campus-sketch.png"
                alt="Jyothi Engineering College Heritage Tower"
                style={{
                  position: 'absolute',
                  left: '-28px',
                  top: '-10px',
                  width: '135px',
                  opacity: 0.45,
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              />

              <div style={{ position: 'relative', zIndex: 1, paddingLeft: '2.5rem' }}>
                {/* Subtitle tag with decorative divider lines */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#9C5B32',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ width: '28px', height: '2px', background: '#9C5B32' }} />
                  <span>OUR STORY</span>
                  <span style={{ width: '28px', height: '2px', background: '#9C5B32' }} />
                </div>

                {/* Editorial Heading */}
                <h3 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 'clamp(1.8rem, 2.7vw, 2.45rem)',
                  fontWeight: 800,
                  color: '#1A1816',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.18,
                  margin: '0 0 1.25rem'
                }}>
                  Hostel Life at Jyothi<br />
                  Engineering College,{' '}
                  <span style={{ fontStyle: 'italic', color: '#9C5B32', fontWeight: 600 }}>
                    Made Better.
                  </span>
                </h3>

                {/* Story Paragraph 1 */}
                <p style={{
                  fontSize: '0.96rem',
                  color: '#4A423A',
                  lineHeight: 1.72,
                  margin: '0 0 1rem',
                  fontWeight: 500
                }}>
                  Between 8:00 AM engineering lab sessions, late-night hackathons, and tight assignment deadlines, hostel life at Jyothi Engineering College is full of unforgettable moments — and even tighter schedules.
                </p>

                {/* Story Paragraph 2 */}
                <p style={{
                  fontSize: '0.94rem',
                  color: '#685F56',
                  lineHeight: 1.68,
                  margin: 0
                }}>
                  JEC Dining was created to make everyday meals simple, convenient, and enjoyable. Through JEC Cafe and JEC Bytes, we bring fresh, wholesome breakfast, lunch, high-tea, and dinner combos to hostellers — delicious food, great taste, and a better campus dining experience, all in one place.
                </p>
              </div>
            </div>

            {/* Right Column: Real Voices Quote Card */}
            <div className="about-quote-box">
              {/* Header row: Quotation Badge + REAL VOICES. HAPPIER DAYS. */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#9C5B32',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontFamily: 'serif',
                  lineHeight: 1
                }}>
                  ❝
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#8E7D6F',
                  textTransform: 'uppercase'
                }}>
                  REAL VOICES. HAPPIER DAYS.
                </div>
              </div>

              {/* Quote Text */}
              <p style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '1.05rem',
                color: '#2B221B',
                lineHeight: 1.65,
                margin: '0 0 1.25rem'
              }}>
                “No more standing in canteen rush lines between classes. We pre-order our lunch and tea combos directly from our hostel room, walk down, and pick them up instantly.”
              </p>

              {/* Subtle Divider Line */}
              <div style={{ width: '100%', height: '1px', background: '#ECE1D4', margin: '1.1rem 0' }} />

              {/* Author Footer & Handwritten Script Accent */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#9C5B32',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1A1816' }}>
                      Hosteller Community Voices
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#7A7065' }}>
                      Hostellers • JEC Cafe • JEC Bytes
                    </div>
                  </div>
                </div>

                <div className="anim-float-script" style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1.35rem',
                  color: '#9C5B32',
                  transform: 'rotate(-6deg)',
                  textAlign: 'right',
                  lineHeight: 1.1,
                  userSelect: 'none'
                }}>
                  Students<br />Fuel Change ♥
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom 3 Highlight Solution Cards */}
          <div className="about-tri-grid story-scroll-item story-item-delay-3">
            {/* Card 1: Skip the Mess Rush */}
            <div className="about-pillar-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.85rem' }}>
                <div className="about-icon-circle">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#1A1816',
                    margin: 0
                  }}>
                    Skip the Mess Rush
                  </h4>
                  <div style={{ width: '32px', height: '2.5px', background: '#D59B58', borderRadius: '2px', marginTop: '5px' }} />
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#685F56', lineHeight: 1.62, margin: 0 }}>
                Pre-order fresh, hot meal combos while attending lectures or studying. Your food is ready the minute you arrive at the counter.
              </p>
              {/* Botanical watermark */}
              <svg style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '68px', height: '68px', opacity: 0.12, pointerEvents: 'none' }} viewBox="0 0 100 100" fill="#9C5B32">
                <path d="M10,90 C30,40 70,30 90,10 C70,50 50,70 10,90 Z" />
              </svg>
            </div>

            {/* Card 2: Student-Friendly Combos */}
            <div className="about-pillar-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.85rem' }}>
                <div className="about-icon-circle">
                  <UtensilsCrossed size={24} />
                </div>
                <div>
                  <h4 style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#1A1816',
                    margin: 0
                  }}>
                    Student-Friendly Combos
                  </h4>
                  <div style={{ width: '32px', height: '2.5px', background: '#D59B58', borderRadius: '2px', marginTop: '5px' }} />
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#685F56', lineHeight: 1.62, margin: 0 }}>
                Nutritious, high-portion meals designed to keep students energized — from biryani platters and rolls to samosas, burgers, and refreshing kaapi.
              </p>
              {/* Botanical watermark */}
              <svg style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '68px', height: '68px', opacity: 0.12, pointerEvents: 'none' }} viewBox="0 0 100 100" fill="#9C5B32">
                <path d="M10,90 C30,40 70,30 90,10 C70,50 50,70 10,90 Z" />
              </svg>
            </div>

            {/* Card 3: Late Study Night Fuel */}
            <div className="about-pillar-card" style={{ position: 'relative' }}>
              {/* Late Night Golden Moon Accent */}
              <div style={{ position: 'absolute', top: '18px', right: '20px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Moon size={22} color="#D59B58" fill="#F4D29D" opacity={0.85} />
                <Sparkles size={14} color="#D59B58" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.85rem' }}>
                <div className="about-icon-circle">
                  <Coffee size={24} />
                </div>
                <div>
                  <h4 style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#1A1816',
                    margin: 0
                  }}>
                    Late Study Night Fuel
                  </h4>
                  <div style={{ width: '32px', height: '2.5px', background: '#D59B58', borderRadius: '2px', marginTop: '5px' }} />
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#685F56', lineHeight: 1.62, margin: '0 0 1rem' }}>
                Both cafés serve until 7:00 PM, so hostellers can grab evening tea, snacks, and comfort food without leaving campus.
              </p>

              {/* Handwritten Script Accent: Good Food Better Tomorrows ♥ */}
              <div className="anim-float-script-alt" style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.18rem',
                color: '#9C5B32',
                textAlign: 'right',
                transform: 'rotate(-5deg)',
                userSelect: 'none',
                marginTop: 'auto'
              }}>
                Good Food Better Tomorrows ♥
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
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#facebook" title="Facebook" className="social-square-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#youtube" title="YouTube" className="social-square-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
              <a href="#linkedin" title="LinkedIn" className="social-square-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>

            {/* Subtle Divider Line */}
            <div style={{ height: '1px', background: '#E2D8C9', margin: '1.4rem 0 1.15rem', width: '100%' }} />

            {/* 3 Contact items row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setFooterPolicyModal('support')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '3px',
                  padding: 0
                }}
              >
                <Headphones size={20} color="#2A211B" style={{ marginBottom: '3px' }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E1813' }}>Get Support</div>
                <div style={{ fontSize: '0.74rem', color: '#746A60', lineHeight: 1.2 }}>We're here to help</div>
              </button>

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
        <div
          className="support-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFooterPolicyModal(null);
          }}
        >
          <div className="support-modal-container">
            {/* Top-right Botanical Accent Flourish */}
            <svg
              style={{ position: 'absolute', top: '14px', right: '66px', width: '92px', height: '92px', opacity: 0.18, pointerEvents: 'none' }}
              viewBox="0 0 100 100" fill="none" stroke="#9C5B32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M75 15 C60 30, 45 60, 40 85" />
              <path d="M68 22 C64 16, 52 18, 54 26 C56 32, 65 30, 68 22 Z" fill="#9C5B32" fillOpacity="0.3" />
              <path d="M58 35 C52 30, 42 34, 45 42 C47 47, 56 44, 58 35 Z" fill="#9C5B32" fillOpacity="0.3" />
              <path d="M49 50 C42 46, 32 50, 36 58 C39 63, 47 60, 49 50 Z" fill="#9C5B32" fillOpacity="0.3" />
            </svg>

            {/* Bottom-left Botanical Accent */}
            <svg
              style={{ position: 'absolute', bottom: '14px', left: '16px', width: '46px', height: '46px', opacity: 0.24, pointerEvents: 'none' }}
              viewBox="0 0 60 60" fill="none" stroke="#9C5B32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M10 50 C20 40, 35 25, 48 12" />
              <path d="M22 38 C18 32, 24 24, 30 26 C34 28, 32 36, 22 38 Z" fill="#9C5B32" fillOpacity="0.3" />
              <path d="M34 26 C30 20, 36 14, 42 16 C46 18, 44 24, 34 26 Z" fill="#9C5B32" fillOpacity="0.3" />
            </svg>

            {/* Modal Header: Badge, Title & Handwritten Accent */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Pill Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: '#FDF1EB',
                  border: '1px solid #F0DAC9',
                  padding: '5px 14px',
                  borderRadius: '24px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#8B5838',
                  letterSpacing: '0.06em',
                  marginBottom: '0.85rem'
                }}>
                  <Headphones size={15} color="#8B5838" />
                  <span>JEC DINING CAMPUS POLICIES</span>
                </div>

                {/* Main Heading */}
                <h3 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '2.05rem',
                  fontWeight: 800,
                  color: '#1A1816',
                  letterSpacing: '-0.02em',
                  margin: '0 0 0.55rem',
                  lineHeight: 1.15
                }}>
                  {footerPolicyModal === 'privacy' && 'Privacy Policy'}
                  {footerPolicyModal === 'terms' && 'Terms of Service'}
                  {footerPolicyModal === 'contact' && 'Contact Campus Dining'}
                  {footerPolicyModal === 'support' && 'Student Helpdesk & Support'}
                </h3>

                {/* Subtitle */}
                <p style={{
                  color: '#685F56',
                  fontSize: '0.93rem',
                  lineHeight: 1.55,
                  margin: 0,
                  maxWidth: '430px'
                }}>
                  {footerPolicyModal === 'support' &&
                    'Need urgent assistance with a combo order or special dietary requirements? Our student dining liaison team is active 7 days a week.'}
                  {footerPolicyModal === 'contact' &&
                    'Official dining administration and service support for all Jyothi Engineering College campus diners.'}
                  {footerPolicyModal === 'privacy' &&
                    'Safeguarding your student meal credentials and order history on campus servers.'}
                  {footerPolicyModal === 'terms' &&
                    'Guidelines governing pre-orders, token pickups, and hostel meal allotments.'}
                </p>
              </div>

              {/* Right Column: Close Button & Handwritten Stamp */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.65rem', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setFooterPolicyModal(null)}
                  className="support-close-btn"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                <div style={{ textAlign: 'right', userSelect: 'none', marginTop: '0.2rem' }}>
                  <div style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1.55rem',
                    lineHeight: 1.05,
                    color: '#9C5B32',
                    fontWeight: 700,
                    transform: 'rotate(-5deg)',
                    marginBottom: '5px'
                  }}>
                    Good Food<br />Brighter Days
                  </div>
                  <div style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.14em',
                    color: '#A39688',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    lineHeight: 1.3
                  }}>
                    JEC DINING<br />WITH YOU ALWAYS
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body Container */}
            {footerPolicyModal === 'support' ? (
              <div style={{
                background: '#FAF6EE',
                border: '1.5px solid #EADBCE',
                borderRadius: '22px',
                padding: '1.25rem 1.25rem 1.15rem',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7)',
                position: 'relative',
                zIndex: 2
              }}>
                {/* Hosteller Helpdesk Title & 7 Days a Week Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <Users size={22} color="#8A522E" strokeWidth={2.2} />
                    <h4 style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: '1.28rem',
                      fontWeight: 800,
                      color: '#1A1816',
                      margin: 0
                    }}>
                      Hosteller Helpdesk
                    </h4>
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#EEF7EF',
                    border: '1px solid #D1EBD4',
                    color: '#166534',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
                    <span>7 Days a Week</span>
                  </div>
                </div>

                {/* White Inner Contact Rows */}
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #EFE6DC',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(35, 20, 10, 0.03)'
                }}>
                  {/* Row 1: Support Email */}
                  <div className="support-item-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#FAF3EA',
                        border: '1px solid #EADAC8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Mail size={19} color="#9C5B32" strokeWidth={2} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#8A7E73', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '2px' }}>
                          SUPPORT EMAIL
                        </div>
                        <a
                          href="mailto:jcs@jecc.ac.in"
                          style={{ color: '#8A4F2A', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', letterSpacing: '-0.01em' }}
                        >
                          jcs@jecc.ac.in
                        </a>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#766D64', fontWeight: 500 }}>
                      We're here to help!
                    </div>
                  </div>

                  <div style={{ height: '1px', background: '#F2EBE1', margin: '0 16px' }} />

                  {/* Row 2: Help Desk Location */}
                  <div className="support-item-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#FAF3EA',
                        border: '1px solid #EADAC8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <MapPin size={19} color="#9C5B32" strokeWidth={2} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#8A7E73', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '2px' }}>
                          HELP DESK
                        </div>
                        <div style={{ color: '#221D19', fontWeight: 700, fontSize: '0.96rem' }}>
                          East Quad Dining Office, JEC Campus
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#766D64', fontWeight: 500 }}>
                      Visit us on campus
                    </div>
                  </div>

                  <div style={{ height: '1px', background: '#F2EBE1', margin: '0 16px' }} />

                  {/* Row 3: Online Response Timing */}
                  <div className="support-item-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#FAF3EA',
                        border: '1px solid #EADAC8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Clock size={19} color="#9C5B32" strokeWidth={2} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#8A7E73', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '2px' }}>
                          ONLINE RESPONSE
                        </div>
                        <div style={{ color: '#221D19', fontWeight: 700, fontSize: '0.96rem' }}>
                          07:30 AM – 7:00 PM Daily
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#766D64', fontWeight: 500 }}>
                      Quick & Friendly Support
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#FAF6EE',
                border: '1.5px solid #EADBCE',
                borderRadius: '22px',
                padding: '1.35rem',
                maxHeight: '300px',
                overflowY: 'auto',
                color: '#5C544B',
                fontSize: '0.9rem',
                lineHeight: 1.62,
                position: 'relative',
                zIndex: 2
              }}>
                {footerPolicyModal === 'privacy' && (
                  <div>
                    <p style={{ marginTop: 0 }}>
                      At <strong>JEC Dining</strong>, student privacy is strictly safeguarded. Your institutional credentials (<code>@jecc.ac.in</code>) are utilized exclusively for cafeteria order authentication, express token issuance, and hostel combo records.
                    </p>
                    <p>
                      • <strong>Strictly Local & Confidential:</strong> Meal tokens and payment verifications stay within secured college systems without external trackers.<br />
                      • <strong>Security Standard:</strong> Data transmitted is encrypted with modern 256-bit TLS protocol.
                    </p>
                  </div>
                )}

                {footerPolicyModal === 'terms' && (
                  <div>
                    <p style={{ marginTop: 0 }}>
                      Welcome to the Jyothi Engineering College dining booking platform.
                    </p>
                    <p>
                      1. <strong>Pre-Orders & Pickup:</strong> Scheduled meal combos must be claimed at JEC Cafe or JEC Bytes within 30 minutes of preparation to ensure peak taste and freshness.<br />
                      2. <strong>Cancellations:</strong> Orders may be cancelled up to 15 minutes before the food preparation slot begins.<br />
                      3. <strong>Hosteller Token:</strong> Present your digital order QR or token code at the designated counter.
                    </p>
                  </div>
                )}

                {footerPolicyModal === 'contact' && (
                  <div>
                    <p style={{ marginTop: 0 }}>
                      <strong>Jyothi Engineering College (JECC)</strong><br />
                      Jyothi Hills, Panjal Road, Cheruthuruthy, Kerala – 679531
                    </p>
                    <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '14px', border: '1px solid #EAE1D4', marginTop: '12px' }}>
                      <div style={{ fontWeight: 800, color: '#1E1813', marginBottom: '4px' }}>Dining Services Directorate</div>
                      <div>Support Email: <a href="mailto:jcs@jecc.ac.in" style={{ color: '#8B5838', fontWeight: 700 }}>jcs@jecc.ac.in</a></div>
                      <div style={{ fontSize: '0.82rem', color: '#786F65', marginTop: '6px' }}>Service Hours: 07:30 AM – 7:00 PM Daily</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Bottom Bar */}
            <div style={{
              marginTop: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <Leaf size={16} color="#9C5B32" style={{ transform: 'rotate(-20deg)', opacity: 0.8, flexShrink: 0 }} />
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#786F65', fontStyle: 'italic', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  GOOD FOOD &nbsp;•&nbsp; BETTER STUDENTS &nbsp;•&nbsp; BRIGHTER DAYS
                </span>
                <span style={{ display: 'inline-block', width: '38px', height: '1px', background: '#D6C8B8', marginLeft: '6px', flexShrink: 0 }} />
              </div>

              <button
                type="button"
                onClick={() => setFooterPolicyModal(null)}
                style={{
                  background: '#1A120B',
                  color: '#FFFFFF',
                  borderRadius: '30px',
                  padding: '10px 26px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26, 18, 11, 0.25)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2E1E12'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1A120B'}
              >
                <span>Close</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
