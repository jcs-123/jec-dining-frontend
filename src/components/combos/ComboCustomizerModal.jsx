import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { formatINR } from '../../utils/formatters';
import { Check, Plus, Minus, CheckCircle2, AlertCircle } from 'lucide-react';

export const ComboCustomizerModal = ({ isOpen, onClose, combo, cafe, onAddToCart }) => {
  if (!combo) return null;

  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState({}); // { [groupName]: [optionObj] }
  const [validationError, setValidationError] = useState('');

  // Pre-select default options on load
  useEffect(() => {
    if (combo && combo.customizationGroups) {
      const initial = {};
      combo.customizationGroups.forEach((group) => {
        const defaults = group.options.filter((o) => o.isDefault);
        if (defaults.length > 0) {
          initial[group.groupName] = defaults.slice(0, group.maxSelect);
        } else if (group.options.length > 0 && group.minSelect > 0) {
          initial[group.groupName] = [group.options[0]];
        } else {
          initial[group.groupName] = [];
        }
      });
      setSelections(initial);
      setQuantity(1);
      setValidationError('');
    }
  }, [combo]);

  const effectiveBasePrice = combo.basePricePaise;

  // Compute total extras
  const totalExtrasPaise = Object.values(selections).reduce((sum, opts) => {
    return sum + opts.reduce((gSum, opt) => gSum + (opt.extraPricePaise || 0), 0);
  }, 0);

  const unitTotalPaise = effectiveBasePrice + totalExtrasPaise;
  const grandTotalPaise = unitTotalPaise * quantity;

  const handleOptionToggle = (group, option) => {
    setValidationError('');
    setSelections((prev) => {
      const currentList = prev[group.groupName] || [];
      const isAlreadySelected = currentList.some((o) => o.name === option.name);

      if (group.maxSelect === 1) {
        // Single selection (Radio behavior)
        return { ...prev, [group.groupName]: [option] };
      }

      // Multi-selection (Checkbox behavior)
      if (isAlreadySelected) {
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
    if (combo.isConfigurable && combo.customizationGroups) {
      for (const group of combo.customizationGroups) {
        const chosen = selections[group.groupName] || [];
        if (chosen.length < group.minSelect) {
          setValidationError(`Please select at least ${group.minSelect} option(s) for "${group.groupName}"`);
          return;
        }
      }
    }

    // Flatten selections into array of { groupName, optionName, extraPricePaise }
    const flattened = [];
    Object.entries(selections).forEach(([groupName, opts]) => {
      opts.forEach((opt) => {
        flattened.push({
          groupName,
          optionName: opt.name,
          extraPricePaise: opt.extraPricePaise || 0
        });
      });
    });

    onAddToCart(cafe, combo, quantity, flattened);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={combo.name}
      maxWidth="580px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Quantity Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn btn-outline btn-sm"
              style={{ width: '36px', height: '36px', padding: 0 }}
            >
              <Minus size={16} />
            </button>
            <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="btn btn-outline btn-sm"
              style={{ width: '36px', height: '36px', padding: 0 }}
            >
              <Plus size={16} />
            </button>
          </div>

          <button onClick={handleAdd} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            Add to Cart • {formatINR(grandTotalPaise)}
          </button>
        </div>
      }
    >
      <div>
        {/* Banner Image */}
        {combo.image && (
          <div style={{
            borderRadius: '14px',
            overflow: 'hidden',
            width: '100%',
            aspectRatio: '16 / 10',
            maxHeight: '220px',
            background: '#FAF6F1',
            marginBottom: '1.25rem'
          }}>
            <img
              src={combo.image}
              alt={combo.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        )}

        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
          {combo.description}
        </p>

        {/* Fixed Included Items */}
        {combo.fixedItems && combo.fixedItems.length > 0 && (
          <div style={{
            background: 'var(--bg-surface-subtle)',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              INCLUDED ITEMS IN THIS COMBO
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {combo.fixedItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={16} color="var(--brand-accent)" />
                  <span><strong>{item.quantity}x</strong> {item.name}</span>
                  {item.notes && <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>({item.notes})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Customization Groups */}
        {combo.isConfigurable && combo.customizationGroups && combo.customizationGroups.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {combo.customizationGroups.map((group, gIdx) => {
              const selectedInGroup = selections[group.groupName] || [];

              return (
                <div key={gIdx} style={{ borderTop: '1px solid var(--divider)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{group.groupName}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {group.minSelect > 0 ? `Required (Pick ${group.maxSelect})` : `Optional (Up to ${group.maxSelect})`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: `1px solid ${isSelected ? 'var(--brand-accent)' : 'var(--border-light)'}`,
                            background: isSelected ? 'var(--brand-accent-light)' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: group.maxSelect === 1 ? '50%' : '4px',
                              border: `2px solid ${isSelected ? 'var(--brand-accent)' : '#CBD5E1'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isSelected ? 'var(--brand-accent)' : 'transparent'
                            }}>
                              {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 500 }}>
                              {opt.name}
                            </span>
                          </div>

                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: opt.extraPricePaise > 0 ? 'var(--brand-accent)' : 'var(--text-muted)' }}>
                            {opt.extraPricePaise > 0 ? `+ ${formatINR(opt.extraPricePaise)}` : 'Included'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
