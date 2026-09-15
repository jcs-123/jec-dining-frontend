import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useCafe } from '../../context/CafeContext';
import { useCart } from '../../context/CartContext';
import { ComboCard } from '../../components/combos/ComboCard';
import { ComboCustomizerModal } from '../../components/combos/ComboCustomizerModal';
import { Search, Filter, Sparkles, MapPin, Clock, ArrowLeft } from 'lucide-react';

export const CafeMenuPage = () => {
  const { cafeSlug } = useParams();
  const { selectCafeBySlug } = useCafe();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'nonveg'

  // Modal customizer state
  const [selectedComboForCustomizer, setSelectedComboForCustomizer] = useState(null);

  useEffect(() => {
    const slug = cafeSlug || window.location.pathname.replace(/^\//, '').split('/')[0];
    if (slug) {
      loadCafeData(slug);
    }
  }, [cafeSlug]);

  const loadCafeData = async (slug) => {
    try {
      setLoading(true);
      selectCafeBySlug(slug);

      const [cafeRes, catRes, comboRes] = await Promise.all([
        api.get(`/cafes/${slug}`),
        api.get(`/categories/cafe/${slug}`),
        api.get(`/combos/cafe/${slug}`)
      ]);

      if (cafeRes.success) setCafe(cafeRes.cafe);
      if (catRes.success) setCategories(catRes.categories || []);
      if (comboRes.success) setCombos(comboRes.combos || []);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleQuickAdd = (combo) => {
    addItem(cafe, combo, 1, []);
  };

  return (
    <div className="app-container">
      {/* Hero Banner with Cafe Identity */}
      {cafe && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-light)',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {cafe.name}
              </h1>
              <span className={`badge ${cafe.isOpen ? 'badge-status-ready' : 'badge-status-cancelled'}`}>
                {cafe.isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <p style={{ color: 'var(--brand-accent)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
              {cafe.tagline}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="var(--brand-accent)" />
                <span>{cafe.openingHours}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--brand-accent)" />
                <span>{cafe.address}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px' }}
            >
              <ArrowLeft size={14} />
              <span>Explore Other Café</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: '400px'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search combos, flavors, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Veg / Non-Veg Toggle Filter */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-subtle)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-light)'
        }}>
          <button
            onClick={() => setVegFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: vegFilter === 'all' ? '#FFFFFF' : 'transparent',
              color: vegFilter === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              boxShadow: vegFilter === 'all' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            All Items
          </button>
          <button
            onClick={() => setVegFilter('veg')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: vegFilter === 'veg' ? '#FFFFFF' : 'transparent',
              color: vegFilter === 'veg' ? 'var(--status-veg)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              boxShadow: vegFilter === 'veg' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🟢 Veg Only
          </button>
          <button
            onClick={() => setVegFilter('nonveg')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: vegFilter === 'nonveg' ? '#FFFFFF' : 'transparent',
              color: vegFilter === 'nonveg' ? 'var(--status-nonveg)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              boxShadow: vegFilter === 'nonveg' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🔴 Non-Veg
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '2rem',
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '8px 18px',
            borderRadius: '24px',
            border: `1px solid ${selectedCategory === 'all' ? 'var(--brand-accent)' : 'var(--border-light)'}`,
            background: selectedCategory === 'all' ? 'var(--brand-accent)' : '#FFFFFF',
            color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          All Combos ({combos.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            style={{
              padding: '8px 18px',
              borderRadius: '24px',
              border: `1px solid ${selectedCategory === cat._id ? 'var(--brand-accent)' : 'var(--border-light)'}`,
              background: selectedCategory === cat._id ? 'var(--brand-accent)' : '#FFFFFF',
              color: selectedCategory === cat._id ? '#FFFFFF' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Combo Cards Grid */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" style={{ height: '360px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : filteredCombos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-light)'
        }}>
          <Sparkles size={36} color="var(--brand-accent)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No combos found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try resetting your search or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setVegFilter('all');
            }}
            className="btn btn-outline btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredCombos.map((combo) => (
            <ComboCard
              key={combo._id}
              combo={combo}
              onSelectCombo={(c) => setSelectedComboForCustomizer(c)}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      )}

      {/* Customizer Modal */}
      <ComboCustomizerModal
        isOpen={!!selectedComboForCustomizer}
        onClose={() => setSelectedComboForCustomizer(null)}
        combo={selectedComboForCustomizer}
        cafe={cafe}
        onAddToCart={addItem}
      />
    </div>
  );
};
