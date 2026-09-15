import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { ArrowLeft, Printer, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, Coffee, Zap } from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Accepted', 'Preparing', 'Ready for Pickup', 'Completed'];

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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
    window.open(`http://localhost:5000/api/orders/${orderId}/receipt`, '_blank');
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
    <div className="app-container" style={{ maxWidth: '820px' }}>
      <button
        onClick={() => navigate('/my-orders')}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.25rem', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Order History</span>
      </button>

      {/* Main Order Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid var(--divider)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Order #{order.orderNumber}
              </h1>
              <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Placed at {order.cafeId?.name} • {formatKolkataTime(order.createdAt)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrintReceipt} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
              <Printer size={15} />
              <span>Print Receipt</span>
            </button>
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="btn btn-outline btn-sm"
                style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
              >
                Cancel Order
              </button>
            )}
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

        {/* Pickup Location Info */}
        <div style={{
          background: 'var(--bg-surface-subtle)',
          padding: '14px 18px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} color="var(--brand-accent)" />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PICKUP COUNTER</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.cafeId?.address}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PAYMENT STATUS</div>
            <div style={{ fontWeight: 700, color: order.paymentStatus === 'Paid' ? 'var(--status-veg)' : '#D97706' }}>
              {order.paymentStatus}
            </div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>GST Taxes & Fees</span>
            <span>{formatINR(order.taxPaise)}</span>
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
