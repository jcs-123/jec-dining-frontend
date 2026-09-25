import React, { useState, useEffect, useMemo } from 'react';
import { formatINR } from '../../utils/formatters';
import { Plus, CheckCircle2, Calendar, Sunrise, Utensils, Moon, Soup, Coffee, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

const renderMealIcon = (category = '', size = 14) => {
  const c = category.toLowerCase();
  if (c.includes('breakfast')) {
    return <Sunrise size={size} color="#D66C3E" strokeWidth={2.3} style={{ flexShrink: 0 }} />;
  }
  if (c.includes('lunch')) {
    return <Utensils size={size} color="#18A66A" strokeWidth={2.3} style={{ flexShrink: 0 }} />;
  }
  if (c.includes('dinner curry') || c.includes('curry')) {
    return <Soup size={size} color="#D97706" strokeWidth={2.3} style={{ flexShrink: 0 }} />;
  }
  if (c.includes('dinner')) {
    return <Moon size={size} color="#4F46E5" strokeWidth={2.3} style={{ flexShrink: 0 }} />;
  }
  if (c.includes('tea') || c.includes('snack')) {
    return <Coffee size={size} color="#92400E" strokeWidth={2.3} style={{ flexShrink: 0 }} />;
  }
  return <Utensils size={size} color="#D66C3E" strokeWidth={2.3} style={{ flexShrink: 0 }} />;
};

const getComboMealGroups = (combo) => {
  const items = Array.isArray(combo?.fixedItems) ? combo.fixedItems : [];
  if (items.length === 0) return [];

  const categoryOrder = ['Breakfast', 'Lunch', 'Tea & Snacks', 'Dinner', 'Dinner Curry'];
  const groupsMap = new Map();

  items.forEach((item) => {
    let cat = (item.category || '').trim();
    const lower = (item.name || '').toLowerCase();

    // Explicitly place Green Beans and curries into Dinner Curry
    if (/bean|curry|gravy|sambar|kadala/i.test(lower) || /curry.*dinner|dinner.*curry/i.test(cat)) {
      cat = 'Dinner Curry';
    } else if (!cat) {
      if (/dosa|idli|puttu|poori|pongal|vada|appam/i.test(lower)) cat = 'Breakfast';
      else if (/biriyani|rice|meals|curd/i.test(lower)) cat = 'Lunch';
      else if (/chappathi|porotta|roti|naan/i.test(lower)) cat = 'Dinner';
      else if (/tea|coffee|snack|puff|samosa/i.test(lower)) cat = 'Tea & Snacks';
      else cat = 'Dinner Curry';
    }
    // Normalize Curry-Dinner or variations
    if (/curry.*dinner|dinner.*curry/i.test(cat)) cat = 'Dinner Curry';
    if (/tea/i.test(cat) && !/snacks/i.test(cat)) cat = 'Tea & Snacks';

    if (!groupsMap.has(cat)) {
      groupsMap.set(cat, []);
    }
    groupsMap.get(cat).push(item);
  });

  const sortedCategories = Array.from(groupsMap.keys()).sort((a, b) => {
    const idxA = categoryOrder.indexOf(a);
    const idxB = categoryOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return sortedCategories.map((cat) => {
    const groupItems = groupsMap.get(cat);
    const isChoice = groupItems.length > 1;
    return {
      groupName: cat,
      isChoice,
      items: groupItems
    };
  });
};

export const ComboCard = ({ combo, onQuickAdd, defaultDate = 'Today' }) => {
  const displayPrice = combo.basePricePaise;

  const [selectedDate, setSelectedDate] = useState(defaultDate || 'Today');
  const [showFullMenu, setShowFullMenu] = useState(false);

  useEffect(() => {
    if (defaultDate) {
      setSelectedDate(defaultDate);
    }
  }, [defaultDate]);

  const mealGroups = useMemo(() => getComboMealGroups(combo), [combo]);
  const isMultiMeal = useMemo(() => mealGroups.length > 1, [mealGroups]);

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
      {/* 1. Product Image (Responsive 4:3 Aspect Ratio with centered object-fit) */}
      <div
        className="combo-card-image-wrap"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          background: '#FAF6F1'
        }}
      >
        <img
          src={combo.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={combo.name}
          className="combo-card-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* 2. VEG or NON-VEG badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span
            style={{
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
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: combo.isVeg ? '#18A66A' : '#DC3C3C'
              }}
            />
            {combo.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* Sold Out Overlay */}
        {combo.isSoldOut && (
          <div
            style={{
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
            }}
          >
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
      <div
        style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxSizing: 'border-box'
        }}
      >
        {/* Product Title & Description */}
        <div style={{ marginBottom: '6px' }}>
          <h3
            style={{
              fontSize: '1.12rem',
              fontWeight: 700,
              color: mainText,
              marginBottom: '4px',
              lineHeight: 1.35
            }}
          >
            {combo.name}
          </h3>
          <p
            style={{
              fontSize: '0.84rem',
              color: mutedText,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.45
            }}
          >
            {combo.description}
          </p>
        </div>

        {/* Meal Tags & Full Menu Toggle on Card */}
        {isMultiMeal ? (
          <div
            style={{
              margin: '8px 0',
              padding: '10px 12px',
              background: '#FAF6F1',
              borderRadius: '12px',
              border: `1px solid ${softBorder}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {/* Meal Category Tags (Breakfast, Lunch, Dinner, Dinner Curry) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              {mealGroups.map((group, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    border: `1px solid ${softBorder}`,
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    color: mainText
                  }}
                >
                  {renderMealIcon(group.groupName, 13)}
                  <span>{group.groupName}</span>
                  {group.isChoice && (
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        color: copperAccent,
                        background: '#FFF2EB',
                        padding: '1px 5px',
                        borderRadius: '8px'
                      }}
                    >
                      Choose 1
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* View Full Menu Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullMenu(!showFullMenu);
              }}
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: copperAccent,
                background: '#FFFFFF',
                border: `1px solid ${copperAccent}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFF5EE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              {showFullMenu ? <EyeOff size={13} strokeWidth={2.3} /> : <Eye size={13} strokeWidth={2.3} />}
              <span>{showFullMenu ? 'Hide Full Menu Details' : 'View Full Menu & Items'}</span>
              {showFullMenu ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {/* Expanded Full Menu Items */}
            {showFullMenu && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  paddingTop: '6px',
                  borderTop: '1px dashed #EDE2D8',
                  animation: 'fadeIn 0.2s ease-in-out'
                }}
              >
                {mealGroups.map((group, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '4px 6px',
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EADBCC'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {renderMealIcon(group.groupName, 13)}
                        <span style={{ fontWeight: 800, fontSize: '0.76rem', color: mainText }}>
                          {group.groupName}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: group.isChoice ? copperAccent : '#18A66A'
                        }}
                      >
                        {group.isChoice ? 'Choose any 1' : 'Included'}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.73rem',
                        color: '#5C524B',
                        paddingLeft: '18px',
                        lineHeight: 1.4,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px'
                      }}
                    >
                      {group.items.map((it, itIdx) => (
                        <span key={itIdx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600 }}>
                            {it.quantity > 1 ? `${it.quantity}x ` : ''}{it.name}
                          </span>
                          {itIdx < group.items.length - 1 && (
                            <span style={{ color: copperAccent, margin: '0 4px', fontWeight: 800 }}>•</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          combo.fixedItems && combo.fixedItems.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                margin: '8px 0',
                fontSize: '0.78rem',
                color: '#5C524B'
              }}
            >
              {combo.fixedItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color={copperAccent} />
                  <span style={{ fontWeight: 500 }}>
                    {item.quantity}x {item.name}
                  </span>
                </div>
              ))}
            </div>
          )
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
                  border: selectedDate !== 'Today' && selectedDate !== 'Tomorrow' ? `1.5px solid ${copperAccent}` : `1px solid ${softBorder}`,
                  background: selectedDate !== 'Today' && selectedDate !== 'Tomorrow' ? '#FDF3EE' : '#FFFFFF',
                  color: mainText,
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                title="Pick custom date"
              />
            </div>
          </div>
        </div>

        {/* 8. Price & Action Button */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: `1px solid ${softBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ minWidth: '65px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.18rem', fontWeight: 800, color: mainText }}>
                {formatINR(displayPrice)}
              </span>
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
                if (onQuickAdd) {
                  onQuickAdd(combo, selectedDate);
                }
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
              onMouseEnter={(e) => (e.currentTarget.style.background = '#BF582B')}
              onMouseLeave={(e) => (e.currentTarget.style.background = copperAccent)}
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
