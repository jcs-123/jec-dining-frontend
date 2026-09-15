import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime } from '../../utils/formatters';
import { CheckCircle2, Clock, MapPin, Printer, ArrowRight, ShoppingBag } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/my-orders/${orderId}`);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.open(`http://localhost:5000/api/orders/${orderId}/receipt`, '_blank');
  };

  if (loading) {
    return <div className="app-container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading confirmation...</div>;
  }

  if (!order) {
    return (
      <div className="app-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ maxWidth: '680px', padding: '2rem 1rem' }}>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '24px', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#DCFCE7',
          color: '#16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={42} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
          Your order has been received by <strong>{order.cafeId?.name}</strong> kitchen staff.
        </p>

        {/* Order Number Badge */}
        <div style={{
          background: 'var(--bg-surface-subtle)',
          border: '2px dashed var(--brand-accent)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'inline-block',
          minWidth: '280px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            YOUR PICKUP ORDER NUMBER
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.05em', marginTop: '4px' }}>
            #{order.orderNumber}
          </div>
        </div>

        {/* Pickup Details Card */}
        <div style={{
          textAlign: 'left',
          background: 'var(--bg-surface-subtle)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <MapPin size={18} color="var(--brand-accent)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Pickup Location:</span>
            <span>{order.cafeId?.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="var(--brand-accent)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Estimated Time:</span>
            <span>Approx. {order.pickupEstimatedMinutes || 20} minutes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button onClick={handlePrintReceipt} className="btn btn-outline" style={{ gap: '8px' }}>
            <Printer size={18} />
            <span>Print Receipt</span>
          </button>
          <Link to={`/order/${order._id}`} className="btn btn-primary" style={{ gap: '8px' }}>
            <span>Live Order Status</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
