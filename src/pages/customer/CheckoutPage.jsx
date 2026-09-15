import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { ShoppingBag, ArrowLeft, Clock, MapPin, ShieldCheck, CreditCard } from 'lucide-react';

export const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, cartCafe, subtotalPaise, taxPaise, totalPaise, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/checkout');
    } else if (user) {
      setCustomerPhone(user.phone || '');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className="app-container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading checkout...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="app-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '460px',
          margin: '0 auto',
          background: 'var(--bg-surface)',
          padding: '2.5rem',
          borderRadius: '20px',
          border: '1px solid var(--border-light)'
        }}>
          <ShoppingBag size={48} color="var(--brand-accent)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Please select delicious combos from either JECCAFE or JEC BYTEST before proceeding to checkout.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Explore Cafés
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerPhone.trim()) {
      toast.error('Please provide a contact phone number for pickup notification');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare order items payload for authoritative server pricing
      const payload = {
        cafeSlug: cartCafe.slug,
        customerPhone: customerPhone.trim(),
        orderNotes: orderNotes.trim(),
        items: items.map((i) => ({
          comboId: i.comboId,
          quantity: i.quantity,
          selectedOptions: i.selectedOptions || []
        }))
      };

      const res = await api.post('/orders/checkout', payload);

      if (res.success && res.order && res.payment) {
        // Store reservationId and payment details in session and navigate to payment
        sessionStorage.setItem('active_payment_data', JSON.stringify({
          order: res.order,
          payment: res.payment,
          reservationId: res.reservationId,
          cafe: cartCafe
        }));

        navigate(`/payment/${res.order.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to initiate checkout order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '980px' }}>
      <button
        onClick={() => navigate(`/${cartCafe?.slug || ''}`)}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.25rem', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to {cartCafe?.name || 'Menu'}</span>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Pickup & Customer Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pickup Counter Information Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <MapPin size={20} color="var(--brand-accent)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Pickup Details</h2>
            </div>

            <div style={{
              background: 'var(--bg-surface-subtle)',
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '1rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                {cartCafe?.name} Counter
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {cartCafe?.address || 'Campus Central Food Court'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Clock size={16} color="var(--brand-accent)" />
              <span>Estimated Prep Time: <strong>15 - 20 minutes</strong> after payment</span>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Contact Information</h2>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={user?.name || ''} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number for Pickup SMS/Alerts *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Order Instructions (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. Less ice, extra napkins, cutlery required..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Pay Trigger */}
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h2>

          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
            {items.map((item) => (
              <div key={item.customKey} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.quantity}x {item.name}
                  </div>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.selectedOptions.map(o => o.optionName).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 700 }}>
                  {formatINR(item.unitPricePaise * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatINR(subtotalPaise)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>GST & Taxes ({cartCafe?.taxRatePercent || 5}%)</span>
              <span style={{ fontWeight: 600 }}>{formatINR(taxPaise)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--divider)',
              paddingTop: '10px',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--text-main)'
            }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--brand-accent)' }}>{formatINR(totalPaise)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="btn btn-primary btn-full"
            style={{ marginTop: '1.5rem', padding: '0.9rem', fontSize: '1rem', gap: '8px' }}
          >
            <CreditCard size={18} />
            <span>{submitting ? 'Creating Order...' : `Pay ${formatINR(totalPaise)}`}</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={14} color="var(--status-veg)" />
            <span>Secure 256-bit encrypted payment checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
