import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { ArrowLeft, Printer, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, Coffee, Zap, Calendar, Mail, QrCode } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qrCode';

const STATUS_STEPS = ['Pending', 'Accepted', 'Preparing', 'Ready for Pickup', 'Completed'];

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (order?.orderNumber || order?._id) {
      const qrData = order.orderNumber || order._id;
      generateQrDataUrl(qrData).then(setQrCodeUrl);
    }
  }, [order?.orderNumber, order?._id]);

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 10000); // Polling every 10s for real-time kitchen updates
    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/my-orders/${orderId}`);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${apiBase}/orders/${orderId}/receipt`, '_blank');
  };

  const handleSendGmailReceipt = async () => {
    try {
      setSendingEmail(true);
      const res = await api.post(`/orders/${orderId}/resend-receipt`);
      toast.success(`Purchase receipt sent to ${order?.customerSnapshot?.email || 'your Gmail'}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch email receipt');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you wish to cancel this order?')) return;
    try {
      setCancelling(true);
      const res = await api.post(`/orders/cancel/${orderId}`, { reason: 'Customer requested cancellation' });
      if (res.success) {
        toast.info('Order has been cancelled');
        loadOrder();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !order) {
    return <div className="app-container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading order status...</div>;
  }

  if (!order) {
    return (
      <div className="app-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <button onClick={() => navigate('/my-orders')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Orders
        </button>
      </div>
    );
  }

  const isJeccafe = order.cafeId?.slug === 'jeccafe';
  const isCancelled = order.orderStatus === 'Cancelled';
  const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);
  const canCancel = ['Pending', 'Accepted'].includes(order.orderStatus);

  return (
    <div className="app-container" style={{ maxWidth: '820px', padding: '2rem 1rem' }}>
      <button
        onClick={() => navigate('/my-orders')}
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
        <span>Back to Order History</span>
      </button>

      {/* Main Order Card */}
      <div className="card" style={{
        padding: '2rem',
        marginBottom: '1.5rem',
        background: '#FFFFFF',
        border: '1.5px solid #EADBCC',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(50, 30, 15, 0.04)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid #EADBCC',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.2rem, 3.5vw, 1.75rem)',
                fontWeight: 800,
                color: '#1E140E',
                margin: 0,
                letterSpacing: '-0.02em',
                wordBreak: 'break-word'
              }}>
                Order #{order.orderNumber}
              </h1>
              <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#7A6E63', marginTop: '4px', fontWeight: 500 }}>
              Placed at {order.cafeId?.name} • {formatKolkataTime(order.createdAt)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handlePrintReceipt}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 0.9rem',
                borderRadius: '16px',
                border: '1.5px solid #EADBCC',
                background: '#FFFFFF',
                color: '#1E140E',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Printer size={14} color="#D66C3E" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>

        {/* Live Status Progress Bar */}
        {!isCancelled ? (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem' }}>
              LIVE KITCHEN PROGRESS
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connecting line */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '20px',
                right: '20px',
                height: '4px',
                background: '#E7E0D8',
                zIndex: 1
              }} />

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step} style={{ textAlign: 'center', zIndex: 2, position: 'relative', flex: 1 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isPassed ? 'var(--brand-accent)' : '#FFFFFF',
                      border: `3px solid ${isPassed ? 'var(--brand-accent)' : '#CBD5E1'}`,
                      color: isPassed ? '#FFFFFF' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      boxShadow: isCurrent ? '0 0 0 4px var(--brand-glow)' : 'none'
                    }}>
                      {isPassed ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 800 : isPassed ? 600 : 500,
                      color: isCurrent ? 'var(--brand-accent)' : isPassed ? 'var(--text-main)' : 'var(--text-muted)'
                    }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            <div>
              <strong>This order has been cancelled.</strong>
              {order.cancellation?.reason && <div style={{ fontSize: '0.85rem' }}>Reason: {order.cancellation.reason}</div>}
            </div>
          </div>
        )}

        {/* Pickup Location & Scheduled Time Info */}
        <div style={{
          background: 'var(--bg-surface-subtle)',
          padding: '16px 20px',
          borderRadius: '14px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="var(--brand-accent)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>PICKUP COUNTER</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.cafeId?.address || 'Counter'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} color="var(--brand-accent)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>SCHEDULED PICKUP</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {order.pickupDate || 'Today'}
              </div>
            </div>
          </div>
        </div>

        {/* Counter Pickup QR Code Box */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid var(--border-light)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Order Pickup QR Code"
                width="100"
                height="100"
                style={{ borderRadius: '10px', display: 'block', border: '1px solid #E2E8F0' }}
              />
            ) : (
              <div style={{ width: '100px', height: '100px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
                <QrCode size={16} />
                <span>COUNTER PICKUP QR CODE</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '2px' }}>
                Order #{order.orderNumber}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '320px' }}>
                Show this QR code to the staff at <strong>{order.cafeId?.name}</strong> counter for verification & instant handover.
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${order.orderStatus === 'Completed' ? 'badge-status-completed' : 'badge-status-ready'}`}>
              {order.orderStatus === 'Completed' ? 'Handed Over / Delivered' : 'Ready for Counter Scan'}
            </span>
          </div>
        </div>

        {/* Itemized Purchased Combos */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Purchased Combos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--divider)'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {item.quantity}x {item.name}
                </div>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.selectedOptions.map(o => `+ ${o.optionName} (${o.extraPricePaise > 0 ? formatINR(o.extraPricePaise) : 'Free'})`).join(' • ')}
                  </div>
                )}
                {item.fixedItemsSnapshot && item.fixedItemsSnapshot.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    Includes: {item.fixedItemsSnapshot.map(f => `${f.quantity}x ${f.name}`).join(', ')}
                  </div>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                {formatINR(item.totalPricePaise)}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Totals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>{formatINR(order.subtotalPaise)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--divider)',
            paddingTop: '8px',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--text-main)'
          }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--brand-accent)' }}>{formatINR(order.totalPaise)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
