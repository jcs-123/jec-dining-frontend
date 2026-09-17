import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { ShoppingBag, ArrowLeft, MapPin, CreditCard, Calendar } from 'lucide-react';

export const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, cartCafe, subtotalPaise, taxPaise, totalPaise, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [pickupDate] = useState(todayStr);
  const [pickupTimeSlot] = useState('Immediate (15-20 mins)');
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
            Please select delicious combos from either JECCAFE or JEC BYTES before proceeding to checkout.
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
        pickupDate,
        pickupTimeSlot,
        items: items.map((i) => ({
          comboId: i.comboId,
          quantity: i.quantity,
          selectedOptions: i.selectedOptions || [],
          scheduledDate: i.scheduledDate || pickupDate
        }))
      };

      const res = await api.post('/orders/checkout', payload);

      if (res.success && res.order && res.payment) {
        // Store reservationId and payment details in session and navigate to payment
        sessionStorage.setItem('active_payment_data', JSON.stringify({
          order: res.order,
          payment: res.payment,
          reservationId: res.reservationId,
          cafe: cartCafe,
          pickupDate,
          pickupTimeSlot
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
    <div className="app-container" style={{ maxWidth: '980px', padding: '2rem 1rem' }}>
      <button
        onClick={() => navigate(`/${cartCafe?.slug || ''}`)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.45rem 1rem',
          borderRadius: '20px',
          border: '1.5px solid #EADBCC',
          background: '#FFFFFF',
          color: '#1E140E',
          fontWeight: 700,
          fontSize: '0.84rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 6px rgba(50, 30, 15, 0.04)'
        }}
      >
        <ArrowLeft size={15} color="#D66C3E" />
        <span>Back to {cartCafe?.name || 'Menu'}</span>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Pickup & Customer Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pickup Counter Information Card */}
          <div className="card" style={{
            padding: '1.6rem',
            background: '#FFFFFF',
            border: '1.5px solid #EADBCC',
            borderRadius: '18px',
            boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#FAF6F0',
                border: '1px solid #EADBCC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D66C3E'
              }}>
                <MapPin size={18} />
              </div>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.28rem',
                fontWeight: 800,
                color: '#1E140E',
                margin: 0
              }}>
                Pickup Counter
              </h2>
            </div>

            {/* Counter Location */}
            <div style={{
              background: '#FAF6F0',
              border: '1px solid #EADBCC',
              padding: '14px 16px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <MapPin size={18} color="#D66C3E" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E140E' }}>
                  {cartCafe?.name} Express Counter
                </div>
                <div style={{ fontSize: '0.8rem', color: '#7A6E63', marginTop: '2px' }}>
                  {cartCafe?.address || 'Campus Central Food Court'}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="card" style={{
            padding: '1.6rem',
            background: '#FFFFFF',
            border: '1.5px solid #EADBCC',
            borderRadius: '18px',
            boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
          }}>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.28rem',
              fontWeight: 800,
              color: '#1E140E',
              margin: '0 0 1.2rem'
            }}>
              Contact Information
            </h2>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem', color: '#4A423B', marginBottom: '4px', display: 'block' }}>Full Name</label>
              <input type="text" className="form-input" value={user?.name || ''} disabled style={{ background: '#FAF6F0', border: '1.5px solid #EADBCC', borderRadius: '10px', height: '42px', padding: '0 12px', width: '100%', boxSizing: 'border-box' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem', color: '#4A423B', marginBottom: '4px', display: 'block' }}>Email Address</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ background: '#FAF6F0', border: '1.5px solid #EADBCC', borderRadius: '10px', height: '42px', padding: '0 12px', width: '100%', boxSizing: 'border-box' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E140E', marginBottom: '4px', display: 'block' }}>Phone Number for Pickup SMS/Alerts *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                style={{ border: '1.5px solid #EADBCC', borderRadius: '10px', height: '42px', padding: '0 12px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem', color: '#4A423B', marginBottom: '4px', display: 'block' }}>Special Order Instructions (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. Less ice, extra napkins, cutlery required..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                style={{ border: '1.5px solid #EADBCC', borderRadius: '10px', padding: '10px 12px', width: '100%', boxSizing: 'border-box', minHeight: '70px' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Pay Trigger */}
        <div className="card" style={{
          padding: '1.6rem',
          position: 'sticky',
          top: '90px',
          background: '#FFFFFF',
          border: '1.5px solid #EADBCC',
          borderRadius: '18px',
          boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
        }}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.28rem',
            fontWeight: 800,
            color: '#1E140E',
            margin: '0 0 1.25rem'
          }}>
            Order Summary
          </h2>

          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
            {items.map((item) => (
              <div key={item.customKey} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1E140E' }}>
                    {item.quantity}x {item.name}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#D66C3E',
                    background: '#FAF6F0',
                    border: '1px solid #EADBCC',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    marginTop: '3px'
                  }}>
                    <Calendar size={12} />
                    <span>Scheduled: {item.scheduledDate || 'Today'}</span>
                  </div>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#7A6E63', marginTop: '2px' }}>
                      {item.selectedOptions.map(o => o.optionName).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 700, color: '#1E140E' }}>
                  {formatINR(item.unitPricePaise * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div style={{ borderTop: '1px solid #EADBCC', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A6E63' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatINR(subtotalPaise)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #EADBCC',
              paddingTop: '10px',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#1E140E'
            }}>
              <span>Total Payable</span>
              <span style={{ color: '#D66C3E' }}>{formatINR(totalPaise)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.85rem',
              borderRadius: '24px',
              background: '#1A1816',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(26, 24, 22, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <CreditCard size={18} />
            <span>{submitting ? 'Creating Order...' : `Pay ${formatINR(totalPaise)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
