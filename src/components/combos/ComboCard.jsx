import React, { useState, useEffect } from 'react';
import { formatINR } from '../../utils/formatters';
import { Plus, CheckCircle2, Calendar } from 'lucide-react';

export const ComboCard = ({ combo, onQuickAdd, defaultDate = 'Today' }) => {
  const isOffer = combo.offerPricePaise != null && combo.offerPricePaise < combo.basePricePaise;
  const displayPrice = isOffer ? combo.offerPricePaise : combo.basePricePaise;

  const [selectedDate, setSelectedDate] = useState(defaultDate || 'Today');

  useEffect(() => {
    if (defaultDate) {
      setSelectedDate(defaultDate);
    }
  }, [defaultDate]);

  const todayIso = new Date().toISOString().split('T')[0];

  const formatShortDate = (dateVal) => {
    if (dateVal === 'Today' || dateVal === 'Tomorrow') return dateVal;
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
    } catch {}
    return dateVal;
  };

  const copperAccent = '#D66C3E';
  const softBorder = '#E8DDD2';
  const mainText = '#211712';
  const mutedText = '#756B65';

  return (
    <div
      className="card combo-card-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        borderRadius: '18px',
        border: `1px solid ${softBorder}`,
        background: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(33, 23, 18, 0.05)',
        overflow: 'hidden',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast)',
        boxSizing: 'border-box',
        opacity: combo.isSoldOut ? 0.95 : 1
      }}
    >
      {/* 1. Product Image (16 / 9 aspect ratio) */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
        background: '#EFE8DF'
      }}>
        <img
          src={combo.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={combo.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        {/* 2. VEG or NON-VEG badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: combo.isVeg ? '#DCFCE7' : '#FEE2E2',
            color: combo.isVeg ? '#18A66A' : '#DC3C3C',
            border: `1px solid ${combo.isVeg ? 'rgba(24, 166, 106, 0.4)' : 'rgba(220, 60, 60, 0.4)'}`,
            padding: '3px 9px',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: combo.isVeg ? '#18A66A' : '#DC3C3C'
            }} />
            {combo.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* 3. SPECIAL OFFER badge */}
        {isOffer && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: copperAccent,
            color: '#FFFFFF',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '3px 7px',
            borderRadius: '6px',
            letterSpacing: '0.04em',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            zIndex: 2,
            whiteSpace: 'nowrap'
          }}>
            SPECIAL OFFER
          </div>
        )}

        {/* Sold Out Overlay */}
        {combo.isSoldOut && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(27, 14, 9, 0.72)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            padding: '12px',
            textAlign: 'center',
            zIndex: 3
          }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.08em', marginBottom: '2px' }}>
              SOLD OUT
            </div>
            <div style={{ fontSize: '0.75rem', color: '#E8DDD2', maxWidth: '180px' }}>
              Be back soon for another delicious experience!
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        boxSizing: 'border-box'
      }}>
        {/* 4. Product Title & 5. Description */}
        <div style={{ marginBottom: '6px' }}>
          <h3 style={{
            fontSize: '1.12rem',
            fontWeight: 700,
            color: mainText,
            marginBottom: '4px',
            lineHeight: 1.35
          }}>
            {combo.name}
          </h3>
          <p style={{
            fontSize: '0.84rem',
            color: mutedText,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.45
          }}>
            {combo.description}
          </p>
        </div>

        {/* 6. Included Items */}
        {combo.fixedItems && combo.fixedItems.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            margin: '8px 0',
            fontSize: '0.78rem',
            color: '#5C524B'
          }}>
            {combo.fixedItems.slice(0, 3).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color={copperAccent} />
                <span style={{ fontWeight: 500 }}>{item.quantity}x {item.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* 7. Meal-Date Controls */}
        <div
          style={{
            margin: '10px 0 12px',
            padding: '8px 10px',
            background: '#FAF6F0',
            borderRadius: '10px',
            border: `1px solid ${softBorder}`,
            boxSizing: 'border-box',
            width: '100%'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: mutedText, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={11} color={copperAccent} />
              SELECT MEAL DATE:
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: copperAccent }}>
              {formatShortDate(selectedDate)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSelectedDate('Today')}
              style={{
                flex: '1 1 50px',
                minWidth: '45px',
                padding: '4px 6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: selectedDate === 'Today' ? `1.5px solid ${copperAccent}` : `1px solid ${softBorder}`,
                background: selectedDate === 'Today' ? copperAccent : '#FFFFFF',
                color: selectedDate === 'Today' ? '#FFFFFF' : mainText,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'center'
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate('Tomorrow')}
              style={{
                flex: '1 1 65px',
                minWidth: '55px',
                padding: '4px 6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: selectedDate === 'Tomorrow' ? `1.5px solid ${copperAccent}` : `1px solid ${softBorder}`,
                background: selectedDate === 'Tomorrow' ? copperAccent : '#FFFFFF',
                color: selectedDate === 'Tomorrow' ? '#FFFFFF' : mainText,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'center'
              }}
            >
              Tomorrow
            </button>
            <div style={{ flex: '1 1 90px', minWidth: '85px', maxWidth: '100%', position: 'relative' }}>
              <input
                type="date"
                min={todayIso}
                value={selectedDate !== 'Today' && selectedDate !== 'Tomorrow' ? selectedDate : ''}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                style={{
                  width: '100%',
                  minWidth: '0',
                  padding: '3px 4px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: (selectedDate !== 'Today' && selectedDate !== 'Tomorrow') ? `1.5px solid ${copperAccent}` : `1px solid ${softBorder}`,
                  background: (selectedDate !== 'Today' && selectedDate !== 'Tomorrow') ? '#FDF3EE' : '#FFFFFF',
                  color: mainText,
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                title="Pick custom date"
              />
            </div>
          </div>
        </div>

        {/* 8. Price, 9. Complete Package, 10. Action Button */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: `1px solid ${softBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <div style={{ minWidth: '65px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.18rem', fontWeight: 800, color: mainText }}>
                {formatINR(displayPrice)}
              </span>
              {isOffer && (
                <span style={{ fontSize: '0.78rem', textDecoration: 'line-through', color: mutedText }}>
                  {formatINR(combo.basePricePaise)}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#18A66A', fontWeight: 700 }}>
              Complete Package
            </span>
          </div>

          {combo.isSoldOut ? (
            <button
              disabled
              style={{
                borderRadius: '16px',
                padding: '0.45rem 0.95rem',
                border: 'none',
                background: '#E8DDD2',
                color: '#9E948C',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Sold Out</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(combo, selectedDate);
              }}
              style={{
                borderRadius: '16px',
                padding: '0.45rem 0.95rem',
                border: 'none',
                background: copperAccent,
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 3px 10px rgba(214, 108, 62, 0.25)',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#BF582B'}
              onMouseLeave={(e) => e.currentTarget.style.background = copperAccent}
              title={`Add ${combo.name} to cart`}
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
