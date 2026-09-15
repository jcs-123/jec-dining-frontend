import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer = () => {
  const {
    items,
    cartCafe,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotalPaise,
    taxPaise,
    totalPaise
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <div className="drawer-panel">
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} color="var(--brand-accent)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Order Cart</h3>
            </div>
            {cartCafe && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Ordering from <strong>{cartCafe.name}</strong>
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {items.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--text-muted)',
              padding: '2rem'
            }}>
              <div style={{
                background: 'var(--bg-surface-subtle)',
                padding: '20px',
                borderRadius: '50%',
                marginBottom: '1rem',
                color: 'var(--brand-accent)'
              }}>
                <ShoppingBag size={36} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Browse through our signature combos and add your favorites to get started.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn btn-outline btn-sm">
                Browse Combos
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={clearCart}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Clear all items</span>
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.customKey}
                  style={{
                    background: 'var(--bg-surface-subtle)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatINR(item.unitPricePaise * item.quantity)}
                    </span>
                  </div>

                  {/* Selected Options Breakdown */}
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {item.selectedOptions.map((opt, idx) => (
                        <div key={idx}>
                          + {opt.optionName} {opt.extraPricePaise > 0 ? `(${formatINR(opt.extraPricePaise)})` : ''}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stepper & Unit Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatINR(item.unitPricePaise)} each
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => updateQuantity(item.customKey, item.quantity - 1)}
                        className="btn btn-outline btn-sm"
                        style={{ width: '28px', height: '28px', padding: 0, borderRadius: '6px' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.customKey, item.quantity + 1)}
                        className="btn btn-outline btn-sm"
                        style={{ width: '28px', height: '28px', padding: 0, borderRadius: '6px' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--divider)',
            background: 'var(--bg-surface)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatINR(subtotalPaise)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>GST Taxes & Fees ({cartCafe?.taxRatePercent || 5}%)</span>
              <span style={{ fontWeight: 600 }}>{formatINR(taxPaise)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingTop: '8px',
              borderTop: '1px solid var(--divider)',
              fontSize: '1.1rem',
              fontWeight: 800
            }}>
              <span>Final Total</span>
              <span style={{ color: 'var(--brand-accent)' }}>{formatINR(totalPaise)}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn btn-primary btn-full"
              style={{ padding: '0.85rem', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
