import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatusTransitionModal } from '../../components/admin/StatusTransitionModal';
import { AdminReceiptModal } from '../../components/admin/AdminReceiptModal';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  BarChart3,
  RefreshCw,
  Printer,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const cafeSlug = user?.cafe?.slug || 'jeccafe';

  const [report, setReport] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 12000); // Live polling every 12 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [reportRes, ordersRes] = await Promise.all([
        api.get('/reports/sales'),
        api.get('/orders/admin/list?isToday=true&limit=10')
      ]);

      if (reportRes.success && reportRes.report) {
        setReport(reportRes.report);
      }
      if (ordersRes.success && ordersRes.orders) {
        setLiveOrders(ordersRes.orders);
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

  const summary = report?.summary || {
    grossCollectedPaise: 0,
    netCollectedPaise: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingPayments: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };

  return (
    <div>
      <AdminHeader
        title="Dashboard Overview"
        subtitle={`Live monitoring & performance analytics for ${user?.cafe?.name}`}
        actions={
          <button onClick={loadDashboardData} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        }
      />

      <div style={{ padding: '2rem' }}>
        {/* KPI Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Revenue Card */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--brand-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>GROSS COLLECTED (PAID)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {formatINR(summary.grossCollectedPaise)}
                </div>
              </div>
              <div style={{ background: 'var(--brand-accent-light)', color: 'var(--brand-accent)', padding: '8px', borderRadius: '10px' }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              From {summary.paidOrders} confirmed paid orders
            </div>
          </div>

          {/* Total Orders */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ORDERS TODAY</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {summary.totalOrders}
                </div>
              </div>
              <div style={{ background: '#DBEAFE', color: '#2563EB', padding: '8px', borderRadius: '10px' }}>
                <ShoppingBag size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              {summary.completedOrders} completed • {summary.cancelledOrders} cancelled
            </div>
          </div>

          {/* Pending Queue */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE / PENDING</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {liveOrders.filter(o => ['Pending', 'Accepted', 'Preparing', 'Ready for Pickup'].includes(o.orderStatus)).length}
                </div>
              </div>
              <div style={{ background: '#FEF3C7', color: '#D97706', padding: '8px', borderRadius: '10px' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Requires kitchen or counter attention
            </div>
          </div>

          {/* Net Collected */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16A34A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>NET REVENUE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
                  {formatINR(summary.netCollectedPaise)}
                </div>
              </div>
              <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '8px', borderRadius: '10px' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Refunds deducted: {formatINR(summary.refundedAmountPaise)}
            </div>
          </div>
        </div>

        {/* Live Orders Table */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Live Kitchen & Counter Order Queue
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Orders placed today for {user?.cafe?.name} (Auto-polling every 12s)
              </div>
            </div>

            <Link to={`/${cafeSlug}/admin/orders`} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
              <span>View All Orders</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {liveOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No orders recorded for today yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
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
                  {liveOrders.map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 800 }}>#{o.orderNumber}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatKolkataTime(o.createdAt)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.customerSnapshot?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {o.customerSnapshot?.phone || 'N/A'}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
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
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(o)}
                            className="btn btn-outline btn-sm"
                            title="Generate & Print Official Receipt / Bill"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              borderColor: '#EADBCC',
                              color: '#D66C3E',
                              background: '#FFFDF9',
                              fontWeight: 700
                            }}
                          >
                            <Printer size={14} />
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
