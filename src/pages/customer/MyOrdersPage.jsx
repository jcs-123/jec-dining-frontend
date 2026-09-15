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
    <div className="app-container" style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>My Order History</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Track past and active orders across JECCAFE and JEC BYTEST
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <ShoppingBag size={48} color="var(--brand-accent)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You haven't placed any combo orders yet.
          </p>
          <Link to="/" className="btn btn-primary">
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
                className="card card-interactive"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    background: isJeccafe ? '#2E1C14' : '#0C383E',
                    color: isJeccafe ? '#C86D44' : '#E86034',
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isJeccafe ? <Coffee size={22} /> : <Zap size={22} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        #{o.orderNumber}
                      </span>
                      <span className={`badge ${getStatusBadgeClass(o.orderStatus)}`}>
                        {o.orderStatus}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {o.cafeId?.name} • {formatKolkataTime(o.createdAt)}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', opacity: 0.9 }}>
                      {o.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
                      {formatINR(o.totalPaise)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: o.paymentStatus === 'Paid' ? 'var(--status-veg)' : '#D97706', fontWeight: 600 }}>
                      {o.paymentStatus}
                    </div>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
