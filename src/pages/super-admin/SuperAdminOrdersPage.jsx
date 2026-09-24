import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Store,
  Calendar,
  Eye,
  X,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const SuperAdminOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCafe = searchParams.get('cafe') || 'all';

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCafe, setSelectedCafe] = useState(initialCafe);
  const [orderStatus, setOrderStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCafe !== 'all') params.append('cafeSlug', selectedCafe);
      if (orderStatus !== 'all') params.append('orderStatus', orderStatus);
      if (paymentStatus !== 'all') params.append('paymentStatus', paymentStatus);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await api.get(`/super-admin/orders?${params.toString()}`);
      if (res.success) {
        setOrders(res.orders || []);
        setTotalOrders(res.totalOrders || 0);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch cross-café orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedCafe, orderStatus, paymentStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
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
            Campus Cross-Café Orders
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Combined order tracking and fulfillment status across JECCAFE and JEC BYTES
          </p>
        </div>

        <button
          onClick={fetchOrders}
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
          Refresh Orders
        </button>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: 'linear-gradient(175deg, #111B2C 0%, #0D1524 100%)',
        border: '1px solid #1E2E4A',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Café Selector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginRight: '6px' }}>
            Filter Café:
          </span>
          {[
            { id: 'all', label: 'All Campus Cafés', color: '#10B981' },
            { id: 'jeccafe', label: 'JECCAFE Only', color: '#FB923C' },
            { id: 'jecbytes', label: 'JEC BYTES Only', color: '#38BDF8' }
          ].map((c) => {
            const isSelected = selectedCafe === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCafe(c.id);
                  setSearchParams({ cafe: c.id });
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(255, 255, 255, 0.12)' : '#0B111D',
                  border: isSelected ? `1.5px solid ${c.color}` : '1px solid #1E293B',
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color }} />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Search and Status Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={17} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '10px',
                background: '#0B111D',
                border: '1px solid #1E293B',
                color: '#F8FAFC',
                fontSize: '0.84rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </form>

          {/* Order Status */}
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#0B111D',
              border: '1px solid #1E293B',
              color: '#F8FAFC',
              fontSize: '0.84rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Orders</option>
            <option value="Completed">Completed</option>
            <option value="Accepted">Accepted</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#0B111D',
              border: '1px solid #1E293B',
              color: '#F8FAFC',
              fontSize: '0.84rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Total Found Count */}
      <div style={{ marginBottom: '1rem', fontSize: '0.84rem', color: '#94A3B8' }}>
        Found <strong style={{ color: '#F8FAFC' }}>{totalOrders}</strong> orders across {selectedCafe === 'all' ? 'both campus cafés' : selectedCafe.toUpperCase()}
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'linear-gradient(175deg, #111B2C 0%, #0D1524 100%)',
        border: '1px solid #1E2E4A',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)'
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94A3B8' }}>
            Loading cross-café orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
            No orders match the selected filters.
          </div>
        ) : (
          <div className="super-table-container">
            <table className="super-table">
              <thead>
                <tr style={{ borderBottom: '1px solid #1E293B', textAlign: 'left', color: '#64748B', background: '#090E17' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Order Number</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Café Venue</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Items</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Order Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Payment</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Date & Time</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const isJeccafe = order.cafeId?.slug === 'jeccafe';
                  const cafeBadgeBg = isJeccafe ? 'rgba(234, 88, 12, 0.15)' : 'rgba(2, 132, 199, 0.15)';
                  const cafeBadgeColor = isJeccafe ? '#FB923C' : '#38BDF8';
                  const cafeBorder = isJeccafe ? 'rgba(234, 88, 12, 0.3)' : 'rgba(2, 132, 199, 0.3)';

                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#F8FAFC' }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: cafeBadgeBg,
                          border: `1px solid ${cafeBorder}`,
                          color: cafeBadgeColor,
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          display: 'inline-block'
                        }}>
                          {order.cafeId?.name || 'Café'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                        <div style={{ fontWeight: 600 }}>{order.customerSnapshot?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{order.customerSnapshot?.phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', maxWidth: '240px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#F8FAFC' }}>
                        ₹{((order.totalPaise || 0) / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
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
                      <td style={{ padding: '14px 16px' }}>
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
                      <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: '#1E293B',
                            border: '1px solid #334155',
                            color: '#F8FAFC',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#111B2C',
            border: '1px solid #1E2E4A',
            borderRadius: '20px',
            maxWidth: '560px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                padding: '3px 8px',
                borderRadius: '6px',
                background: selectedOrder.cafeId?.slug === 'jeccafe' ? 'rgba(234, 88, 12, 0.2)' : 'rgba(2, 132, 199, 0.2)',
                color: selectedOrder.cafeId?.slug === 'jeccafe' ? '#FB923C' : '#38BDF8',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {selectedOrder.cafeId?.name}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                {selectedOrder.orderNumber}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: '0 0 1.25rem' }}>
              Order Details
            </h2>

            {/* Customer Snapshot */}
            <div style={{ background: '#0B111D', borderRadius: '12px', padding: '14px', border: '1px solid #1E293B', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Customer Information
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                {selectedOrder.customerSnapshot?.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                Phone: {selectedOrder.customerSnapshot?.phone || 'N/A'} • Email: {selectedOrder.customerSnapshot?.email || 'N/A'}
              </div>
            </div>

            {/* Items List */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Ordered Items ({selectedOrder.items?.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: '#E2E8F0' }}>{item.name} <strong style={{ color: '#94A3B8' }}>x{item.quantity}</strong></span>
                    <span style={{ fontWeight: 700, color: '#F8FAFC' }}>₹{((item.pricePaise * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div style={{ borderTop: '1px solid #1E293B', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', color: '#94A3B8' }}>Total Amount Paid:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34D399' }}>
                ₹{((selectedOrder.totalPaise || 0) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
