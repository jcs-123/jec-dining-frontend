import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useToast } from '../../context/ToastContext';
import {
  Download,
  Printer,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';

export const AdminReportsPage = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Filters
  const [reportType, setReportType] = useState('today'); // 'today', 'range', 'month', 'customer'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [customerSearch, setCustomerSearch] = useState('');

  useEffect(() => {
    loadReport();
  }, [reportType, selectedYear, selectedMonth]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (reportType === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        params.append('startDate', todayStr);
      } else if (reportType === 'range' && startDate) {
        params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      } else if (reportType === 'month') {
        params.append('year', selectedYear);
        params.append('month', selectedMonth);
      } else if (reportType === 'customer' && customerSearch) {
        params.append('customerSearch', customerSearch);
      }

      const res = await api.get(`/reports/sales?${params.toString()}`);
      if (res.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (reportType === 'today') {
        params.append('startDate', new Date().toISOString().split('T')[0]);
      } else if (reportType === 'range' && startDate) {
        params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      } else if (reportType === 'month') {
        params.append('year', selectedYear);
        params.append('month', selectedMonth);
      } else if (reportType === 'customer' && customerSearch) {
        params.append('customerSearch', customerSearch);
      }

      const blob = await api.download(`/reports/export-csv?${params.toString()}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user?.cafe?.slug || 'cafe'}-report-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Sales report exported to CSV successfully');
    } catch (err) {
      toast.error('Failed to export CSV report');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const summary = report?.summary || {
    totalOrders: 0,
    paidOrders: 0,
    pendingPayments: 0,
    cancelledOrders: 0,
    completedOrders: 0,
    grossCollectedPaise: 0,
    refundedAmountPaise: 0,
    netCollectedPaise: 0
  };

  const orders = report?.orders || [];
  const comboSales = report?.comboSales || [];

  return (
    <div>
      <AdminHeader
        title="Financial & Sales Reports"
        subtitle={`Authoritative revenue analytics and order accounting for ${user?.cafe?.name}`}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
              <Printer size={14} />
              <span>Print Report</span>
            </button>
            <button onClick={handleExportCSV} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      <div style={{ padding: '2rem' }}>
        {/* Report Filter Header */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Mode Switcher */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-surface-subtle)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)'
            }}>
              <button
                onClick={() => setReportType('today')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: reportType === 'today' ? '#FFFFFF' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Today's Report
              </button>
              <button
                onClick={() => setReportType('range')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: reportType === 'range' ? '#FFFFFF' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Date Range
              </button>
              <button
                onClick={() => setReportType('month')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: reportType === 'month' ? '#FFFFFF' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Month-Wise
              </button>
              <button
                onClick={() => setReportType('customer')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: reportType === 'customer' ? '#FFFFFF' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Customer-Wise
              </button>
            </div>

            {/* Sub-filters depending on reportType */}
            {reportType === 'range' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: 'auto' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>to</span>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: 'auto' }}
                />
                <button onClick={loadReport} className="btn btn-primary btn-sm">
                  Apply Filter
                </button>
              </div>
            )}

            {reportType === 'month' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  className="form-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, idx) => (
                    <option key={idx + 1} value={idx + 1}>{m}</option>
                  ))}
                </select>
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            )}

            {reportType === 'customer' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Customer name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{ width: '220px' }}
                />
                <button onClick={loadReport} className="btn btn-primary btn-sm">
                  Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 8 Financial Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid var(--brand-accent)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>GROSS COLLECTED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-main)' }}>
              {formatINR(summary.grossCollectedPaise)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Paid orders total</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #16A34A' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>NET COLLECTED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#16A34A' }}>
              {formatINR(summary.netCollectedPaise)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>After refunds</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #DC2626' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>REFUNDED AMOUNT</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#DC2626' }}>
              {formatINR(summary.refundedAmountPaise)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Returned funds</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #2563EB' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL ORDERS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
              {summary.totalOrders}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>All statuses</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #10B981' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PAID ORDERS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#10B981' }}>
              {summary.paidOrders}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Authorized</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #D97706' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING PAYMENTS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#D97706' }}>
              {summary.pendingPayments}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Unpaid orders</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #8B5CF6' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>COMPLETED ORDERS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#8B5CF6' }}>
              {summary.completedOrders}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Fulfilled</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #EF4444' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CANCELLED ORDERS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#EF4444' }}>
              {summary.cancelledOrders}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Aborted orders</div>
          </div>
        </div>

        {/* Combo Sales Performance Table */}
        {comboSales.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Combo-Wise Sales Performance
            </h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Combo Name</th>
                    <th>Dietary</th>
                    <th>Units Sold</th>
                    <th style={{ textAlign: 'right' }}>Total Revenue Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {comboSales.map((cs, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{cs.name}</td>
                      <td>
                        <span className={`badge ${cs.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                          {cs.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{cs.totalQuantity} units</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--brand-accent)' }}>
                        {formatINR(cs.totalRevenuePaise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Filtered Orders Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Filtered Orders Log ({orders.length} Records)
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Computing report metrics...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No order records found for this period.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Combos & Quantity</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 800 }}>#{o.orderNumber}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatKolkataTime(o.createdAt)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.customerSnapshot?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customerSnapshot?.phone}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {o.items.map((i, idx) => (
                          <div key={idx}>{i.quantity}x {i.name}</div>
                        ))}
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatINR(o.totalPaise)}</td>
                      <td>
                        <span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-status-completed' : 'badge-status-pending'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-status-accepted">{o.orderStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
