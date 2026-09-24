import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { ShoppingBag, ArrowLeft, MapPin, CheckCircle, Calendar, ShieldCheck, Banknote, Clock, Trash2 } from 'lucide-react';

export const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, cartCafe, subtotalPaise, totalPaise, clearCart, removeItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const getInitialPickupDate = () => {
    const sched = (items[0]?.scheduledDate || '').trim();
    if (!sched || sched.toLowerCase() === 'today') return todayStr;
    if (sched.toLowerCase() === 'tomorrow') return tomorrowStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(sched)) return sched;
    return todayStr;
  };

  const [pickupDate, setPickupDate] = useState(getInitialPickupDate);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/checkout');
    } else if (user) {
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="checkout-page-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ color: '#7A6E63', fontWeight: 600 }}>Loading checkout details...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="checkout-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShoppingBag size={52} color="#D66C3E" style={{ margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.5rem', fontWeight: 800, color: '#1E140E', marginBottom: '0.75rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: '#7A6E63', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Please select delicious combos from either JECCAFE or JEC BYTES before proceeding to checkout.
          </p>
          <button onClick={() => navigate('/')} className="checkout-submit-btn" style={{ maxWidth: '240px', margin: '0 auto' }}>
            <span>Explore Cafés</span>
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerEmail.trim()) {
      toast.error('Student / Customer Email is required to place your order');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      toast.error('Please enter a valid Student / Customer Email address');
      return;
    }

    if (!customerPhone.trim()) {
      toast.error('Please provide a contact phone number for pickup notification');
      return;
    }

    try {
      setSubmitting(true);

      // Derive pickup date
      let effectivePickupDate = (pickupDate || todayStr).trim();
      if (effectivePickupDate.toLowerCase() === 'today') {
        effectivePickupDate = todayStr;
      } else if (effectivePickupDate.toLowerCase() === 'tomorrow') {
        effectivePickupDate = tomorrowStr;
      }

      // Prepare order items payload for authoritative server pricing
      const payload = {
        cafeSlug: cartCafe?.slug || 'jeccafe',
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        orderNotes: orderNotes.trim(),
        pickupDate: effectivePickupDate,
        pickupTimeSlot: '',
        items: items.map((i) => {
          let itemSched = (i.scheduledDate || effectivePickupDate).trim();
          if (itemSched.toLowerCase() === 'tomorrow') itemSched = tomorrowStr;
          else if (itemSched.toLowerCase() === 'today') itemSched = todayStr;
          return {
            comboId: i.comboId,
            quantity: i.quantity,
            selectedOptions: i.selectedOptions || [],
            scheduledDate: itemSched
          };
        })
      };

      const res = await api.post('/orders/checkout', payload);

      if (res.success && res.order) {
        clearCart();
        toast.success(res.message || 'Order confirmed! Receipt sent to your email.');
        navigate(`/order-success/${res.order._id || res.order.id}`, { state: { order: res.order } });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-container">
      {/* Top Header Bar */}
      <div className="checkout-header-bar">
        <button
          onClick={() => navigate(`/${cartCafe?.slug || ''}`)}
          className="checkout-back-btn"
        >
          <ArrowLeft size={16} color="#D66C3E" />
          <span>Back to {cartCafe?.name || 'Menu'}</span>
        </button>

        <div className="checkout-cod-pill">
          <Banknote size={15} color="#059669" />
          <span>Cash on Delivery</span>
        </div>
      </div>

      {/* Main Responsive Layout Grid */}
      <div className="checkout-layout-grid">
        {/* Left Column: Pickup Details & Contact Form */}
        <div className="checkout-left-col">
          {/* Pickup Counter Card */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <div className="checkout-card-icon">
                <MapPin size={19} />
              </div>
              <div>
                <h2 className="checkout-card-title">Pickup Counter</h2>
                <div style={{ fontSize: '0.8rem', color: '#7A6E63', marginTop: '2px' }}>
                  Dedicated express campus pickup counter
                </div>
              </div>
            </div>

            <div className="checkout-location-banner">
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid #EADBCC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D66C3E',
                flexShrink: 0
              }}>
                <MapPin size={20} />
              </div>
              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div className="checkout-location-title">
                  {cartCafe?.name || 'Campus'} Express Counter
                </div>
                <div className="checkout-location-desc">
                  {cartCafe?.address || 'Tech Innovation Hub, Food Street, JEC Campus'}
                </div>
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #EADBCC' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#6C5E53', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={13} color="#D66C3E" />
                    <span>SCHEDULED MEAL PICKUP DATE:</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setPickupDate(todayStr)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        border: pickupDate === todayStr ? '1.5px solid #D66C3E' : '1px solid #EADBCC',
                        background: pickupDate === todayStr ? '#D66C3E' : '#FFFFFF',
                        color: pickupDate === todayStr ? '#FFFFFF' : '#211712',
                        cursor: 'pointer'
                      }}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupDate(tomorrowStr)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        border: pickupDate === tomorrowStr ? '1.5px solid #D66C3E' : '1px solid #EADBCC',
                        background: pickupDate === tomorrowStr ? '#D66C3E' : '#FFFFFF',
                        color: pickupDate === tomorrowStr ? '#FFFFFF' : '#211712',
                        cursor: 'pointer'
                      }}
                    >
                      Tomorrow
                    </button>
                    <input
                      type="date"
                      min={todayStr}
                      value={pickupDate !== todayStr && pickupDate !== tomorrowStr ? pickupDate : ''}
                      onChange={(e) => {
                        if (e.target.value) setPickupDate(e.target.value);
                      }}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.74rem',
                        borderRadius: '6px',
                        border: pickupDate !== todayStr && pickupDate !== tomorrowStr ? '1.5px solid #D66C3E' : '1px solid #EADBCC',
                        background: pickupDate !== todayStr && pickupDate !== tomorrowStr ? '#FDF3EE' : '#FFFFFF',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <div className="checkout-card-icon">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h2 className="checkout-card-title">Contact & Notifications</h2>
                <div style={{ fontSize: '0.8rem', color: '#7A6E63', marginTop: '2px' }}>
                  Order status SMS & auto-generated receipt delivery
                </div>
              </div>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-form-label">Full Name</label>
              <input
                type="text"
                className="checkout-form-input"
                value={user?.name || ''}
                disabled
              />
            </div>

            <div className="checkout-form-group">
              <label className="checkout-form-label" style={{ color: '#1E140E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Student / Customer Email</span>
                <span style={{ color: '#DC2626', fontWeight: 800 }}>*</span>
              </label>
              <input
                type="email"
                className="checkout-form-input"
                placeholder="student@jec.ac.in or customer@gmail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
              <div style={{ fontSize: '0.74rem', color: '#7A6E63', marginTop: '4px' }}>
                ✓ Official receipt with QR code will be emailed here instantly (Required)
              </div>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-form-label" style={{ color: '#1E140E' }}>
                Phone Number for Pickup SMS / Counter Alerts *
              </label>
              <input
                type="tel"
                className="checkout-form-input"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>

            <div className="checkout-form-group" style={{ marginBottom: 0 }}>
              <label className="checkout-form-label">Special Order Instructions (Optional)</label>
              <textarea
                className="checkout-form-textarea"
                placeholder="e.g. Less spicy, extra napkins, cutlery required..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary & Place Order */}
        <div className="checkout-card checkout-summary-card">
          <div className="checkout-card-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="checkout-card-icon">
                <ShoppingBag size={19} />
              </div>
              <div>
                <h2 className="checkout-card-title">Order Summary</h2>
                <div style={{ fontSize: '0.8rem', color: '#7A6E63', marginTop: '2px' }}>
                  {items.length} {items.length === 1 ? 'combo item' : 'combo items'}
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="checkout-items-scroll">
            {items.map((item) => (
              <div key={item.customKey} className="checkout-item-row">
                <div className="checkout-item-info">
                  <div className="checkout-item-title">
                    {item.quantity}x {item.name}
                  </div>
                  <div className="checkout-item-schedule-badge">
                    <Calendar size={12} />
                    <span>Scheduled: {item.scheduledDate || 'Today'}</span>
                  </div>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="checkout-item-options">
                      {item.selectedOptions.map(o => o.optionName).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div className="checkout-item-price">
                    {formatINR(item.unitPricePaise * item.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.customKey)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#DC2626',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    title="Remove item from cart"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="checkout-breakdown">
            <div className="checkout-breakdown-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 700, color: '#1E140E' }}>{formatINR(subtotalPaise)}</span>
            </div>
            <div className="checkout-breakdown-row">
              <span>Payment Mode</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>Cash on Delivery</span>
            </div>
            <div className="checkout-breakdown-row total">
              <span>Total Payable</span>
              <span style={{ color: '#D66C3E' }}>{formatINR(totalPaise)}</span>
            </div>
          </div>

          {/* Reassuring COD Banner */}
          <div className="checkout-cod-banner">
            <Banknote size={20} style={{ flexShrink: 0 }} />
            <div>
              <div>Pay {formatINR(totalPaise)} at the pickup counter</div>
              <div style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 500 }}>
                Cash on Delivery • No online payment required
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="checkout-submit-btn"
          >
            <CheckCircle size={19} />
            <span>{submitting ? 'Placing Order...' : `Confirm & Place Order (${formatINR(totalPaise)})`}</span>
          </button>

          <div className="checkout-guarantee-note">
            ✓ Official receipt with barcode & QR code will download automatically and be emailed to you instantly.
          </div>
        </div>
      </div>
    </div>
  );
};
