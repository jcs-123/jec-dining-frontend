import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { useCafe } from '../../context/CafeContext';
import { useCart } from '../../context/CartContext';
import { ComboCard } from '../../components/combos/ComboCard';
import { Search, Filter, Sparkles, MapPin, Clock, ArrowLeft, ArrowLeftRight, Calendar, Star, Coffee, Zap, ChevronRight, Flame, UtensilsCrossed, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const CafeMenuPage = () => {
  const { cafeSlug } = useParams();
  const { selectCafeBySlug } = useCafe();
  const { addItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [cafe, setCafe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date fulfillment & scheduling
  const [menuActiveDate, setMenuActiveDate] = useState('Today');
  const datePickerRef = useRef(null);

  const handleOpenDatePicker = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (datePickerRef.current) {
      try {
        if (typeof datePickerRef.current.showPicker === 'function') {
          datePickerRef.current.showPicker();
        } else {
          datePickerRef.current.focus();
        }
      } catch (err) {
        try {
          datePickerRef.current.focus();
        } catch {}
      }
    }
  };

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'nonveg'

  // Modal customizer state
  const [selectedComboForCustomizer, setSelectedComboForCustomizer] = useState(null);

  useEffect(() => {
    let active = true;
    const slug = cafeSlug || location.pathname.replace(/^\//, '').split('/')[0] || 'jeccafe';
    if (slug) {
      setSelectedCategory('all');
      setSearchQuery('');
      setVegFilter('all');
      setCombos([]);
      setCategories([]);

      const load = async () => {
        try {
          setLoading(true);
          selectCafeBySlug(slug);

          const [cafeRes, catRes, comboRes] = await Promise.all([
            api.get(`/cafes/${slug}`),
            api.get(`/categories/cafe/${slug}`),
            api.get(`/combos/cafe/${slug}`)
          ]);

          if (!active) return;
          if (cafeRes.success) setCafe(cafeRes.cafe);
          if (catRes.success) setCategories(catRes.categories || []);
          if (comboRes.success) setCombos(comboRes.combos || []);
        } catch (err) {
          if (active) console.error('Failed to load menu:', err);
        } finally {
          if (active) setLoading(false);
        }
      };

      load();
    }

    return () => {
      active = false;
    };
  }, [location.pathname, cafeSlug]);

  // Filter combos in memory or fetch
  const filteredCombos = combos.filter((combo) => {
    // Category check
    if (selectedCategory !== 'all') {
      const cId = combo.categoryId?._id || combo.categoryId;
      if (cId !== selectedCategory) return false;
    }

    // Veg check
    if (vegFilter === 'veg' && !combo.isVeg) return false;
    if (vegFilter === 'nonveg' && combo.isVeg) return false;

    // Search check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = combo.name.toLowerCase().includes(q);
      const matchDesc = combo.description?.toLowerCase().includes(q);
      const matchTags = (combo.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  const handleQuickAdd = (combo, scheduledDate) => {
    const targetDate = scheduledDate || menuActiveDate || 'Today';
    addItem(cafe, combo, 1, [], targetDate);
  };

  const isJeccafe = (cafeSlug === 'jeccafe') || (!cafeSlug && !(cafe?.slug || '').includes('byte'));
  const bannerBg = isJeccafe ? '#1B0E09' : '#052F31';
  const copperAccent = '#D66C3E';
  const softBorder = '#E8DDD2';

  const formatShortDate = (dateVal) => {
    if (!dateVal || dateVal === 'Today' || dateVal === 'Tomorrow') return dateVal;
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
    } catch {}
    return dateVal;
  };

  return (
    <div className="cafe-page-wrapper">
      <div className="cafe-container">
        {/* ========================================================
            SECTION 2: CAFÉ INFORMATION BANNER
            ======================================================== */}
        {/* ========================================================
            SECTION 2: ULTRA-PREMIUM CAFÉ HERO BANNER & ARTWORK
            ======================================================== */}
        {cafe && (
          <section className="cafe-section cafe-banner-card cafe-banner-editorial scroll-animate-fade-up scroll-delay-1">
            <div className="cafe-banner-editorial-inner">
              {/* Left Column: Rich Typography, Badges & Features */}
              <div className="banner-editorial-info">
                {/* Top Badges Row */}
                <div className="banner-badge-row">
                  <span className={`banner-min-status ${cafe.isOpen ? 'is-open' : 'is-closed'}`}>
                    <span className="status-dot" />
                    {cafe.isOpen ? 'OPEN NOW' : 'CLOSED'}
                  </span>
                  <span className="banner-editorial-chip quality-chip">
                    <Award size={12} color="#D66C3E" />
                    <span>Best Quality Food</span>
                  </span>
                </div>

                {/* Main Café Heading */}
                <div className="banner-editorial-title-row">
                  <h1 className="banner-editorial-title">{cafe.name}</h1>
                </div>

                {/* Subtitle / Tagline */}
                <p className="banner-editorial-tagline">
                  {cafe.tagline || (isJeccafe ? 'Authentic South Indian Delicacies & Filter Coffee Combos' : 'Smoky Charcoal Alfaham, Arabian Mandi & Chilled Pepsi')}
                </p>

                {/* Editorial Feature Set Chips (Real SVG Icons, No Dummy Emojis) */}
                <div className="banner-features-set">
                  {isJeccafe ? (
                    <>
                      <span className="feature-pill">
                        <UtensilsCrossed size={12} color="#D66C3E" />
                        <span>Crispy Masala Dosa</span>
                      </span>
                      <span className="feature-pill">
                        <Sparkles size={12} color="#D66C3E" />
                        <span>Golden Medu Vada & Chutneys</span>
                      </span>
                      <span className="feature-pill">
                        <Coffee size={12} color="#D66C3E" />
                        <span>Authentic Filter Coffee</span>
                      </span>
                      <span className="feature-pill">
                        <Award size={12} color="#D66C3E" />
                        <span>South Indian Bistro</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="feature-pill">
                        <Flame size={12} color="#D66C3E" />
                        <span>Charcoal Grilled Alfaham</span>
                      </span>
                      <span className="feature-pill">
                        <UtensilsCrossed size={12} color="#D66C3E" />
                        <span>Spiced Arabian Mandi Rice</span>
                      </span>
                      <span className="feature-pill">
                        <Sparkles size={12} color="#D66C3E" />
                        <span>Chilled Pepsi & Sips</span>
                      </span>
                      <span className="feature-pill">
                        <Zap size={12} color="#D66C3E" />
                        <span>Speedy Counter Pickup</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Metadata Row: Hours & Location */}
                <div className="banner-editorial-meta">
                  <span className="meta-item">
                    <Clock size={13} color="#D66C3E" />
                    <span>{cafe.openingHours || '07:00 AM – 07:00 PM'}</span>
                  </span>
                  <span className="meta-sep">•</span>
                  <span className="meta-item">
                    <MapPin size={13} color="#D66C3E" />
                    <span>{cafe.address || 'Central Plaza, JEC Campus'}</span>
                  </span>
                  <span className="meta-sep">•</span>
                  <span className="meta-item meta-highlight">
                    <Sparkles size={13} color="#D66C3E" />
                    <span>Hand-Crafted Campus Combos</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Generated Artwork Presentation Frame */}
              <div className="banner-editorial-artwork-wrapper">
                <div className="banner-editorial-artwork-frame">
                  <img
                    src={isJeccafe
                      ? "/images/jeccafe_hero_artwork.jpg"
                      : "/images/jecbytes_hero_artwork.jpg"
                    }
                    alt={`${cafe.name} signature experience`}
                    className="banner-editorial-artwork-img"
                    onError={(e) => {
                      e.target.src = isJeccafe
                        ? "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                        : "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="banner-artwork-gradient-overlay" />
                  <div className="banner-artwork-badge">
                    {isJeccafe ? <Coffee size={13} color="#D66C3E" /> : <Flame size={13} color="#D66C3E" />}
                    <span>{isJeccafe ? 'Specialty Masala Dosa, Vada & Filter Coffee' : 'Smoky Charcoal Alfaham, Mandi & Pepsi'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            SECTION 3: SEARCH AND FOOD-TYPE FILTERS
            ======================================================== */}
        <section className="cafe-section scroll-animate-fade-up scroll-delay-2" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          {/* Search field occupying available space */}
          <div style={{
            position: 'relative',
            flex: '1 1 240px',
            maxWidth: '520px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#756B65'
            }} />
            <input
              type="text"
              placeholder="Search combos, flavors, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 1rem 0 44px',
                borderRadius: '24px',
                border: `1.5px solid ${softBorder}`,
                background: '#FFFFFF',
                color: '#211712',
                fontSize: '0.88rem',
                outline: 'none',
                boxShadow: '0 1px 4px rgba(33, 23, 18, 0.04)',
                boxSizing: 'border-box',
                transition: 'border-color var(--transition-fast)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = copperAccent;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = softBorder;
              }}
            />
          </div>

          {/* Right: Food-Type Filters (All Items, Veg Only, Non-Veg) */}
          <div className="food-filter-container">
            <button
              onClick={() => setVegFilter('all')}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '20px',
                border: vegFilter === 'all' ? '1.5px solid #1A1816' : '1.5px solid #EADBCC',
                background: vegFilter === 'all' ? '#1A1816' : '#FFFFFF',
                color: vegFilter === 'all' ? '#FFFFFF' : '#4A423B',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
                boxShadow: vegFilter === 'all' ? '0 2px 8px rgba(26, 24, 22, 0.2)' : 'none'
              }}
            >
              All Items
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              style={{
                height: '36px',
                padding: '0 14px',
                borderRadius: '20px',
                border: vegFilter === 'veg' ? '1.5px solid #86EFAC' : '1.5px solid #EADBCC',
                background: vegFilter === 'veg' ? '#DCFCE7' : '#FFFFFF',
                color: vegFilter === 'veg' ? '#15803D' : '#4A423B',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setVegFilter('nonveg')}
              style={{
                height: '36px',
                padding: '0 14px',
                borderRadius: '20px',
                border: vegFilter === 'nonveg' ? '1.5px solid #FCA5A5' : '1.5px solid #EADBCC',
                background: vegFilter === 'nonveg' ? '#FEE2E2' : '#FFFFFF',
                color: vegFilter === 'nonveg' ? '#DC2626' : '#4A423B',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#DC2626' }} />
              <span>Non-Veg</span>
            </button>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: GLOBAL MEAL-DATE SELECTOR
            ======================================================== */}
        <section className="cafe-section meal-date-selector-card scroll-animate-fade-up scroll-delay-3" style={{
          background: '#FFFFFF',
          border: '1.5px solid #EADBCC',
          borderRadius: '18px',
          boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
        }}>
          {/* Left: Icon & Description */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#FAF6F0',
              color: copperAccent,
              border: '1.5px solid #EADBCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Calendar size={18} />
            </div>
            <div>
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.02rem',
                fontWeight: 800,
                color: '#1E140E',
                marginBottom: '2px'
              }}>
                Select Meal Date & Add Combos
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7A6E63', fontWeight: 500 }}>
                Select an active date below or pick dates on individual combos!
              </div>
            </div>
          </div>

          {/* Right: Date Controls (Unified Segmented Tabs: Today, Tomorrow, Other Date) */}
          <div className="meal-date-selector-tabs">
            <button
              type="button"
              className={`meal-date-tab ${menuActiveDate === 'Today' ? 'active' : ''}`}
              onClick={() => setMenuActiveDate('Today')}
            >
              <Calendar size={13} />
              <span>Today</span>
            </button>

            <button
              type="button"
              className={`meal-date-tab ${menuActiveDate === 'Tomorrow' ? 'active' : ''}`}
              onClick={() => setMenuActiveDate('Tomorrow')}
            >
              <Calendar size={13} />
              <span>Tomorrow</span>
            </button>

            <button
              type="button"
              className={`meal-date-tab meal-date-custom-tab ${menuActiveDate !== 'Today' && menuActiveDate !== 'Tomorrow' ? 'active' : ''}`}
              onClick={handleOpenDatePicker}
              title="Pick custom meal date"
            >
              <Calendar size={13} />
              <span>
                {menuActiveDate !== 'Today' && menuActiveDate !== 'Tomorrow'
                  ? formatShortDate(menuActiveDate)
                  : 'Other Date'}
              </span>
              <input
                ref={datePickerRef}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={menuActiveDate !== 'Today' && menuActiveDate !== 'Tomorrow' ? menuActiveDate : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setMenuActiveDate(e.target.value);
                    toast.success(`Meal scheduled for ${formatShortDate(e.target.value)}`);
                  }
                }}
                className="meal-date-hidden-input"
                tabIndex={-1}
                aria-hidden="true"
              />
            </button>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: COMBO CATEGORY NAVIGATION
            ======================================================== */}
        <section className="cafe-section scroll-animate-fade-up scroll-delay-4">
          <div className="category-nav-scroll">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              All Combos ({combos.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`category-chip ${selectedCategory === cat._id ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 6: COMBO PRODUCT-CARD GRID
            ======================================================== */}
        <section id="combos-section" className="cafe-section scroll-animate-fade-up scroll-delay-5">
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#1E140E',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                Freshly Handcrafted Combos
              </h2>
              <p style={{
                fontSize: '0.8rem',
                color: '#7A6E63',
                margin: '2px 0 0',
                fontWeight: 500
              }}>
                Curated meal combinations with instant tokens & express pickup
              </p>
            </div>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#8C7E74',
              background: '#FAF6F0',
              padding: '4px 12px',
              borderRadius: '20px',
              border: '1px solid #EADBCC'
            }}>
              {filteredCombos.length} Combos
            </span>
          </div>

          {loading ? (
            <div className="combo-product-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="skeleton" style={{ height: '390px', borderRadius: '18px' }} />
              ))}
            </div>
          ) : filteredCombos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              background: '#FFFFFF',
              borderRadius: '18px',
              border: `1.5px solid ${softBorder}`,
              boxShadow: '0 4px 14px rgba(33, 23, 18, 0.04)'
            }}>
              <Sparkles size={36} color={copperAccent} style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#211712', marginBottom: '0.5rem' }}>
                No combos found
              </h3>
              <p style={{ color: '#756B65', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try resetting your search or selecting a different category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setVegFilter('all');
                }}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  borderRadius: '20px',
                  border: `1.5px solid ${copperAccent}`,
                  color: copperAccent,
                  background: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="combo-product-grid">
              {filteredCombos.map((combo) => (
                <ComboCard
                  key={combo._id}
                  combo={combo}
                  defaultDate={menuActiveDate}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
