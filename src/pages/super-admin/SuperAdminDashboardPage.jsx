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
  Store,
  CheckCheck,
  ChefHat
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Page Title & Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div className="super-badge-emerald" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} />
            CONSOLIDATED CAMPUS OVERVIEW
          </div>
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#F8FAFC',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Executive Super Admin Dashboard
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '6px 0 0', lineHeight: 1.4 }}>
            Real-time multi-venue performance monitoring and accurate order counts across JECCAFE and JEC BYTES
          </p>
        </div>

        {/* Action buttons */}
        <div className="super-header-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={fetchOverview}
            disabled={loading}
            style={{
              display: 'inline-flex',
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
            <span>Refresh</span>
          </button>
          <Link
            to="/super-admin/users"
            style={{
              display: 'inline-flex',
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
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={16} />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Accurate Platform-Wide Key Performance Metrics (KPI Cards) */}
      <div className="super-kpi-grid">
        {/* Completed Order Amount (Revenue) */}
        <div className="super-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completed Orders Amount
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399'
            }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#34D399', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            ₹{((stats.completedRevenuePaise ?? stats.totalRevenuePaise ?? 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Today Completed:</span>
            <span style={{ color: '#34D399', fontWeight: 700 }}>
              ₹{((stats.todayCompletedRevenuePaise ?? stats.todayRevenuePaise ?? 0) / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Completed Order Count */}
        <div className="super-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completed Orders Count
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399'
            }}>
              <CheckCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {stats.completedOrders ?? 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Today Completed:</span>
            <span style={{ color: '#34D399', fontWeight: 700 }}>
              {stats.todayCompletedOrders ?? 0} orders
            </span>
          </div>
        </div>

        {/* Accepted Orders Count */}
        <div className="super-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Accepted Orders Count
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60A5FA'
            }}>
              <ChefHat size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {stats.acceptedOrders ?? 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Today Accepted:</span>
            <span style={{ color: '#60A5FA', fontWeight: 700 }}>
              {stats.todayAcceptedOrders ?? 0} orders
            </span>
          </div>
        </div>

        {/* Total Orders Placed */}
        <div className="super-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Orders Placed
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FBBF24'
            }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {stats.totalOrders ?? 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>All Statuses Combined:</span>
            <span style={{ color: '#FBBF24', fontWeight: 700 }}>
              Today: {stats.todayOrders ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Side-By-Side 2-Café Comparative Breakdown */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              2-Café Accurate Breakdown
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '3px 0 0' }}>
              Side-by-side performance indicators between JECCAFE and JEC BYTES
            </p>
          </div>
          <Link
            to="/super-admin/reports"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#10B981',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>View In-Depth 2-Café Reports</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="super-comparative-grid">
          {cafes.map((cafe) => {
            const isJeccafe = cafe.slug === 'jeccafe';
            const themeBg = isJeccafe ? 'rgba(234, 88, 12, 0.08)' : 'rgba(2, 132, 199, 0.08)';
            const themeBorder = isJeccafe ? 'rgba(234, 88, 12, 0.28)' : 'rgba(2, 132, 199, 0.28)';
            const badgeColor = isJeccafe ? '#FB923C' : '#38BDF8';

            return (
              <div
                key={cafe.id}
                className="super-card"
                style={{
                  border: `1.5px solid ${themeBorder}`,
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                  position: 'relative'
                }}
              >
                {/* Café Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
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
                        <span className={isJeccafe ? 'super-badge-orange' : 'super-badge-cyan'}>
                          {cafe.slug.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Campus Venue •</span>
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
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: themeBg,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeBorder}`
                    }}
                  >
                    <span>View Orders</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>

                {/* Café Accurate Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '1.25rem' }}>
                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Completed Revenue
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
                      ₹{((cafe.completedRevenuePaise ?? cafe.totalRevenuePaise ?? 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Completed Orders
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px' }}>
                      {cafe.completedOrders ?? 0}
                    </div>
                  </div>

                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Accepted Orders
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60A5FA', marginTop: '4px' }}>
                      {cafe.acceptedOrders ?? 0}
                    </div>
                  </div>

                  <div style={{
                    background: '#0B111D',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Total Placed
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#CBD5E1', marginTop: '4px' }}>
                      {cafe.totalOrders || 0}
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
                    <span>Open /{cafe.slug}/admin</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
