import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { formatINR } from '../../utils/formatters';
import { Check, Plus, Minus, CheckCircle2, AlertCircle, Calendar, Sparkles } from 'lucide-react';

export const getMealCategoryIcon = (category = '') => {
  const c = category.toLowerCase();
  if (c.includes('breakfast')) return '🌅';
  if (c.includes('lunch')) return '🍛';
  if (c.includes('tea') || c.includes('snack')) return '☕';
  if (c.includes('dinner curry') || c.includes('curry')) return '🥘';
  if (c.includes('dinner')) return '🌙';
  if (c.includes('drink') || c.includes('beverage')) return '🥤';
  if (c.includes('dessert') || c.includes('sweet')) return '🍰';
  return '🍽️';
};

export const getComboGroups = (combo) => {
  if (!combo) return [];

  // 1. If explicit customizationGroups configured:
  if (combo.isConfigurable && Array.isArray(combo.customizationGroups) && combo.customizationGroups.length > 0) {
    return combo.customizationGroups.map((group) => ({
      groupName: group.groupName,
      isChoice: (group.options?.length || 0) > 1,
      minSelect: group.minSelect ?? 1,
      maxSelect: group.maxSelect ?? 1,
      options: (group.options || []).map((opt, oIdx) => ({
        name: opt.name,
        rawName: opt.name,
        extraPricePaise: opt.extraPricePaise || 0,
        isVeg: opt.isVeg !== undefined ? opt.isVeg : true,
        isDefault: opt.isDefault || oIdx === 0,
        notes: opt.notes || ''
      }))
    }));
  }

  // 2. Derive groups from fixedItems
  const items = Array.isArray(combo.fixedItems) ? combo.fixedItems : [];
  if (items.length === 0) return [];

  const categoryOrder = ['Breakfast', 'Lunch', 'Tea & Snacks', 'Dinner', 'Dinner Curry'];
  const groupsMap = new Map();

  items.forEach((item) => {
    let cat = (item.category || '').trim();
    if (!cat) {
      const lower = (item.name || '').toLowerCase();
      if (/dosa|idli|puttu|poori|pongal|vada|appam/i.test(lower)) cat = 'Breakfast';
      else if (/curry|gravy|sambar/i.test(lower)) cat = 'Dinner Curry';
      else if (/biriyani|rice|meals|curd/i.test(lower)) cat = 'Lunch';
      else if (/chappathi|porotta|roti|naan/i.test(lower)) cat = 'Dinner';
      else if (/tea|coffee|snack|puff|samosa/i.test(lower)) cat = 'Tea & Snacks';
      else cat = 'Included Items';
    }
    // Normalize Curry-Dinner
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
      minSelect: 1,
      maxSelect: 1,
      options: groupItems.map((it, idx) => ({
        name: it.quantity > 1 ? `${it.quantity}x ${it.name}` : it.name,
        rawName: it.name,
        quantity: it.quantity || 1,
        notes: it.notes || '',
        extraPricePaise: 0,
        isVeg: combo.isVeg,
        isDefault: idx === 0
      }))
    };
  });
};

export const ComboCustomizerModal = ({
  isOpen,
  onClose,
  combo,
  cafe,
  onAddToCart,
  initialDate = 'Today'
}) => {
  if (!combo) return null;

  const groups = useMemo(() => getComboGroups(combo), [combo]);
  const hasChoiceGroups = useMemo(() => groups.some((g) => g.isChoice), [groups]);

  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState(initialDate || 'Today');
  const [selections, setSelections] = useState({}); // { [groupName]: [optionObj] }
  const [validationError, setValidationError] = useState('');

  const copperAccent = '#D66C3E';
  const softBorder = '#E8DDD2';
  const darkMain = '#211712';
  const mutedText = '#756B65';
  const todayIso = new Date().toISOString().split('T')[0];

  // Initialize selections with default options on load
  useEffect(() => {
    if (combo && groups.length > 0) {
      const initial = {};
      groups.forEach((group) => {
        const defaults = group.options.filter((o) => o.isDefault);
        if (defaults.length > 0) {
          initial[group.groupName] = defaults.slice(0, group.maxSelect);
        } else if (group.options.length > 0) {
          initial[group.groupName] = [group.options[0]];
        } else {
          initial[group.groupName] = [];
        }
      });
      setSelections(initial);
      setQuantity(1);
      setSelectedDate(initialDate || 'Today');
      setValidationError('');
    }
  }, [combo, groups, initialDate]);

  const effectiveBasePrice = combo.basePricePaise;

  // Extra price total
  const totalExtrasPaise = Object.values(selections).reduce((sum, opts) => {
    return sum + (Array.isArray(opts) ? opts.reduce((gSum, opt) => gSum + (opt.extraPricePaise || 0), 0) : 0);
  }, 0);

  const unitTotalPaise = effectiveBasePrice + totalExtrasPaise;
  const grandTotalPaise = unitTotalPaise * quantity;

  const handleOptionToggle = (group, option) => {
    setValidationError('');
    setSelections((prev) => {
      const currentList = prev[group.groupName] || [];
      const isAlreadySelected = currentList.some((o) => o.name === option.name);

      if (group.maxSelect === 1) {
        // Radio behavior: always select the clicked one
        return { ...prev, [group.groupName]: [option] };
      }

      // Multi-selection behavior
      if (isAlreadySelected) {
        if (currentList.length <= group.minSelect) {
          setValidationError(`Please select at least ${group.minSelect} option for ${group.groupName}`);
          return prev;
        }
        return {
          ...prev,
          [group.groupName]: currentList.filter((o) => o.name !== option.name)
        };
      } else {
        if (currentList.length >= group.maxSelect) {
          setValidationError(`You can select at most ${group.maxSelect} option(s) for ${group.groupName}`);
          return prev;
        }
        return {
          ...prev,
          [group.groupName]: [...currentList, option]
        };
      }
    });
  };

  const handleAdd = () => {
    // Validate each required group
    for (const group of groups) {
      const chosen = selections[group.groupName] || [];
      if (chosen.length < group.minSelect) {
        setValidationError(`Please choose an option for "${group.groupName}"`);
        return;
      }
    }

    // Flatten selections into array of { groupName, optionName, extraPricePaise }
    const flattened = [];
    Object.entries(selections).forEach(([groupName, opts]) => {
      if (Array.isArray(opts)) {
        opts.forEach((opt) => {
          flattened.push({
            groupName,
            optionName: opt.name,
            extraPricePaise: opt.extraPricePaise || 0
          });
        });
      }
    });

    if (onAddToCart) {
      onAddToCart(cafe, combo, quantity, flattened, selectedDate);
    }
    onClose();
  };

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={combo.name}
      maxWidth="620px"
      footer={
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          {/* Active selections summary pill line */}
          {hasChoiceGroups && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '2px',
                fontSize: '0.74rem',
                color: mutedText,
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontWeight: 800, color: darkMain }}>Your Selection:</span>
              {groups.map((g, gIdx) => {
                const chosen = selections[g.groupName] || [];
                if (chosen.length === 0) return null;
                return (
                  <span
                    key={gIdx}
                    style={{
                      background: '#FDF6F0',
                      border: '1px solid #EADBCC',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontWeight: 600,
                      color: copperAccent
                    }}
                  >
                    {getMealCategoryIcon(g.groupName)} {chosen.map((c) => c.name).join(', ')}
                  </span>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px', flexWrap: 'wrap' }}>
            {/* Quantity Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FAF6F1',
                padding: '4px 8px',
                borderRadius: '24px',
                border: `1px solid ${softBorder}`
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#FFFFFF',
                  color: darkMain,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                title="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span style={{ fontWeight: 800, minWidth: '22px', textAlign: 'center', fontSize: '0.95rem', color: darkMain }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#FFFFFF',
                  color: darkMain,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                title="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Submit Action Button */}
            <button
              type="button"
              onClick={handleAdd}
              style={{
                flex: '1 1 auto',
                minWidth: '180px',
                padding: '0.75rem 1.4rem',
                borderRadius: '16px',
                border: 'none',
                background: copperAccent,
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(214, 108, 62, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#BF582B')}
              onMouseLeave={(e) => (e.currentTarget.style.background = copperAccent)}
            >
              <span>Add Combo to Cart</span>
              <span>•</span>
              <span>{formatINR(grandTotalPaise)}</span>
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', boxSizing: 'border-box' }}>
        {/* Hero Image & Tags */}
        {combo.image && (
          <div
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              width: '100%',
              aspectRatio: '16 / 9',
              maxHeight: '220px',
              background: '#FAF6F1',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
            }}
          >
            <img
              src={combo.image}
              alt={combo.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Veg / Non-Veg Badge */}
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: combo.isVeg ? '#DCFCE7' : '#FEE2E2',
                  color: combo.isVeg ? '#18A66A' : '#DC3C3C',
                  border: `1px solid ${combo.isVeg ? 'rgba(24, 166, 106, 0.4)' : 'rgba(220, 60, 60, 0.4)'}`,
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
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
                {combo.isVeg ? 'VEG COMBO' : 'NON-VEG COMBO'}
              </span>
            </div>

            {/* Price Badge */}
            <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
              <span
                style={{
                  background: 'rgba(27, 14, 9, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}
              >
                {formatINR(combo.basePricePaise)}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <p style={{ fontSize: '0.88rem', color: mutedText, lineHeight: 1.5, margin: 0 }}>
          {combo.description}
        </p>

        {/* Meal Date Selector */}
        <div
          style={{
            padding: '10px 14px',
            background: '#FAF6F1',
            borderRadius: '12px',
            border: `1px solid ${softBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: mutedText, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} color={copperAccent} />
              SCHEDULE MEAL DATE:
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: copperAccent }}>
              {formatShortDate(selectedDate)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSelectedDate('Today')}
              style={{
                flex: '1 1 80px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: selectedDate === 'Today' ? `1.5px solid ${copperAccent}` : `1px solid ${softBorder}`,
                background: selectedDate === 'Today' ? copperAccent : '#FFFFFF',
                color: selectedDate === 'Today' ? '#FFFFFF' : darkMain,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate('Tomorrow')}
              style={{
                flex: '1 1 90px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: selectedDate === 'Tomorrow' ? `1.5px solid ${copperAccent}` : `1px solid ${softBorder}`,
                background: selectedDate === 'Tomorrow' ? copperAccent : '#FFFFFF',
                color: selectedDate === 'Tomorrow' ? '#FFFFFF' : darkMain,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Tomorrow
            </button>
            <div style={{ flex: '1 1 120px' }}>
              <input
                type="date"
                min={todayIso}
                value={selectedDate !== 'Today' && selectedDate !== 'Tomorrow' ? selectedDate : ''}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: selectedDate !== 'Today' && selectedDate !== 'Tomorrow' ? `1.5px solid ${copperAccent}` : `1px solid ${softBorder}`,
                  background: selectedDate !== 'Today' && selectedDate !== 'Tomorrow' ? '#FDF3EE' : '#FFFFFF',
                  color: darkMain,
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                title="Select specific date"
              />
            </div>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Meal Selection Sections */}
        {groups.map((group, gIdx) => {
          const selectedInGroup = selections[group.groupName] || [];

          return (
            <div
              key={gIdx}
              style={{
                border: `1px solid ${softBorder}`,
                borderRadius: '14px',
                padding: '14px',
                background: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(33, 23, 18, 0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{getMealCategoryIcon(group.groupName)}</span>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: darkMain }}>
                    {group.groupName}
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: group.isChoice ? '#FFF2EB' : '#F2ECE4',
                    color: group.isChoice ? copperAccent : mutedText,
                    border: group.isChoice ? '1px solid rgba(214, 108, 62, 0.3)' : '1px solid #E8DDD2'
                  }}
                >
                  {group.isChoice ? 'Choose any 1' : 'Included'}
                </span>
              </div>

              {/* Options list */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                {group.options.map((opt, oIdx) => {
                  const isSelected = selectedInGroup.some((s) => s.name === opt.name);

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleOptionToggle(group, opt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: isSelected ? `2px solid ${copperAccent}` : `1px solid ${softBorder}`,
                        background: isSelected ? '#FFF8F4' : '#FAFAFA',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(214, 108, 62, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                        {/* Radio Check Circle */}
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? copperAccent : '#CBD5E1'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected ? copperAccent : '#FFFFFF',
                            flexShrink: 0,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: isSelected ? 800 : 600,
                              color: isSelected ? darkMain : '#4A3E37',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {opt.name}
                          </span>
                          {opt.notes && (
                            <span style={{ fontSize: '0.7rem', color: mutedText, display: 'block' }}>
                              {opt.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      {opt.extraPricePaise > 0 && (
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: copperAccent, marginLeft: '6px' }}>
                          +{formatINR(opt.extraPricePaise)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
