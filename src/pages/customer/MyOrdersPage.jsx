import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { ShoppingBag, ChevronRight, Clock, Coffee, Zap } from 'lucide-react';

export const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/my-orders');
    } else if (user) {
      loadOrders();
    }
  }, [user, authLoading, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load my orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="app-container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading your orders...</div>;
  }

  return (
    <div className="app-container" style={{ maxWidth: '840px', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: '2rem',
          fontWeight: 800,
          color: '#1E140E',
          letterSpacing: '-0.02em',
          margin: '0 0 6px'
        }}>
          My Order History
        </h1>
        <p style={{ color: '#7A6E63', fontSize: '0.92rem', margin: 0, fontWeight: 500 }}>
          Track past and active orders across JECCAFE and JEC BYTES
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          background: '#FFFFFF',
          border: '1.5px solid #EADBCC',
          borderRadius: '18px',
          boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
        }}>
          <ShoppingBag size={48} color="#D66C3E" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.3rem', fontWeight: 800, color: '#1E140E', marginBottom: '0.5rem' }}>
            No orders yet
          </h3>
          <p style={{ color: '#7A6E63', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You haven't placed any combo orders yet.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.65rem 1.4rem',
              borderRadius: '24px',
              background: '#1A1816',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(26, 24, 22, 0.2)'
            }}
          >
            Explore Cafés & Combos
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((o) => {
            const isJeccafe = o.cafeId?.slug === 'jeccafe';

            return (
              <Link
                key={o._id}
                to={`/order/${o._id}`}
                className="my-order-card"
              >
                <div className="my-order-left">
                  <div
                    className="my-order-icon"
                    style={{
                      background: isJeccafe
                        ? 'linear-gradient(135deg, #361D11 0%, #7E4323 100%)'
                        : 'linear-gradient(135deg, #0A3D40 0%, #157E82 100%)'
                    }}
                  >
                    {isJeccafe ? <Coffee size={22} /> : <Zap size={22} />}
                  </div>

                  <div className="my-order-details">
                    <div className="my-order-header-row">
                      <span className="my-order-number">
                        #{o.orderNumber}
                      </span>
                      <span className={`badge ${getStatusBadgeClass(o.orderStatus)}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        {o.orderStatus}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#7A6E63', marginBottom: '4px', fontWeight: 500, wordBreak: 'break-word' }}>
                      {o.cafeId?.name || 'Campus Dining'} • {formatKolkataTime(o.createdAt)}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#4A423B', opacity: 0.9, wordBreak: 'break-word' }}>
                      {o.items.map(i => `${i.name || i.comboName || 'Combo'} (${i.quantity || 1}x)`).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="my-order-right">
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: o.paymentStatus === 'Paid' ? '#15803D' : '#9A3412',
                    background: o.paymentStatus === 'Paid' ? '#DCFCE7' : '#FFEDD5',
                    border: o.paymentStatus === 'Paid' ? '1px solid #86EFAC' : '1px solid #FDBA74',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    {o.paymentStatus || 'Cash on Delivery'}
                  </span>

                  <div className="my-order-right-action" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="my-order-price">
                      {formatINR(o.totalPaise)}
                    </div>
                    <ChevronRight size={18} color="#8C7E74" style={{ flexShrink: 0 }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
