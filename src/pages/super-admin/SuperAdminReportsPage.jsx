import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  Store,
  CreditCard,
  Sparkles,
  PieChart,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const SuperAdminReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30days');
  const toast = useToast();

  const fetchReport = async (selectedRange = range) => {
    try {
      setLoading(true);
      const res = await api.get(`/super-admin/reports?range=${selectedRange}`);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch 2-café comparative report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(range);
  }, [range]);

  const handleExportCSV = () => {
    window.open(`${api.defaults.baseURL}/super-admin/reports/export-csv?range=${range}`, '_blank');
  };

  const consolidated = data?.consolidated || {};
  const cafes = data?.cafes || [];
  const totalRevenue = consolidated.revenuePaise || 0;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Title & Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div className="super-badge-emerald" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} />
            EXECUTIVE CONSOLIDATED AUDIT
          </div>
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#F8FAFC',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            2-Café Consolidated & Comparative Reports
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '6px 0 0', lineHeight: 1.4 }}>
            Multi-venue revenue analysis, customer demand comparison, and sales performance across campus
          </p>
        </div>

        <div className="super-header-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => fetchReport()}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              background: 'rgba(30, 41, 59, 0.8)',
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
          <button
            onClick={handleExportCSV}
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
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Download size={16} />
            <span>Export Multi-Café CSV</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div className="super-filter-bar">
          <Calendar size={15} color="#94A3B8" style={{ marginLeft: '4px', flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginRight: '4px', whiteSpace: 'nowrap' }}>
            Timeframe:
          </span>
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' }
          ].map((btn) => {
            const isSelected = range === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setRange(btn.id)}
                className={`super-filter-pill ${isSelected ? 'active' : ''}`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Consolidated Overview Cards */}
      <div className="super-kpi-grid">
        {/* Total Sales */}
        <div className="super-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Combined Platform Sales
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399'
            }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#34D399', letterSpacing: '-0.02em' }}>
            ₹{((consolidated.revenuePaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>Across {cafes.length} campus venues</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="super-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Combined Completed Orders
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(96, 165, 250, 0.12)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60A5FA'
            }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '-0.02em' }}>
            {consolidated.paidOrdersCount || 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '6px' }}>
            Total completed transactions
          </div>
        </div>

        {/* Average Order Value */}
        <div className="super-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Platform Avg Order Value (AOV)
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FBBF24'
            }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#FBBF24', letterSpacing: '-0.02em' }}>
            ₹{((consolidated.averageOrderValuePaise || 0) / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '6px' }}>
            Average basket size per customer
          </div>
        </div>
      </div>

      {/* Proportional Revenue Share Comparison Bar */}
      {cafes.length > 0 && totalRevenue > 0 && (
        <div className="super-card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="#10B981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>
                Campus Revenue Contribution Share
              </span>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              {cafes.map((c) => {
                const isJeccafe = c.cafe.slug === 'jeccafe';
                const share = totalRevenue > 0 ? Math.round(((c.paidRevenuePaise || 0) / totalRevenue) * 100) : 0;
                return (
                  <div key={c.cafe.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: isJeccafe ? '#FB923C' : '#38BDF8'
                    }}></span>
                    <span style={{ fontWeight: 700, color: '#F1F5F9' }}>{c.cafe.name}:</span>
                    <span style={{ fontWeight: 800, color: isJeccafe ? '#FB923C' : '#38BDF8' }}>{share}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segmented Bar */}
          <div style={{
            height: '14px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'flex'
          }}>
            {cafes.map((c) => {
              const isJeccafe = c.cafe.slug === 'jeccafe';
              const share = totalRevenue > 0 ? ((c.paidRevenuePaise || 0) / totalRevenue) * 100 : 50;
              return (
                <div
                  key={c.cafe.id}
                  style={{
                    width: `${share}%`,
                    height: '100%',
                    background: isJeccafe
                      ? 'linear-gradient(90deg, #EA580C 0%, #FB923C 100%)'
                      : 'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)',
                    transition: 'width 0.5s ease'
                  }}
                  title={`${c.cafe.name}: ${share.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Side-by-Side 2-Café Comparative Deep Dive */}
      <div className="super-comparative-grid">
        {cafes.map((item) => {
          const isJeccafe = item.cafe.slug === 'jeccafe';
          const themeColor = isJeccafe ? '#EA580C' : '#0284C7';
          const badgeColor = isJeccafe ? '#FB923C' : '#38BDF8';
          const themeBorder = isJeccafe ? 'rgba(234, 88, 12, 0.35)' : 'rgba(2, 132, 199, 0.35)';

          return (
            <div
              key={item.cafe.id}
              className="super-card"
              style={{
                border: `1.5px solid ${themeBorder}`,
                boxShadow: `0 12px 32px rgba(0, 0, 0, 0.45)`
              }}
            >
              {/* Café Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                paddingBottom: '1rem',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: badgeColor,
                    boxShadow: `0 0 12px ${badgeColor}`
                  }}></span>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                    {item.cafe.name} Report
                  </h2>
                </div>
                <span className={isJeccafe ? 'super-badge-orange' : 'super-badge-cyan'}>
                  {item.cafe.slug.toUpperCase()}
                </span>
              </div>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ background: '#0B111D', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Sales Revenue
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
                    ₹{((item.paidRevenuePaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ background: '#0B111D', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Orders Fulfilled
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px' }}>
                    {item.paidOrdersCount || 0}
                  </div>
                </div>

                <div style={{ background: '#0B111D', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Avg Order Value
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
                    ₹{((item.averageOrderValuePaise || 0) / 100).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Top Selling Items */}
              <div>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#CBD5E1',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Top Performing Menu Items ({item.cafe.name})
                </div>
                {item.topItems?.length === 0 ? (
                  <div style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: '#64748B',
                    background: '#0B111D',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    No items recorded for this timeframe.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.topItems.map((prod, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: '#0B111D',
                          border: '1px solid #1E293B',
                          fontSize: '0.84rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: idx === 0 ? '#FBBF24' : idx === 1 ? '#CBD5E1' : '#94A3B8',
                            width: '20px',
                            flexShrink: 0
                          }}>
                            #{idx + 1}
                          </span>
                          <span style={{
                            fontWeight: 600,
                            color: '#F8FAFC',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {prod.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                            {prod.quantity} sold
                          </span>
                          <span style={{ fontWeight: 700, color: '#34D399' }}>
                            ₹{((prod.revenuePaise || 0) / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
