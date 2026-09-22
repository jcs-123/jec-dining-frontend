import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Store
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const SuperAdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/overview');
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch platform metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = data?.stats || {};
  const cafes = data?.cafes || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Title & Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#34D399',
            marginBottom: '8px'
          }}>
            <Sparkles size={13} />
            CONSOLIDATED CAMPUS OVERVIEW
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            Executive Super Admin Dashboard
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Real-time multi-venue performance monitoring across JECCAFE and JEC BYTES
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchOverview}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#CBD5E1',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            to="/super-admin/users"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Users size={16} />
            Add / Manage Users
          </Link>
        </div>
      </div>

      {/* 1. Platform-Wide Key Performance Metrics (KPI Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Total Revenue */}
        <div style={{
          background: 'linear-gradient(145deg, #131E33 0%, #0D1625 100%)',
          border: '1px solid #1E2E4A',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Campus Revenue
            </span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399'
            }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            ₹{((stats.totalRevenuePaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
            Today: <span style={{ color: '#34D399', fontWeight: 700 }}>₹{((stats.todayRevenuePaise || 0) / 100).toFixed(2)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div style={{
          background: 'linear-gradient(145deg, #131E33 0%, #0D1625 100%)',
          border: '1px solid #1E2E4A',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Orders Placed
            </span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60A5FA'
            }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {stats.totalOrders || 0}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
            Today: <span style={{ color: '#60A5FA', fontWeight: 700 }}>{stats.todayOrders || 0} orders</span>
          </div>
        </div>

        {/* Registered Customers */}
        <div style={{
          background: 'linear-gradient(145deg, #131E33 0%, #0D1625 100%)',
          border: '1px solid #1E2E4A',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Registered Students / Staff
            </span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C084FC'
            }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {stats.totalCustomers || 0}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
            Active Campus Customers
          </div>
        </div>

        {/* Managed Venues */}
        <div style={{
          background: 'linear-gradient(145deg, #131E33 0%, #0D1625 100%)',
          border: '1px solid #1E2E4A',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Campus Venues
            </span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FBBF24'
            }}>
              <Store size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {cafes.length} Cafés Active
          </div>
          <div style={{ fontSize: '0.76rem', color: '#34D399', fontWeight: 600 }}>
            ● JECCAFE & JEC BYTES Online
          </div>
        </div>
      </div>

      {/* 2. Side-By-Side 2-Café Comparative Breakdown */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              2-Café Operational Breakdown
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '3px 0 0' }}>
              Side-by-side performance indicators between both campus cafés
            </p>
          </div>
          <Link
            to="/super-admin/reports"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#10B981',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View In-Depth 2-Café Reports <ArrowUpRight size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
          {cafes.map((cafe) => {
            const isJeccafe = cafe.slug === 'jeccafe';
            const themeColor = isJeccafe ? '#EA580C' : '#0284C7';
            const themeBg = isJeccafe ? 'rgba(234, 88, 12, 0.08)' : 'rgba(2, 132, 199, 0.08)';
            const themeBorder = isJeccafe ? 'rgba(234, 88, 12, 0.25)' : 'rgba(2, 132, 199, 0.25)';
            const badgeColor = isJeccafe ? '#FB923C' : '#38BDF8';

            return (
              <div
                key={cafe.id}
                style={{
                  background: 'linear-gradient(170deg, #111B2C 0%, #0D1524 100%)',
                  border: `1.5px solid ${themeBorder}`,
                  borderRadius: '20px',
                  padding: '1.75rem',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                  position: 'relative'
                }}
              >
                {/* Café Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: themeBg,
                      border: `1px solid ${themeBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: badgeColor
                    }}>
                      <Store size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                          {cafe.name}
                        </h3>
                        <span style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: themeBg,
                          color: badgeColor,
                          border: `1px solid ${themeBorder}`,
                          textTransform: 'uppercase'
                        }}>
                          {cafe.slug}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Campus Food Counter •</span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: cafe.isOpen !== false ? '#10B981' : '#EF4444',
                          fontWeight: 700
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: cafe.isOpen !== false ? '#10B981' : '#EF4444'
                          }}></span>
                          {cafe.isOpen !== false ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/super-admin/orders?cafe=${cafe.slug}`}
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: badgeColor,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: themeBg,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeBorder}`
                    }}
                  >
                    View Orders <ChevronRight size={13} />
                  </Link>
                </div>

                {/* Café 4-Box Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                      All-Time Revenue
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px' }}>
                      ₹{((cafe.totalRevenuePaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                      Today's Revenue
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
                      ₹{((cafe.todayRevenuePaise || 0) / 100).toFixed(2)}
                    </div>
                  </div>

                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                      Total Orders
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px' }}>
                      {cafe.totalOrders || 0}
                    </div>
                  </div>

                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                      Pending Fulfillment
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: cafe.pendingOrders > 0 ? '#F59E0B' : '#94A3B8', marginTop: '4px' }}>
                      {cafe.pendingOrders || 0}
                    </div>
                  </div>
                </div>

                {/* Direct Admin Link for this cafe */}
                <div style={{
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.76rem',
                  color: '#64748B'
                }}>
                  <span>Manager Portal:</span>
                  <a
                    href={`/${cafe.slug}/admin/login`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: badgeColor, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Open /{cafe.slug}/admin <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Combined Recent Orders Stream (Cross-Café) */}
      <div style={{
        background: 'linear-gradient(175deg, #111B2C 0%, #0D1524 100%)',
        border: '1px solid #1E2E4A',
        borderRadius: '20px',
        padding: '1.75rem',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Recent Orders Across Both Cafés
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '3px 0 0' }}>
              Real-time campus order flow across JECCAFE and JEC BYTES
            </p>
          </div>
          <Link
            to="/super-admin/orders"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#10B981',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All Orders Table <ChevronRight size={15} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            No recent orders placed yet on the campus platform.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E293B', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Order #</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Café</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Items</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Payment</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const isJeccafe = order.cafeId?.slug === 'jeccafe';
                  const cafeBadgeBg = isJeccafe ? 'rgba(234, 88, 12, 0.15)' : 'rgba(2, 132, 199, 0.15)';
                  const cafeBadgeColor = isJeccafe ? '#FB923C' : '#38BDF8';
                  const cafeBorder = isJeccafe ? 'rgba(234, 88, 12, 0.3)' : 'rgba(2, 132, 199, 0.3)';

                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: cafeBadgeBg,
                          border: `1px solid ${cafeBorder}`,
                          color: cafeBadgeColor,
                          fontWeight: 700,
                          fontSize: '0.74rem'
                        }}>
                          {order.cafeId?.name || 'Café'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#CBD5E1' }}>
                        <div style={{ fontWeight: 600 }}>{order.customerSnapshot?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{order.customerSnapshot?.phone}</div>
                      </td>
                      <td style={{ padding: '14px', color: '#94A3B8' }}>
                        {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ') || 'Items'}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                        ₹{((order.totalPaise || 0) / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: order.orderStatus === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: order.orderStatus === 'Completed' ? '#34D399' : '#FBBF24'
                        }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: order.paymentStatus === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: order.paymentStatus === 'Paid' ? '#34D399' : '#F87171'
                        }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#64748B', fontSize: '0.75rem' }}>
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
