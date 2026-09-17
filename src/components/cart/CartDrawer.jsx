import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Calendar } from 'lucide-react';

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

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <div className="drawer-panel" style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '460px',
        background: '#FAF6F0',
        boxShadow: '-10px 0 40px rgba(27, 14, 9, 0.28)',
        zIndex: 61,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Luxury Espresso Header */}
        <div style={{
          padding: '1.4rem 1.6rem 1.2rem',
          background: 'linear-gradient(180deg, #1C0F0A 0%, #150905 100%)',
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(232, 221, 210, 0.12)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                border: '1.5px solid rgba(214, 108, 62, 0.45)',
                background: 'rgba(214, 108, 62, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D66C3E',
                flexShrink: 0
              }}>
                <ShoppingBag size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.01em',
                  lineHeight: 1.2,
                  margin: 0,
                  fontFamily: 'var(--font-heading)'
                }}>
                  Your Order Cart
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#D5C8BD', marginTop: '2px' }}>
                  Ordering from <strong style={{ color: '#FDF3EE' }}>{cartCafe?.name || 'JECCAFE'}</strong>
                </div>
              </div>
            </div>

            {/* Circular frosted close button */}
            <button
              onClick={() => setIsCartOpen(false)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              aria-label="Close Cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Fine divider with luxury quote */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
            <span style={{ width: '32px', height: '1px', background: 'rgba(214, 108, 62, 0.6)' }} />
            <span style={{
              fontSize: '0.66rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#BFA99B',
              fontWeight: 700,
              fontFamily: 'var(--font-serif-luxury)'
            }}>
              GOOD COFFEE BRIGHTER DAYS
            </span>
          </div>
        </div>

        {/* Top Summary Row (Item count & Clear all) */}
        {items.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.6rem 0.5rem',
            background: '#FAF6F0'
          }}>
            <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#211712' }}>
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>

            <button
              onClick={clearCart}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                color: '#DC3C3C',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <Trash2 size={14} />
              <span>Clear all items</span>
            </button>
          </div>
        )}

        {/* Cart Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem 1.6rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {items.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#756B65',
              padding: '2rem'
            }}>
              <div style={{
                background: '#FFFFFF',
                padding: '22px',
                borderRadius: '50%',
                marginBottom: '1rem',
                color: '#D66C3E',
                boxShadow: '0 4px 14px rgba(33, 23, 18, 0.05)',
                border: '1px solid #E8DDD2'
              }}>
                <ShoppingBag size={40} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#211712', marginBottom: '0.5rem' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '240px' }}>
                Browse through our signature combos and add your favorites to get started.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '20px',
                  border: '1.5px solid #D66C3E',
                  background: '#FFFFFF',
                  color: '#D66C3E',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Browse Combos
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.customKey}
                  style={{
                    background: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '16px',
                    border: '1px solid #E8DDD2',
                    boxShadow: '0 2px 10px rgba(33, 23, 18, 0.04)',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Food Thumbnail */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    style={{
                      width: '78px',
                      height: '78px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      background: '#EFE8DF',
                      flexShrink: 0
                    }}
                  />

                  {/* Item Content */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4 style={{
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: '#211712',
                        margin: 0,
                        lineHeight: 1.3
                      }}>
                        {item.name}
                      </h4>
                      <span style={{
                        fontSize: '1.02rem',
                        fontWeight: 800,
                        color: '#211712',
                        whiteSpace: 'nowrap'
                      }}>
                        {formatINR(item.unitPricePaise * item.quantity)}
                      </span>
                    </div>

                    {/* Scheduled Date Badge */}
                    <div>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#FDF3EE',
                        color: '#D66C3E',
                        border: '1px solid rgba(214, 108, 62, 0.25)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        <Calendar size={11} color="#D66C3E" />
                        <span>Scheduled: {item.scheduledDate || 'Today'}</span>
                      </span>
                    </div>

                    {/* Selected Options */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div style={{ fontSize: '0.72rem', color: '#756B65' }}>
                        {item.selectedOptions.map((opt, idx) => (
                          <span key={idx}>+ {opt.optionName}{idx < item.selectedOptions.length - 1 ? ', ' : ''}</span>
                        ))}
                      </div>
                    )}

                    {/* Unit Price & Stepper Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '4px'
                    }}>
                      <span style={{ fontSize: '0.78rem', color: '#756B65' }}>
                        {formatINR(item.unitPricePaise)} each
                      </span>

                      {/* Stepper */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#FAF6F0',
                        border: '1px solid #E8DDD2',
                        borderRadius: '8px',
                        padding: '2px 4px'
                      }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.customKey, item.quantity - 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '5px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#211712'
                          }}
                          title="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span style={{
                          fontWeight: 800,
                          minWidth: '22px',
                          textAlign: 'center',
                          fontSize: '0.88rem',
                          color: '#211712'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.customKey, item.quantity + 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '5px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#211712'
                          }}
                          title="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Faint luxury watermark illustration */}
              <div style={{
                position: 'relative',
                minHeight: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
                opacity: 0.2,
                marginTop: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-serif-luxury)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.35em',
                    color: '#756B65',
                    lineHeight: 1.8
                  }}>
                    MORE<br />THAN<br />COFFEE
                  </div>
                  <div style={{ width: '28px', height: '1px', background: '#756B65', margin: '8px auto 0' }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout Card */}
        {items.length > 0 && (
          <div style={{
            padding: '1rem 1.6rem 1.5rem',
            background: '#FAF6F0',
            borderTop: '1px solid #E8DDD2',
            boxSizing: 'border-box'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8DDD2',
              padding: '16px 18px',
              boxShadow: '0 4px 16px rgba(33, 23, 18, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: '0.94rem', color: '#211712', fontWeight: 600 }}>Subtotal</span>
                  <div style={{ fontSize: '0.74rem', color: '#756B65', marginTop: '2px' }}>
                    Taxes calculated at checkout
                  </div>
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#211712' }}>
                  {formatINR(subtotalPaise)}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #E8DDD2', margin: '12px 0 10px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#211712' }}>Final Total</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#D66C3E' }}>
                  {formatINR(totalPaise)}
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #BF582B 0%, #A0441D 100%)',
                  color: '#FFFFFF',
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(191, 88, 43, 0.35)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
