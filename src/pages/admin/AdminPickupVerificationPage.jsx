import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatKolkataTime } from '../../utils/formatters';
import { CheckCircle2, AlertCircle, ArrowLeft, Clock, MapPin, Calendar, QrCode, Phone, User } from 'lucide-react';

export const AdminPickupVerificationPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      // First try admin order detail or list
      const res = await api.get(`/orders/my-orders/${orderId}`).catch(async () => {
        // If customer endpoint fails (e.g. admin session), try admin list query
        return await api.get(`/orders/admin/list?search=${encodeURIComponent(orderId)}`);
      });

      if (res && res.order) {
        setOrder(res.order);
      } else if (res && res.orders && res.orders.length > 0) {
        const matched = res.orders.find(
          (o) =>
            (o.orderNumber && o.orderNumber.toUpperCase() === orderId.toUpperCase()) ||
            (o._id && o._id.toString() === orderId)
        ) || res.orders[0];
        setOrder(matched);
      } else {
        setErrorMsg('Order not found or permission denied');
      }
    } catch (err) {
      console.error('Failed to load order for verification:', err);
      setErrorMsg(err.message || 'Could not load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPickup = async () => {
    try {
      setVerifying(true);
      const targetId = order?._id || orderId;
      const res = await api.post(`/orders/admin/${targetId}/verify-pickup`);
      if (res.success && res.order) {
        setOrder(res.order);
        toast.success(`Order #${res.order.orderNumber} successfully marked as Delivered!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to verify pickup handover');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading order pickup details...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="app-container" style={{ maxWidth: '520px', padding: '3rem 1rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pickup Verification Failed</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {errorMsg || 'Could not verify the scanned order.'}
          </p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = order.orderStatus === 'Completed';

  return (
    <div className="app-container" style={{ maxWidth: '640px', padding: '2rem 1rem' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.25rem', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Order Management</span>
      </button>

      <div className="card" style={{ padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--divider)', paddingBottom: '1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--brand-accent-light)',
            color: 'var(--brand-accent)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            <QrCode size={14} />
            <span>QR PICKUP COUNTER VERIFICATION</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Order #{order.orderNumber}
          </h1>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {order.cafeId?.name || 'JEC Dining'} • Placed {formatKolkataTime(order.createdAt)}
          </div>
        </div>

        {/* Customer Snapshot */}
        <div style={{
          background: 'var(--bg-surface-subtle)',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              <User size={16} color="var(--brand-accent)" />
              <span>{order.customerSnapshot?.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <Phone size={14} />
              <span>{order.customerSnapshot?.phone || 'No phone provided'}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER STATUS</div>
            <div style={{ fontWeight: 800, color: order.orderStatus === 'Completed' ? 'var(--status-veg)' : 'var(--brand-accent)', fontSize: '0.95rem' }}>
              {order.orderStatus}
            </div>
          </div>
        </div>

        {/* Scheduled Time */}
        <div style={{
          background: '#FAF5ED',
          border: '1px solid #EBE0D2',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Calendar size={18} color="var(--brand-accent)" />
          <div style={{ fontSize: '0.875rem' }}>
            <strong>Scheduled Pickup:</strong> {order.pickupDate || 'Today'}
          </div>
        </div>

        {/* Itemized Combos */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>Items to Hand Over</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  fontSize: '0.9rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--brand-accent)', marginRight: '6px' }}>
                    {item.quantity}x
                  </span>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700 }}>{formatINR(item.totalPricePaise)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <div style={{
            background: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <CheckCircle2 size={36} color="#16A34A" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#166534' }}>
              Order Delivered & Completed
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803D', marginTop: '4px' }}>
              This order has been verified and successfully handed over to the customer.
            </div>
          </div>
        ) : (
          <button
            onClick={handleConfirmPickup}
            disabled={verifying}
            className="btn btn-primary btn-full"
            style={{
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: 800,
              gap: '10px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              borderColor: '#16A34A'
            }}
          >
            <CheckCircle2 size={22} />
            <span>{verifying ? 'Updating...' : 'Confirm Pickup & Mark Delivered'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPickupVerificationPage;
