import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime, getStatusBadgeClass } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatusTransitionModal } from '../../components/admin/StatusTransitionModal';
import { Search, Filter, Printer, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today'
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [page, orderStatus, paymentStatus, dateFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15'
      });

      if (dateFilter === 'today') params.append('isToday', 'true');
      if (orderStatus !== 'all') params.append('orderStatus', orderStatus);
      if (paymentStatus !== 'all') params.append('paymentStatus', paymentStatus);
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

  const handlePrintReceipt = (orderId) => {
    window.open(`http://localhost:5000/api/orders/${orderId}/receipt`, '_blank');
  };

  return (
    <div>
      <AdminHeader
        title="Live Orders Management"
        subtitle={`Real-time fulfillment queue & historical logs for ${user?.cafe?.name}`}
        actions={
          <button onClick={loadOrders} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Orders</span>
          </button>
        }
      />

      <div style={{ padding: '2rem' }}>
        {/* Search & Filter Controls */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search order #, customer name, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Date Filter */}
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
            </select>

            {/* Order Status */}
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={orderStatus}
              onChange={(e) => {
                setOrderStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Payment Status */}
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending Payment</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>

            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {orders.length} of {totalOrders} total orders
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No orders found matching the selected filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Placed At (IST)</th>
                    <th>Customer Name & Phone</th>
                    <th>Items Purchased</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                    <th>Notes</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {o.customerSnapshot?.phone || 'No phone'}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {o.items.map((i, idx) => (
                          <div key={idx}>
                            <strong>{i.quantity}x</strong> {i.name}
                            {i.selectedOptions && i.selectedOptions.length > 0 && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                ({i.selectedOptions.map(opt => opt.optionName).join(', ')})
                              </div>
                            )}
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
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '160px' }}>
                        {o.orderNotes || '-'}
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
                            onClick={() => handlePrintReceipt(o._id)}
                            className="btn btn-outline btn-sm"
                            title="Print Receipt"
                          >
                            <Printer size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--divider)'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="btn btn-outline btn-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="btn btn-outline btn-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <StatusTransitionModal
        isOpen={!!selectedOrderForStatus}
        onClose={() => setSelectedOrderForStatus(null)}
        order={selectedOrderForStatus}
        onOrderUpdated={loadOrders}
      />
    </div>
  );
};
