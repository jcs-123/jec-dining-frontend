import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminReceiptModal } from '../../components/admin/AdminReceiptModal';
import {
  ShoppingBag,
  RefreshCw,
  Printer,
  ChevronRight,
  UtensilsCrossed,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

let cachedDashboardState = null;

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const cafeSlug = user?.cafe?.slug || 'jeccafe';
  const cafeName = user?.cafe?.name || 'JECCAFE';

  const [allTimeReport, setAllTimeReport] = useState(cachedDashboardState?.allTimeReport || null);
  const [todayReport, setTodayReport] = useState(cachedDashboardState?.todayReport || null);
  const [comboCount, setComboCount] = useState(cachedDashboardState?.comboCount || 0);
  const [todayOrders, setTodayOrders] = useState(cachedDashboardState?.todayOrders || []);
  const [loading, setLoading] = useState(!cachedDashboardState);
  const [deliveringOrder, setDeliveringOrder] = useState(null);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const handleConfirmDeliver = async () => {
    if (!deliveringOrder) return;
    try {
      setDeliverLoading(true);
      const res = await api.post(`/orders/admin/${deliveringOrder._id}/verify-pickup`, {});
      if (res.success) {
        toast.success(`Order #${deliveringOrder.orderNumber} successfully marked as Delivered!`);
        setDeliveringOrder(null);
        loadDashboardData(false);
      } else {
        toast.error(res.message || 'Failed to deliver order');
      }
    } catch (err) {
      toast.error(err.message || 'Error delivering order');
    } finally {
      setDeliverLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(!cachedDashboardState);
    const interval = setInterval(() => loadDashboardData(false), 12000); // Auto-poll quietly
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];

      const [allTimeRes, todayRes, combosRes, ordersRes] = await Promise.all([
        api.get('/reports/sales?orderStatus=Completed'),
        api.get(`/reports/sales?startDate=${todayStr}&orderStatus=Completed`),
        api.get('/combos/admin/list'),
        api.get('/orders/admin/list?isToday=true&limit=50')
      ]);

      const newAllTime = allTimeRes.success && allTimeRes.report ? allTimeRes.report : allTimeReport;
      const newToday = todayRes.success && todayRes.report ? todayRes.report : todayReport;
      const newCombos = combosRes.success && combosRes.combos ? combosRes.combos.length : comboCount;
      const newOrders = ordersRes.success && ordersRes.orders ? ordersRes.orders : todayOrders;

      if (allTimeRes.success && allTimeRes.report) setAllTimeReport(allTimeRes.report);
      if (todayRes.success && todayRes.report) setTodayReport(todayRes.report);
      if (combosRes.success && combosRes.combos) setComboCount(combosRes.combos.length);
      if (ordersRes.success && ordersRes.orders) setTodayOrders(ordersRes.orders);

      cachedDashboardState = {
        allTimeReport: newAllTime,
        todayReport: newToday,
        comboCount: newCombos,
        todayOrders: newOrders
      };
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      if (isInitial) setLoading(false);
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
    cancelledOrders: 0,
    completedGrossCollectedPaise: 0,
    completedCombosCount: 0
  };

  const allTimeSummary = allTimeReport?.summary || {
    grossCollectedPaise: 0,
    netCollectedPaise: 0,
    totalOrders: 0,
    paidOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    completedGrossCollectedPaise: 0,
    completedCombosCount: 0
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
        {/* 1. Four Specific Requested KPI Cards - Strictly Completed Orders */}
        <div className="admin-kpi-grid">
          {/* Card 1: Today's Order Amount (Completed) */}
          <div className="kpi-card kpi-orange">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 700, letterSpacing: '0.04em' }}>
                  DAY'S ORDER AMOUNT
                </div>
                <div style={{
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                  fontWeight: 800,
                  color: '#1E140E',
                  marginTop: '4px',
                  fontFamily: "'Fraunces', Georgia, serif"
                }}>
                  {formatINR(todaySummary.grossCollectedPaise || todaySummary.completedGrossCollectedPaise || 0)}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹</span>
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              From {todaySummary.completedOrders || todaySummary.totalOrders || 0} completed orders today ({todayDateFormatted})
            </div>
          </div>

          {/* Card 2: Total Amount (Completed Lifetime) */}
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
                  {formatINR(allTimeSummary.grossCollectedPaise || allTimeSummary.completedGrossCollectedPaise || 0)}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              Lifetime collected across {allTimeSummary.completedOrders || allTimeSummary.totalOrders || 0} completed orders
            </div>
          </div>

          {/* Card 3: Total Completed Order Count */}
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
                  {allTimeSummary.completedOrders || allTimeSummary.totalOrders || 0}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              {todaySummary.completedOrders || todaySummary.totalOrders || 0} completed today • {allTimeSummary.completedOrders || allTimeSummary.totalOrders || 0} completed lifetime
            </div>
          </div>

          {/* Card 4: Total Combos Delivered */}
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
                  {allTimeSummary.completedCombosCount || (allTimeReport?.comboSales?.reduce((acc, c) => acc + (c.totalQuantity || 0), 0)) || 0}
                </div>
              </div>
              <div className="kpi-icon-wrap">
                <UtensilsCrossed size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#8C7E74', marginTop: '8px' }}>
              {(todayReport?.comboSales?.reduce((acc, c) => acc + (c.totalQuantity || 0), 0)) || 0} delivered today • from completed orders
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
                        <span className={`badge ${getStatusBadgeClass(o.orderStatus)}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {o.orderStatus === 'Completed' ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#DCFCE7',
                              color: '#15803D',
                              border: '1px solid #86EFAC',
                              padding: '3px 9px',
                              borderRadius: '12px',
                              fontSize: '0.74rem',
                              fontWeight: 800
                            }}>
                              <Check size={12} strokeWidth={3} />
                              <span>Delivered</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeliveringOrder(o)}
                              className="btn btn-sm"
                              style={{
                                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '4px 12px',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <CheckCircle2 size={13} />
                              <span>Deliver</span>
                            </button>
                          )}
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

      {/* Confirm Deliver Modal */}
      {deliveringOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(26, 18, 14, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget && !deliverLoading) setDeliveringOrder(null); }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '420px',
              border: '1.5px solid #EADBCC',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(30, 20, 14, 0.35)'
            }}
          >
            <div style={{ padding: '16px 20px', background: '#F0FDF4', borderBottom: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} color="#16A34A" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#166534', margin: 0 }}>Confirm Order Delivery</h3>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ background: '#FAF6EE', border: '1px solid #EADBCC', borderRadius: '12px', padding: '12px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 800, color: '#D66C3E', fontSize: '0.95rem' }}>#{deliveringOrder.orderNumber}</div>
                <div style={{ color: '#1E140E', marginTop: '4px' }}><strong>Customer:</strong> {deliveringOrder.customerSnapshot?.name || 'Customer'}</div>
                <div style={{ color: '#7A6E63', marginTop: '2px' }}><strong>Total Amount:</strong> {formatINR(deliveringOrder.totalPaise)}</div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#7A6E63', margin: 0 }}>
                Are you sure you want to mark this order as Delivered to the customer?
              </p>
            </div>
            <div style={{ padding: '12px 20px', background: '#FDFBF7', borderTop: '1px solid #EADBCC', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button disabled={deliverLoading} onClick={() => setDeliveringOrder(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                disabled={deliverLoading}
                onClick={handleConfirmDeliver}
                className="btn btn-sm"
                style={{ background: '#16A34A', color: '#fff', fontWeight: 800, border: 'none', borderRadius: '8px', padding: '6px 16px' }}
              >
                {deliverLoading ? 'Delivering...' : 'Yes, Confirm & Deliver'}
              </button>
            </div>
          </div>
        </div>
      )}

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
