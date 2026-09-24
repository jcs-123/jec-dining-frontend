import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminQrScannerModal } from '../../components/admin/AdminQrScannerModal';
import { AdminReceiptModal } from '../../components/admin/AdminReceiptModal';
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Download,
  ClipboardList,
  Flame,
  BellRing,
  CheckCircle2,
  Check,
  X,
  Info,
  Package,
  Calendar,
  Phone,
  User,
  Clock,
  Printer,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Award,
  FileSpreadsheet,
  IndianRupee
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Modals
  const [deliveringOrder, setDeliveringOrder] = useState(null);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);

  // Top 4 Summary Metric Cards (Today Combos, Total Orders, Total Students, Total Price)
  const [summaryStats, setSummaryStats] = useState({
    todayComboCount: 0,
    totalOrders: 0,
    totalStudents: 0,
    totalPrice: 0
  });

  useEffect(() => {
    if (searchParams.get('scan') === 'true') {
      setShowScannerModal(true);
    }
  }, [searchParams]);

  // Filters
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(''); // '' for all dates, or 'YYYY-MM-DD'

  useEffect(() => {
    loadOrders();
    loadSummaryStats();
  }, [page, orderStatus, selectedDate]);

  const loadSummaryStats = async () => {
    try {
      const scopeParams = new URLSearchParams({ limit: '200' });
      if (selectedDate) scopeParams.append('date', selectedDate);
      if (orderStatus !== 'all') scopeParams.append('orderStatus', orderStatus);

      const [todayRes, scopeRes, allRes] = await Promise.allSettled([
        api.get(`/orders/admin/list?isToday=true&limit=200`),
        api.get(`/orders/admin/list?${scopeParams.toString()}`),
        api.get(`/orders/admin/list?limit=200`)
      ]);

      const todayOrders = todayRes.status === 'fulfilled' && todayRes.value?.success ? todayRes.value.orders || [] : [];
      const scopeOrders = scopeRes.status === 'fulfilled' && scopeRes.value?.success ? scopeRes.value.orders || [] : [];
      const allOrders = allRes.status === 'fulfilled' && allRes.value?.success ? allRes.value.orders || [] : [];

      // 1. Today's Combo Count (sum of quantity of combos ordered today)
      const todayComboCount = todayOrders.reduce((sum, o) => {
        const itemsCount = (o.items || []).reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
        return sum + itemsCount;
      }, 0);

      // 2. Total Orders
      const isFiltered = Boolean(selectedDate || orderStatus !== 'all');
      const totalOrdersCount = isFiltered
        ? (scopeRes.value?.totalOrders !== undefined ? scopeRes.value.totalOrders : scopeOrders.length)
        : (allRes.value?.totalOrders !== undefined ? allRes.value.totalOrders : allOrders.length);

      // 3. Total Students / Customers in active scope
      const activeList = isFiltered ? scopeOrders : (allOrders.length > 0 ? allOrders : todayOrders);
      const studentSet = new Set();
      activeList.forEach(o => {
        const id = o.customerSnapshot?.phone || o.customerSnapshot?.email || o.customerSnapshot?.name || o.user;
        if (id) studentSet.add(String(id).trim().toLowerCase());
      });
      const totalStudents = studentSet.size;

      // 4. Total Price (IN PAISE so formatINR correctly converts to rupees)
      let totalPricePaise = 0;
      if (isFiltered) {
        if (scopeRes.value?.totalSalesPaise !== undefined) {
          totalPricePaise = scopeRes.value.totalSalesPaise;
        } else {
          totalPricePaise = scopeOrders.reduce((sum, o) => sum + (Number(o.totalPaise) || 0), 0);
        }
      } else {
        if (allRes.value?.totalSalesPaise !== undefined) {
          totalPricePaise = allRes.value.totalSalesPaise;
        } else {
          totalPricePaise = allOrders.reduce((sum, o) => sum + (Number(o.totalPaise) || 0), 0);
        }
      }

      setSummaryStats({
        todayComboCount,
        totalOrders: totalOrdersCount,
        totalStudents,
        totalPrice: totalPricePaise
      });
    } catch (err) {
      console.error('Failed to load summary stats:', err);
    }
  };

  const loadOrders = async (isExplicit = false) => {
    try {
      if (isExplicit || orders.length === 0) {
        setLoading(true);
      }
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15'
      });

      if (selectedDate) params.append('date', selectedDate);
      if (orderStatus !== 'all') params.append('orderStatus', orderStatus);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/orders/admin/list?${params.toString()}`);
      if (res.success) {
        setOrders(res.orders || []);
        setTotalOrders(res.totalOrders || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadOrders();
  };

  const handleExportCSV = async () => {
    try {
      setExportLoading(true);
      const params = new URLSearchParams();
      if (selectedDate) {
        params.append('startDate', selectedDate);
        params.append('endDate', selectedDate);
      }
      if (orderStatus !== 'all') params.append('orderStatus', orderStatus);
      if (search.trim()) params.append('customerSearch', search.trim());

      const blob = await api.download(`/reports/export-csv?${params.toString()}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user?.cafe?.slug || 'cafe'}-orders-${selectedDate || 'all'}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.showSuccess('Orders exported to CSV successfully');
    } catch (err) {
      toast.showError('Failed to export orders');
    } finally {
      setExportLoading(false);
    }
  };

  // Deliver Confirmation Handler with Premium Toast
  const handleConfirmDeliver = async () => {
    if (!deliveringOrder) return;
    try {
      setDeliverLoading(true);
      const res = await api.post(`/orders/admin/${deliveringOrder._id}/verify-pickup`, {});
      if (res.success) {
        const custName = deliveringOrder.customerSnapshot?.name || 'Customer';
        toast.showSuccess(`Order #${deliveringOrder.orderNumber} successfully delivered to ${custName}!`);
        setDeliveringOrder(null);
        loadOrders();
        loadSummaryStats();
      } else {
        toast.showError(res.message || 'Failed to deliver order');
      }
    } catch (err) {
      toast.showError(err.message || 'Error delivering order');
    } finally {
      setDeliverLoading(false);
    }
  };

  const formatTwoDigit = (num) => String(num || 0).padStart(2, '0');

  // Helper to extract combo names
  const getComboNames = (order) => {
    if (!order.items || order.items.length === 0) return 'Custom Order';
    return order.items.map(item => item.combo?.name || item.name || 'Combo').join(', ');
  };

  return (
    <div>
      <AdminHeader
        title="Live Orders Management"
        subtitle={`Real-time orders feed for ${user?.cafe?.name || 'this café'}`}
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handleExportCSV}
              disabled={exportLoading}
              className="btn-export-csv-premium"
              title="Download filtered orders report as CSV"
            >
              {exportLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={15} />
              )}
              <span>{exportLoading ? 'Exporting...' : 'Export CSV'}</span>
            </button>
            <button
              onClick={() => setShowScannerModal(true)}
              className="btn btn-primary btn-sm"
              style={{
                gap: '6px',
                background: '#16A34A',
                borderColor: '#16A34A',
                fontWeight: 800,
                padding: '7px 14px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                borderRadius: '10px'
              }}
            >
              <QrCode size={15} />
              <span>Scan QR & Deliver</span>
            </button>
          </div>
        }
      />

      <div className="admin-page-container">
        {/* 1. Four Top Metric Cards */}
        <div className="orders-status-grid">
          {/* Card 1: Today's Combo Count */}
          <div className="orders-status-card">
            <div className="orders-status-icon" style={{ background: '#FDF1EA', color: '#D66C3E' }}>
              <UtensilsCrossed size={22} />
            </div>
            <div>
              <div className="orders-status-label">Today's Combos</div>
              <div className="orders-status-value">{formatTwoDigit(summaryStats.todayComboCount)}</div>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="orders-status-card">
            <div className="orders-status-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <div className="orders-status-label">Total Orders</div>
              <div className="orders-status-value">{formatTwoDigit(summaryStats.totalOrders || totalOrders)}</div>
            </div>
          </div>

          {/* Card 3: Total Students */}
          <div className="orders-status-card">
            <div className="orders-status-icon" style={{ background: '#CCFBF1', color: '#0D9488' }}>
              <Users size={22} />
            </div>
            <div>
              <div className="orders-status-label">Total Students</div>
              <div className="orders-status-value">{formatTwoDigit(summaryStats.totalStudents)}</div>
            </div>
          </div>

          {/* Card 4: Total Price */}
          <div className="orders-status-card">
            <div className="orders-status-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <IndianRupee size={22} />
            </div>
            <div>
              <div className="orders-status-label">Total Price</div>
              <div className="orders-status-value">
                {formatINR(summaryStats.totalPrice || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Filter Toolbar */}
        <div className="orders-filter-card">
          <form onSubmit={handleSearchSubmit} className="orders-filter-row">
            <div className="orders-search-input-wrap" style={{ position: 'relative', flex: '1 1 260px', display: 'flex', alignItems: 'center' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7A6E63',
                  pointerEvents: 'none',
                  zIndex: 2
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{
                  paddingLeft: '38px',
                  borderRadius: '10px',
                  borderColor: '#EADBCC',
                  fontSize: '0.86rem',
                  height: '40px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                placeholder="Search order #, customer name, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="orders-date-picker-wrap">
              <Calendar size={16} className="orders-date-picker-icon" />
              <input
                type="date"
                className={`form-input orders-date-input ${selectedDate ? 'has-value' : ''}`}
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
                onClick={(e) => {
                  try { e.target.showPicker(); } catch (err) {}
                }}
                title="Filter by specific date"
              />
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => { setSelectedDate(''); setPage(1); }}
                  className="orders-date-clear-btn"
                  title="Clear date filter (show all dates)"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="orders-status-select-wrap" style={{ position: 'relative', flex: '0 1 190px', minWidth: '165px' }}>
              <select
                className="form-select"
                style={{
                  borderRadius: '10px',
                  borderColor: '#EADBCC',
                  fontSize: '0.84rem',
                  height: '40px',
                  width: '100%',
                  paddingRight: '28px',
                  boxSizing: 'border-box'
                }}
                value={orderStatus}
                onChange={(e) => { setOrderStatus(e.target.value); setPage(1); }}
              >
                <option value="all">All Order Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary orders-search-btn"
              style={{
                height: '40px',
                padding: '0 1.25rem',
                borderRadius: '10px',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.86rem'
              }}
            >
              <Search size={15} />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* 3. Orders Container Card */}
        <div className="card" style={{ overflow: 'hidden', borderRadius: '18px', border: '1px solid #EADBCC' }}>
          <div className="orders-table-topbar">
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1E140E' }}>
              {totalOrders} {totalOrders === 1 ? 'order' : 'orders'} found
            </span>

            <button
              onClick={handleExportCSV}
              disabled={exportLoading}
              className="btn-export-csv-premium"
              style={{ padding: '5px 12px', fontSize: '0.8rem' }}
              title="Download current orders list as CSV"
            >
              {exportLoading ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={14} />
              )}
              <span>{exportLoading ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>

          {loading && orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#7A6E63' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px', display: 'block', color: '#D66C3E' }} />
              Loading live orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#7A6E63', fontSize: '0.92rem' }}>
              No orders found matching the selected filters.
            </div>
          ) : (
            <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s ease' }}>
              {/* 4. Desktop & Tablet Table View with Exact Requested Columns:
                     Order ID | Customer Name & Phone | Pickup Schedule | Combo Name | Total | Action */}
              <div className="desktop-orders-table table-responsive" style={{ margin: 0 }}>
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '14px 16px' }}>ORDER ID</th>
                      <th style={{ padding: '14px 16px' }}>CUSTOMER NAME & PHONE</th>
                      <th style={{ padding: '14px 16px' }}>PICKUP SCHEDULE</th>
                      <th style={{ padding: '14px 16px' }}>COMBO NAME</th>
                      <th style={{ padding: '14px 16px' }}>TOTAL</th>
                      <th style={{ textAlign: 'center', padding: '14px 16px', minWidth: '140px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      const isCompleted = o.orderStatus === 'Completed';
                      const isCancelled = o.orderStatus === 'Cancelled';

                      return (
                        <tr key={o._id}>
                          {/* 1. Order ID */}
                          <td style={{ fontWeight: 800, color: '#1E140E', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>#{o.orderNumber}</span>
                              <button
                                onClick={() => setInspectingOrder(o)}
                                title="View Details"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#D66C3E',
                                  cursor: 'pointer',
                                  padding: '2px',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Info size={14} />
                              </button>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#7A6E63', fontWeight: 500 }}>
                              {formatKolkataTime(o.createdAt)}
                            </div>
                          </td>

                          {/* 2. Customer Name & Phone */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#1E140E', fontSize: '0.88rem' }}>
                              {o.customerSnapshot?.name || 'Walk-in Customer'}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#7A6E63', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={11} />
                              <span>{o.customerSnapshot?.phone || 'N/A'}</span>
                            </div>
                          </td>

                          {/* 3. Pickup Schedule */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E140E' }}>
                              {o.pickupDate || new Date(o.createdAt).toISOString().split('T')[0]}
                            </div>
                            {o.pickupTimeSlot && !o.pickupTimeSlot.toLowerCase().includes('immediate') && (
                              <div style={{ fontSize: '0.74rem', color: '#D66C3E', fontWeight: 700, marginTop: '2px' }}>
                                {o.pickupTimeSlot}
                              </div>
                            )}
                          </td>

                          {/* 4. Combo Name (Clickable to view detailed items!) */}
                          <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                            <div
                              onClick={() => setInspectingOrder(o)}
                              style={{
                                cursor: 'pointer',
                                display: 'inline-flex',
                                flexDirection: 'column',
                                gap: '2px'
                              }}
                              title="Click to view full combo items & customizations"
                            >
                              <div style={{
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                color: '#1E140E',
                                textDecoration: 'underline',
                                textDecorationColor: '#D66C3E',
                                textUnderlineOffset: '3px'
                              }}>
                                {getComboNames(o)}
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#D66C3E', fontWeight: 600 }}>
                                Click for combo items ↗
                              </span>
                            </div>
                          </td>

                          {/* 5. Total */}
                          <td style={{ fontWeight: 800, color: '#1E140E', fontSize: '0.94rem', padding: '14px 16px' }}>
                            {formatINR(o.totalPaise)}
                          </td>

                          {/* 6. ACTION: ONLY DELIVER BUTTON */}
                          <td style={{ textAlign: 'center', padding: '14px 16px' }}>
                            {isCompleted ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#DCFCE7',
                                  color: '#15803D',
                                  border: '1px solid #86EFAC',
                                  padding: '5px 12px',
                                  borderRadius: '20px',
                                  fontSize: '0.76rem',
                                  fontWeight: 800
                                }}
                              >
                                <Check size={14} strokeWidth={3} />
                                <span>Delivered</span>
                              </span>
                            ) : isCancelled ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#FEE2E2',
                                  color: '#DC2626',
                                  border: '1px solid #FCA5A5',
                                  padding: '5px 12px',
                                  borderRadius: '20px',
                                  fontSize: '0.76rem',
                                  fontWeight: 800
                                }}
                              >
                                <span>Cancelled</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => setDeliveringOrder(o)}
                                className="btn btn-sm"
                                style={{
                                  background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                                  color: '#FFFFFF',
                                  border: '1px solid #16A34A',
                                  borderRadius: '10px',
                                  padding: '6px 16px',
                                  fontSize: '0.82rem',
                                  fontWeight: 800,
                                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                              >
                                <CheckCircle2 size={15} />
                                <span>Deliver</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 5. Mobile Order Cards (< 768px Viewport) */}
              <div className="mobile-orders-list">
                {orders.map((o) => {
                  const isCompleted = o.orderStatus === 'Completed';
                  const isCancelled = o.orderStatus === 'Cancelled';

                  return (
                    <div key={o._id} className="mobile-order-card">
                      {/* Top: Order ID & Placed Time */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#1E140E' }}>
                          #{o.orderNumber}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#7A6E63' }}>
                          {formatKolkataTime(o.createdAt)}
                        </div>
                      </div>

                      {/* Customer Name & Phone */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E140E' }}>
                            {o.customerSnapshot?.name || 'Walk-in Customer'}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#7A6E63', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={11} />
                            <span>{o.customerSnapshot?.phone || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`badge ${getStatusBadgeClass(o.orderStatus)}`} style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                          {o.orderStatus}
                        </span>
                      </div>

                      {/* Pickup Schedule */}
                      <div style={{ background: '#FAF6EE', padding: '6px 10px', borderRadius: '8px', fontSize: '0.76rem' }}>
                        <span style={{ fontWeight: 700, color: '#1E140E' }}>
                          Pickup: {o.pickupDate || new Date(o.createdAt).toISOString().split('T')[0]}
                        </span>
                        {o.pickupTimeSlot && !o.pickupTimeSlot.toLowerCase().includes('immediate') && (
                          <span style={{ color: '#D66C3E', fontWeight: 700, marginLeft: '6px' }}>
                            • {o.pickupTimeSlot}
                          </span>
                        )}
                      </div>

                      {/* Combo Name (Clickable to view detailed items!) */}
                      <div
                        onClick={() => setInspectingOrder(o)}
                        style={{
                          background: '#FFFDF9',
                          border: '1.5px dashed #EADBCC',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', color: '#7A6E63', fontWeight: 700, textTransform: 'uppercase' }}>
                            Combo Name
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#D66C3E', fontWeight: 700 }}>
                            View Items ↗
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E140E', marginTop: '2px' }}>
                          {getComboNames(o)}
                        </div>
                      </div>

                      {/* Total Amount & Payment */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0E6DC', paddingTop: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#7A6E63', fontWeight: 600 }}>Total: </span>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1E140E' }}>
                            {formatINR(o.totalPaise)}
                          </span>
                        </div>
                      </div>

                      {/* ACTION: ONLY DELIVER BUTTON ON MOBILE */}
                      <div style={{ marginTop: '4px' }}>
                        {isCompleted ? (
                          <div
                            style={{
                              textAlign: 'center',
                              background: '#DCFCE7',
                              color: '#15803D',
                              border: '1px solid #86EFAC',
                              padding: '8px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px'
                            }}
                          >
                            <Check size={16} strokeWidth={3} />
                            <span>Delivered & Handed Over</span>
                          </div>
                        ) : isCancelled ? (
                          <div
                            style={{
                              textAlign: 'center',
                              background: '#FEE2E2',
                              color: '#DC2626',
                              padding: '8px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              fontWeight: 700
                            }}
                          >
                            Order Cancelled
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeliveringOrder(o)}
                            className="btn btn-full"
                            style={{
                              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '9px',
                              fontSize: '0.88rem',
                              fontWeight: 800,
                              boxShadow: '0 3px 10px rgba(22, 163, 74, 0.28)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <CheckCircle2 size={16} />
                            <span>Deliver Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.25rem',
              borderTop: '1px solid #F0E6DC',
              background: '#FFFFFF'
            }}>
              <span style={{ fontSize: '0.84rem', color: '#7A6E63' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '8px', padding: '4px 8px' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '8px', padding: '4px 8px' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: COMBO & ORDER ITEMS DETAIL MODAL (Opens on clicking combo name)
          ========================================================================= */}
      {inspectingOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(26, 18, 14, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setInspectingOrder(null); }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(30, 20, 14, 0.35)',
              border: '1.5px solid #EADBCC',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              background: '#FAF6EE',
              borderBottom: '1.5px solid #EADBCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  color: '#1E140E'
                }}>
                  Order Items Breakdown
                </div>
                <div style={{ fontSize: '0.74rem', color: '#D66C3E', fontWeight: 700, marginTop: '2px' }}>
                  Token #{inspectingOrder.orderNumber} • {formatKolkataTime(inspectingOrder.createdAt)}
                </div>
              </div>

              <button
                onClick={() => setInspectingOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7A6E63',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1 }}>
              {/* Customer & Schedule info */}
              <div style={{
                background: '#FBF9F6',
                border: '1px solid #EADBCC',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 12px',
                fontSize: '0.78rem'
              }}>
                <div>
                  <span style={{ color: '#8C7E74', display: 'block', fontSize: '0.7rem' }}>Customer</span>
                  <strong style={{ color: '#1E140E' }}>{inspectingOrder.customerSnapshot?.name || 'Walk-in'}</strong>
                </div>
                <div>
                  <span style={{ color: '#8C7E74', display: 'block', fontSize: '0.7rem' }}>Contact Phone</span>
                  <strong style={{ color: '#1E140E' }}>{inspectingOrder.customerSnapshot?.phone || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: '#8C7E74', display: 'block', fontSize: '0.7rem' }}>Pickup Date</span>
                  <span style={{ color: '#1E140E', fontWeight: 700 }}>{inspectingOrder.pickupDate || 'Today'}</span>
                </div>
              </div>

              {/* Items in the Combo */}
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8C7E74', textTransform: 'uppercase', marginBottom: '8px' }}>
                Combos & Included Items
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {inspectingOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #EADBCC',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      boxShadow: '0 2px 6px rgba(45, 25, 10, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#1E140E' }}>
                          <span style={{ color: '#D66C3E' }}>{item.quantity}x</span> {item.name}
                        </div>

                        {/* Fixed / Components if populated */}
                        {((item.fixedItemsSnapshot && item.fixedItemsSnapshot.length > 0) || (item.comboId?.fixedItems && item.comboId.fixedItems.length > 0)) && (
                          <div style={{ marginTop: '6px', background: '#FAF6EE', padding: '6px 8px', borderRadius: '8px', fontSize: '0.74rem' }}>
                            <div style={{ fontWeight: 700, color: '#7A6E63', marginBottom: '2px' }}>Contains (Meal Components):</div>
                            {(item.fixedItemsSnapshot && item.fixedItemsSnapshot.length > 0 ? item.fixedItemsSnapshot : item.comboId.fixedItems).map((fi, fidx) => (
                              <div key={fidx} style={{ color: '#382A20' }}>
                                • {fi.quantity}x {fi.name}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Options / Customizations */}
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div style={{ fontSize: '0.74rem', color: '#7A6E63', marginTop: '4px' }}>
                            Options: {item.selectedOptions.map(opt => opt.optionName).join(', ')}
                          </div>
                        )}
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#1E140E', marginLeft: '12px' }}>
                        {formatINR(item.totalPricePaise)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Notes if any */}
              {inspectingOrder.orderNotes && (
                <div style={{ marginTop: '12px', padding: '8px 12px', background: '#FEF3C7', borderRadius: '10px', fontSize: '0.78rem', color: '#92400E' }}>
                  <strong>Customer Note:</strong> {inspectingOrder.orderNotes}
                </div>
              )}

              {/* Total Summary */}
              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1.5px solid #EADBCC',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7A6E63' }}>Order Status</div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      background: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}
                  >
                    {inspectingOrder.orderStatus}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#7A6E63', marginBottom: '2px' }}>
                    Subtotal: <strong>{formatINR(inspectingOrder.subtotalPaise)}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7A6E63', marginBottom: '4px' }}>
                    Tax: <strong>{formatINR(inspectingOrder.taxPaise || 0)}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7A6E63' }}>Grand Total</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E140E' }}>
                    {formatINR(inspectingOrder.totalPaise)}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 20px',
              background: '#FAF6EE',
              borderTop: '1px solid #EADBCC',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={() => {
                  setReceiptOrder(inspectingOrder);
                  setInspectingOrder(null);
                }}
                className="btn btn-outline btn-sm"
                style={{ gap: '5px', borderColor: '#EADBCC', background: '#FFFDF9' }}
              >
                <Printer size={14} />
                <span>Print Official Bill</span>
              </button>

              <button
                onClick={() => setInspectingOrder(null)}
                className="btn btn-primary btn-sm"
                style={{ padding: '6px 18px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CONFIRM TO DELIVER MODAL ("Click are you sure confirm to deliver")
          ========================================================================= */}
      {deliveringOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(26, 18, 14, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
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
              borderRadius: '22px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 24px 60px rgba(30, 20, 14, 0.4)',
              border: '1.5px solid #EADBCC',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              background: '#F0FDF4',
              borderBottom: '1px solid #DCFCE7',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                  Confirm Order Delivery
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#15803D', marginTop: '2px' }}>
                  Are you sure you want to mark this order as Delivered?
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
              <div style={{
                background: '#FAF6EE',
                border: '1px solid #EADBCC',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 700 }}>ORDER TOKEN</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#D66C3E' }}>
                    #{deliveringOrder.orderNumber}
                  </span>
                </div>

                <div style={{ fontSize: '0.86rem', color: '#1E140E', marginBottom: '4px' }}>
                  <strong>Customer:</strong> {deliveringOrder.customerSnapshot?.name || 'Walk-in Guest'} ({deliveringOrder.customerSnapshot?.phone || 'N/A'})
                </div>

                <div style={{ fontSize: '0.82rem', color: '#5C4A3E', marginBottom: '6px' }}>
                  <strong>Items:</strong> {getComboNames(deliveringOrder)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EADBCC', paddingTop: '8px', fontSize: '0.84rem' }}>
                  <span style={{ color: '#7A6E63' }}>Total Paid:</span>
                  <strong style={{ color: '#16A34A' }}>{formatINR(deliveringOrder.totalPaise)}</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#7A6E63', margin: 0, textAlign: 'center', lineHeight: 1.4 }}>
                This will complete the fulfillment lifecycle and notify the kitchen & counter logs.
              </p>
            </div>

            {/* Actions */}
            <div style={{
              padding: '14px 20px',
              background: '#FDFBF7',
              borderTop: '1px solid #EADBCC',
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                disabled={deliverLoading}
                onClick={() => setDeliveringOrder(null)}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '10px', padding: '8px 16px', fontWeight: 700 }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deliverLoading}
                onClick={handleConfirmDeliver}
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 20px',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {deliverLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Delivering...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Yes, Confirm & Deliver</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <AdminReceiptModal
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
        order={receiptOrder}
        cafe={user?.cafe}
      />

      {/* QR Scanner Modal */}
      <AdminQrScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onOrderDelivered={() => { loadOrders(); loadQueueStats(); }}
      />
    </div>
  );
};
