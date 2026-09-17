import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatKolkataTime } from '../../utils/formatters';
import { CheckCircle2, Clock, MapPin, Printer, ArrowRight, ShoppingBag, Calendar, Mail, QrCode } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/my-orders/${orderId}`);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.open(`http://localhost:5000/api/orders/${orderId}/receipt`, '_blank');
  };

  const handleSendGmailReceipt = async () => {
    try {
      setSendingEmail(true);
      const res = await api.post(`/orders/${orderId}/resend-receipt`);
      toast.success(`Purchase receipt sent to ${order?.customerSnapshot?.email || 'your Gmail'}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch email receipt');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return <div className="app-container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading confirmation...</div>;
  }

  if (!order) {
    return (
      <div className="app-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to My Orders
        </Link>
      </div>
    );
  }

  const qrVerificationData = `http://localhost:5173/admin/verify-pickup/${order._id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrVerificationData)}`;

  return (
    <div className="app-container" style={{ maxWidth: '680px', padding: '2rem 1rem' }}>
      <div className="card" style={{
        padding: '2.5rem',
        textAlign: 'center',
        borderRadius: '24px',
        background: '#FFFFFF',
        border: '1.5px solid #EADBCC',
        boxShadow: '0 6px 24px rgba(50, 30, 15, 0.06)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#DCFCE7',
          color: '#15803D',
          border: '1.5px solid #86EFAC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: '2rem',
          fontWeight: 800,
          color: '#1E140E',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Order Confirmed!
        </h1>
        <p style={{ color: '#7A6E63', fontSize: '0.95rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          Your order has been received by <strong style={{ color: '#1E140E' }}>{order.cafeId?.name}</strong> kitchen staff.
        </p>

        {/* Order Number Badge */}
        <div style={{
          background: '#FAF6F0',
          border: '1.5px solid #EADBCC',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'inline-block',
          minWidth: '280px',
          boxShadow: '0 2px 8px rgba(50, 30, 15, 0.03)'
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7A6E63', letterSpacing: '0.06em' }}>
            YOUR PICKUP ORDER NUMBER
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E140E', letterSpacing: '0.04em', marginTop: '4px', fontFamily: "'Fraunces', Georgia, serif" }}>
            #{order.orderNumber}
          </div>
        </div>

        {/* Counter Pickup QR Code */}
        <div style={{
          margin: '0 auto 1.75rem',
          maxWidth: '340px',
          padding: '1.25rem',
          background: '#FFFFFF',
          border: '1.5px solid #EADBCC',
          borderRadius: '20px',
          boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#D66C3E', marginBottom: '10px', letterSpacing: '0.06em' }}>
            <QrCode size={16} />
            <span>COUNTER PICKUP QR CODE</span>
          </div>
          <img
            src={qrCodeUrl}
            alt="Order Pickup QR Code"
            width="170"
            height="170"
            style={{ display: 'block', margin: '0 auto', borderRadius: '12px' }}
          />
          <p style={{ fontSize: '0.8rem', color: '#7A6E63', margin: '10px 0 0', lineHeight: 1.4, fontWeight: 500 }}>
            Show this QR code at the counter for instant order verification & handover.
          </p>
        </div>

        {/* Pickup Details Card */}
        <div style={{
          textAlign: 'left',
          background: '#FAF6F0',
          border: '1.5px solid #EADBCC',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#1E140E' }}>
            <MapPin size={18} color="#D66C3E" />
            <span style={{ fontWeight: 700 }}>Pickup Location:</span>
            <span style={{ color: '#4A423B' }}>{order.cafeId?.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#1E140E' }}>
            <Calendar size={18} color="#D66C3E" />
            <span style={{ fontWeight: 700 }}>Pickup Schedule:</span>
            <span style={{ color: '#4A423B' }}><strong>{order.pickupDate || 'Today'}</strong> • {order.pickupTimeSlot || 'Immediate'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#1E140E' }}>
            <Clock size={18} color="#D66C3E" />
            <span style={{ fontWeight: 700 }}>Prep Window:</span>
            <span style={{ color: '#4A423B' }}>Approx. {order.pickupEstimatedMinutes || 20} minutes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={handlePrintReceipt}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.25rem',
              borderRadius: '24px',
              border: '1.5px solid #EADBCC',
              background: '#FFFFFF',
              color: '#1E140E',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(50, 30, 15, 0.04)'
            }}
          >
            <Printer size={16} color="#D66C3E" />
            <span>Download Receipt</span>
          </button>
          <button
            onClick={handleSendGmailReceipt}
            disabled={sendingEmail}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.25rem',
              borderRadius: '24px',
              border: '1.5px solid #EADBCC',
              background: '#FFFFFF',
              color: '#D66C3E',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(50, 30, 15, 0.04)'
            }}
          >
            <Mail size={16} />
            <span>{sendingEmail ? 'Sending...' : 'Send Receipt to Gmail'}</span>
          </button>
          <Link
            to={`/order/${order._id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.35rem',
              borderRadius: '24px',
              border: 'none',
              background: '#1A1816',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.86rem',
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(26, 24, 22, 0.25)'
            }}
          >
            <span>Live Order Status</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
