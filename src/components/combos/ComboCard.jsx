import React from 'react';
import { formatINR } from '../../utils/formatters';
import { Plus, Sliders, CheckCircle2 } from 'lucide-react';

export const ComboCard = ({ combo, onSelectCombo, onQuickAdd }) => {
  const isOffer = combo.offerPricePaise != null && combo.offerPricePaise < combo.basePricePaise;
  const displayPrice = isOffer ? combo.offerPricePaise : combo.basePricePaise;

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        opacity: combo.isSoldOut ? 0.75 : 1
      }}
      onClick={() => onSelectCombo(combo)}
    >
      {/* Thumbnail Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#E7E0D8' }}>
        <img
          src={combo.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={combo.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${combo.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: combo.isVeg ? 'var(--status-veg)' : 'var(--status-nonveg)'
            }} />
            {combo.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Discount / Offer Tag */}
        {isOffer && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--brand-accent)',
            color: '#FFFFFF',
            fontSize: '0.725rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '6px',
            letterSpacing: '0.04em'
          }}>
            SPECIAL OFFER
          </div>
        )}

        {/* Sold Out Overlay */}
        {combo.isSoldOut && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            letterSpacing: '0.1em',
            fontSize: '1rem',
            backdropFilter: 'blur(2px)'
          }}>
            SOLD OUT
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            {combo.name}
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.45
          }}>
            {combo.description}
          </p>
        </div>

        {/* Fixed Items Highlights */}
        {combo.fixedItems && combo.fixedItems.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            margin: '0.75rem 0',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            {combo.fixedItems.slice(0, 2).map((item, idx) => (
              <span key={idx} style={{
                background: 'var(--bg-surface-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} color="var(--brand-accent)" />
                {item.name}
              </span>
            ))}
            {combo.fixedItems.length > 2 && (
              <span style={{ padding: '3px 4px', fontStyle: 'italic' }}>
                +{combo.fixedItems.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Price & Action Row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {formatINR(displayPrice)}
              </span>
              {isOffer && (
                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-subtle)' }}>
                  {formatINR(combo.basePricePaise)}
                </span>
              )}
            </div>
            {combo.isConfigurable && (
              <span style={{ fontSize: '0.7rem', color: 'var(--brand-accent)', fontWeight: 600 }}>
                Customizable
              </span>
            )}
          </div>

          <button
            disabled={combo.isSoldOut}
            onClick={(e) => {
              e.stopPropagation();
              if (combo.isConfigurable) {
                onSelectCombo(combo);
              } else {
                onQuickAdd(combo);
              }
            }}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-md)', padding: '0.45rem 0.9rem' }}
          >
            {combo.isConfigurable ? (
              <>
                <Sliders size={14} />
                <span>Customize</span>
              </>
            ) : (
              <>
                <Plus size={15} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
