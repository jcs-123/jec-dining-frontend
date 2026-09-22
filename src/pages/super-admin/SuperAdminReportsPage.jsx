import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  RefreshCw,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Award,
  Store,
  CreditCard,
  Zap
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

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title & Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            2-Café Consolidated & Comparative Reports
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Multi-venue revenue analysis, customer demand comparison, and sales performance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => fetchReport()}
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
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
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
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Download size={16} />
            Export Multi-Café CSV
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        background: '#111B2C',
        padding: '8px 12px',
        borderRadius: '14px',
        border: '1px solid #1E2E4A',
        width: 'fit-content'
      }}>
        <Calendar size={16} color="#64748B" style={{ marginLeft: '4px' }} />
        <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginRight: '6px' }}>Timeframe:</span>
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
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 800 : 600,
                background: isSelected ? '#10B981' : 'transparent',
                color: isSelected ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Platform Consolidated Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #131E33 0%, #0D1625 100%)',
          border: '1px solid #1E2E4A',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
            Combined Platform Sales
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#34D399', marginTop: '6px' }}>
            ₹{((consolidated.revenuePaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
            Across all {cafes.length} campus venues
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #131E33 0%, #0D1625 100%)',
          border: '1px solid #1E2E4A',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
            Combined Paid Orders
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#60A5FA', marginTop: '6px' }}>
            {consolidated.paidOrdersCount || 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
            Total completed transactions
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #131E33 0%, #0D1625 100%)',
          border: '1px solid #1E2E4A',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
            Platform Average Order Value (AOV)
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FBBF24', marginTop: '6px' }}>
            ₹{((consolidated.averageOrderValuePaise || 0) / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
            Average basket size
          </div>
        </div>
      </div>

      {/* Side-by-Side 2-Café Comparative Deep Dive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {cafes.map((item) => {
          const isJeccafe = item.cafe.slug === 'jeccafe';
          const themeColor = isJeccafe ? '#EA580C' : '#0284C7';
          const badgeColor = isJeccafe ? '#FB923C' : '#38BDF8';
          const themeBorder = isJeccafe ? 'rgba(234, 88, 12, 0.3)' : 'rgba(2, 132, 199, 0.3)';

          return (
            <div
              key={item.cafe.id}
              style={{
                background: 'linear-gradient(170deg, #111B2C 0%, #0D1524 100%)',
                border: `1.5px solid ${themeBorder}`,
                borderRadius: '20px',
                padding: '1.75rem',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)'
              }}
            >
              {/* Café Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: badgeColor }}></span>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                    {item.cafe.name} Report
                  </h2>
                </div>
                <span style={{
                  padding: '3px 9px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: isJeccafe ? 'rgba(234, 88, 12, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                  color: badgeColor,
                  border: `1px solid ${themeBorder}`
                }}>
                  {item.cafe.slug.toUpperCase()}
                </span>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#0B111D', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Paid Sales Revenue</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
                    ₹{((item.paidRevenuePaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ background: '#0B111D', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Orders Fulfilled</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', marginTop: '4px' }}>
                    {item.paidOrdersCount || 0}
                  </div>
                </div>

                <div style={{ background: '#0B111D', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Average Order Value</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
                    ₹{((item.averageOrderValuePaise || 0) / 100).toFixed(2)}
                  </div>
                </div>

                <div style={{ background: '#0B111D', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Tax Collected (GST)</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#94A3B8', marginTop: '4px' }}>
                    ₹{((item.taxPaise || 0) / 100).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Top Selling Items */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Top Performing Menu Items ({item.cafe.name})
                </div>
                {item.topItems?.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B', background: '#0B111D', borderRadius: '12px' }}>
                    No items sold in this timeframe.
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', width: '18px' }}>
                            #{idx + 1}
                          </span>
                          <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{prod.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{prod.quantity} sold</span>
                          <span style={{ fontWeight: 700, color: '#34D399' }}>₹{((prod.revenuePaise || 0) / 100).toFixed(2)}</span>
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
