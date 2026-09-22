import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatusTransitionModal } from '../../components/admin/StatusTransitionModal';
import { AdminReceiptModal } from '../../components/admin/AdminReceiptModal';
import {
  ShoppingBag,
  RefreshCw,
  Printer,
  ChevronRight,
  UtensilsCrossed,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const cafeSlug = user?.cafe?.slug || 'jeccafe';
  const cafeName = user?.cafe?.name || 'JECCAFE';

  const [allTimeReport, setAllTimeReport] = useState(null);
  const [todayReport, setTodayReport] = useState(null);
  const [comboCount, setComboCount] = useState(0);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 12000); // Auto-poll every 12 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];

      const [allTimeRes, todayRes, combosRes, ordersRes] = await Promise.all([
        api.get('/reports/sales'),
        api.get(`/reports/sales?startDate=${todayStr}`),
        api.get('/combos/admin/list'),
        api.get('/orders/admin/list?isToday=true&limit=50')
      ]);

      if (allTimeRes.success && allTimeRes.report) {
        setAllTimeReport(allTimeRes.report);
      }
      if (todayRes.success && todayRes.report) {
        setTodayReport(todayRes.report);
      }
      if (combosRes.success && combosRes.combos) {
        setComboCount(combosRes.combos.length);
      }
      if (ordersRes.success && ordersRes.orders) {
        setTodayOrders(ordersRes.orders);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = (order) => {
    setSelectedReceiptOrder(order);
  };

  const todaySummary = todayReport?.summary || {
    grossCollectedPaise: 0,
    netCollectedPaise: 0,
    totalOrders: 0,
    paidOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };

  const allTimeSummary = allTimeReport?.summary || {
    grossCollectedPaise: 0,
    netCollectedPaise: 0,
    totalOrders: 0,
    paidOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };

  const todayDateFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div>
      {/* Top Header */}
      <AdminHeader
        title="Dashboard Overview"
        subtitle={`Live performance metrics & today's orders for ${cafeName}`}
      />

      <div className="admin-page-container">
        {/* 1. Four Specific Requested KPI Cards */}
        <div className="admin-kpi-grid">
          {/* Card 1: Today's Order Amount */}
          <div className="kpi-card kpi-orange">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TODAY'S ORDER AMOUNT
                </div>
                <div style={{
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                  fontWeight: 800,
                  color: '#1E140E',
                  marginTop: '4px',
                  fontFamily: "'Fraunces', Georgia, serif"
                }}>
                  {formatINR(todaySummary.grossCollectedPaise)}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹</span>
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              From {todaySummary.paidOrders} paid orders today ({todayDateFormatted})
            </div>
          </div>

          {/* Card 2: Total Amount */}
          <div className="kpi-card kpi-green">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TOTAL AMOUNT (LIFETIME)
                </div>
                <div style={{
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                  fontWeight: 800,
                  color: '#16A34A',
                  marginTop: '4px',
                  fontFamily: "'Fraunces', Georgia, serif"
                }}>
                  {formatINR(allTimeSummary.grossCollectedPaise)}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              Lifetime collected across all {allTimeSummary.paidOrders} paid orders
            </div>
          </div>

          {/* Card 3: Total Order Count */}
          <div className="kpi-card kpi-blue">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TOTAL ORDER COUNT
                </div>
                <div style={{
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                  fontWeight: 800,
                  color: '#1E140E',
                  marginTop: '4px',
                  fontFamily: "'Fraunces', Georgia, serif"
                }}>
                  {allTimeSummary.totalOrders}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              {todaySummary.totalOrders} placed today • {allTimeSummary.completedOrders} completed
            </div>
          </div>

          {/* Card 4: Total Combo Count */}
          <div className="kpi-card kpi-amber">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TOTAL COMBO COUNT
                </div>
                <div style={{
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                  fontWeight: 800,
                  color: '#1E140E',
                  marginTop: '4px',
                  fontFamily: "'Fraunces', Georgia, serif"
                }}>
                  {comboCount}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <UtensilsCrossed size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              Active and configured combos in {cafeName} catalog
            </div>
          </div>
        </div>

        {/* 2. Today's Date Orders Show Table */}
        <div className="order-queue-card">
          <div className="order-queue-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#FDF1EA',
                color: '#D66C3E',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={18} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#1E140E',
                  margin: 0
                }}>
                  Today's Orders ({todayDateFormatted})
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#7A6E63', marginTop: '2px' }}>
                  {todayOrders.length} {todayOrders.length === 1 ? 'order' : 'orders'} placed today for {cafeName}
                </div>
              </div>
            </div>

            <Link
              to={`/${cafeSlug}/admin/orders`}
              className="btn btn-outline btn-sm"
              style={{
                gap: '5px',
                borderColor: '#EADBCC',
                background: '#FFFDF9',
                color: '#382A20',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              <span>View All Orders</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {todayOrders.length === 0 ? (
            <div style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              color: '#7A6E63',
              fontSize: '0.88rem',
              fontWeight: 500
            }}>
              No orders recorded for today ({todayDateFormatted}) yet. New orders will appear here automatically.
            </div>
          ) : (
            <div className="table-responsive" style={{ display: 'block', margin: 0 }}>
              <table className="data-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Time (IST)</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayOrders.map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 800, color: '#D66C3E' }}>#{o.orderNumber}</td>
                      <td style={{ fontSize: '0.8rem', color: '#7A6E63' }}>
                        {formatKolkataTime(o.createdAt)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.customerSnapshot?.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#7A6E63' }}>
                          {o.customerSnapshot?.phone || 'N/A'}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.84rem' }}>
                        {o.items.map((i, idx) => (
                          <div key={idx}>
                            <strong>{i.quantity}x</strong> {i.name}
                          </div>
                        ))}
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatINR(o.totalPaise)}</td>
                      <td>
                        <span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-status-completed' : 'badge-status-pending'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(o.orderStatus)}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedOrderForStatus(o)}
                            className="btn btn-primary btn-sm"
                            style={{ borderRadius: '8px', padding: '4px 10px', fontSize: '0.78rem' }}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(o)}
                            className="btn btn-outline btn-sm"
                            title="Generate & Print Receipt"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              borderColor: '#EADBCC',
                              color: '#D66C3E',
                              background: '#FFFDF9',
                              fontWeight: 700,
                              borderRadius: '8px',
                              padding: '4px 10px',
                              fontSize: '0.78rem'
                            }}
                          >
                            <Printer size={13} />
                            <span>Bill</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Status Modal */}
      <StatusTransitionModal
        isOpen={!!selectedOrderForStatus}
        onClose={() => setSelectedOrderForStatus(null)}
        order={selectedOrderForStatus}
        onOrderUpdated={loadDashboardData}
      />

      {/* Premium Receipt Modal */}
      <AdminReceiptModal
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
        order={selectedReceiptOrder}
        cafe={user?.cafe}
      />
    </div>
  );
};
