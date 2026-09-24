import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const StickyCartBar = () => {
  const { items, itemCount, totalPaise, setIsCartOpen } = useCart();
  const location = useLocation();

  if (items.length === 0) return null;
  if (
    location.pathname === '/checkout' ||
    location.pathname.startsWith('/order-success') ||
    location.pathname.startsWith('/order/')
  ) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      maxWidth: '600px',
      margin: '0 auto',
      zIndex: 35,
      animation: 'slideUp 0.25s ease-out'
    }}>
      <div
        onClick={() => setIsCartOpen(true)}
        style={{
          background: 'var(--brand-primary)',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 12px 24px -4px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--brand-accent)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}>
            {itemCount}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>View Order Cart</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{formatINR(totalPaise)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-accent)' }}>
          <span>View Cart</span>
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  );
};
