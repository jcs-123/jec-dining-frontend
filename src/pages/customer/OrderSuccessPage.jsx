import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatKolkataTime } from '../../utils/formatters';
import { CheckCircle2, MapPin, Printer, ArrowRight, ShoppingBag, Calendar, Mail, QrCode, Download, Layers } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qrCode';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const toast = useToast();

  const [ordersList, setOrdersList] = useState(
    location.state?.orders || (location.state?.order ? [location.state.order] : [])
  );
  const [selectedIdx, setSelectedIdx] = useState(0);

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order && ordersList.length === 0);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      if (!order) setLoading(true);
      const res = await api.get(`/orders/my-orders/${orderId}`);
      if (res.success && res.order) {
        setOrder(res.order);
        if (ordersList.length === 0) {
          setOrdersList([res.order]);
        }
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  // If user opened page or refreshed, find other orders in the same batch
  useEffect(() => {
    if (order && ordersList.length <= 1) {
      api.get('/orders/my-orders')
        .then((res) => {
          if (res.success && Array.isArray(res.orders)) {
            const orderTime = new Date(order.createdAt).getTime();
            const batchOrders = res.orders.filter((o) => {
              const t = new Date(o.createdAt).getTime();
              const isClose = Math.abs(t - orderTime) < 20000;
              const sameCafe = (o.cafeId?._id || o.cafeId) === (order.cafeId?._id || order.cafeId);
              return isClose && sameCafe;
            });
            if (batchOrders.length > 1) {
              setOrdersList(batchOrders);
            }
          }
        })
        .catch(() => {});
    }
  }, [order]);

  const currentOrder = ordersList[selectedIdx] || order;

  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (currentOrder?.orderNumber || currentOrder?._id) {
      const qrData = currentOrder.orderNumber || currentOrder._id;
      generateQrDataUrl(qrData).then(setQrCodeUrl);
    }
  }, [currentOrder?.orderNumber, currentOrder?._id]);

  const triggerDownloadReceipt = async (targetOrder, isManualClick = false) => {
    const o = targetOrder || currentOrder || order;
    const targetOrderId = o?._id || o?.id || orderId;
    if (!targetOrderId) return;

    try {
      setDownloading(true);
      const apiBase = import.meta.env.VITE_API_URL || 'https://jec-dining-backend.onrender.com/api';
      const token = localStorage.getItem('token') || '';

      const url = token
        ? `${apiBase}/orders/${targetOrderId}/receipt?token=${encodeURIComponent(token)}`
        : `${apiBase}/orders/${targetOrderId}/receipt`;

      const res = await fetch(url, {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch receipt content: ${res.status}`);
      }

      const htmlContent = await res.text();
      const orderNum = o?.orderNumber || targetOrderId;

      // Try PDF generation via html2pdf
      try {
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default || html2pdfModule;

        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '440px';
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);

        const targetElem = tempContainer.querySelector('#printable-receipt') || tempContainer;

        const opt = {
          margin: [6, 6, 6, 6],
          filename: `Receipt-${orderNum}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(targetElem).save();
        document.body.removeChild(tempContainer);
        toast.success(`Receipt PDF saved: #${orderNum}`);
      } catch (pdfErr) {
        console.warn('PDF module fallback to HTML receipt download:', pdfErr);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${orderNum}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success(`Receipt downloaded: #${orderNum}`);
      }
    } catch (err) {
      console.warn('Receipt download skipped/blocked:', err.message);
      if (isManualClick) {
        toast.info('Tap "Download PDF Receipt" to save your order copy.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllReceipts = async () => {
    toast.info(`Preparing ${ordersList.length} receipt downloads...`);
    for (let i = 0; i < ordersList.length; i++) {
      await triggerDownloadReceipt(ordersList[i], true);
      // Small delay between downloads so browser doesn't block multi-download
      await new Promise((r) => setTimeout(r, 600));
    }
  };

  const formatShortDate = (dateVal) => {
    if (!dateVal) return 'Today';
    const lower = dateVal.toLowerCase();
    if (lower === 'today' || lower === 'tomorrow') return dateVal;
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
    } catch {}
    return dateVal;
  };

  if (loading) {
    return (
      <div className="app-container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        Loading confirmation...
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="app-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ maxWidth: '680px', padding: '2rem 1rem' }}>
      <div
        className="card"
        style={{
          padding: '2.5rem 1.75rem',
          textAlign: 'center',
          borderRadius: '24px',
          background: '#FFFFFF',
          border: '1.5px solid #EADBCC',
          boxShadow: '0 6px 24px rgba(50, 30, 15, 0.06)'
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#DCFCE7',
            color: '#15803D',
            border: '1.5px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <CheckCircle2 size={38} />
        </div>

        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#1E140E',
            marginBottom: '0.4rem',
            letterSpacing: '-0.02em'
          }}
        >
          Order Confirmed!
        </h1>
        <p style={{ color: '#7A6E63', fontSize: '0.92rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          {ordersList.length > 1
            ? `Your combos have been booked into ${ordersList.length} separate orders for each pickup date.`
            : `Your order has been received by ${currentOrder.cafeId?.name || 'café'} kitchen staff.`}
        </p>

        {/* Multi-Order Tabs Selector (When Combos Are Scheduled on Different Dates) */}
        {ordersList.length > 1 && (
          <div
            style={{
              background: '#FAF6EE',
              border: '1.5px solid #EADBCC',
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '1.75rem',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#D66C3E' }}>
                <Layers size={14} />
                <span>SELECT SCHEDULED DATE & RECEIPT ({ordersList.length} DATES)</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadAllReceipts}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#D66C3E',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'underline'
                }}
              >
                <Download size={12} />
                <span>Download All</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ordersList.map((o, idx) => (
                <button
                  key={o._id || idx}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    flex: '1 1 140px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: selectedIdx === idx ? '2px solid #D66C3E' : '1px solid #EADBCC',
                    background: selectedIdx === idx ? '#FFFFFF' : '#F5EFE6',
                    color: selectedIdx === idx ? '#D66C3E' : '#3D2F27',
                    fontWeight: selectedIdx === idx ? 800 : 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '2px',
                    boxShadow: selectedIdx === idx ? '0 2px 8px rgba(214, 108, 62, 0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={12} color={selectedIdx === idx ? '#D66C3E' : '#756B65'} />
                    <span>Pickup: {formatShortDate(o.pickupDate)}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: selectedIdx === idx ? '#2D1A10' : '#7A6E63', fontWeight: 600 }}>
                    #{o.orderNumber}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Order Number Box */}
        <div
          style={{
            background: '#FAF6F0',
            border: '1.5px solid #EADBCC',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'inline-block',
            minWidth: '280px',
            boxShadow: '0 2px 8px rgba(50, 30, 15, 0.03)'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7A6E63', letterSpacing: '0.06em' }}>
            PICKUP ORDER NUMBER FOR {formatShortDate(currentOrder.pickupDate).toUpperCase()}
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#1E140E',
              letterSpacing: '0.04em',
              marginTop: '4px',
              fontFamily: "'Fraunces', Georgia, serif"
            }}
          >
            #{currentOrder.orderNumber}
          </div>
        </div>

        {/* Counter Pickup QR Code for Active Order */}
        <div
          style={{
            margin: '0 auto 1.5rem',
            maxWidth: '340px',
            padding: '1.25rem',
            background: '#FFFFFF',
            border: '1.5px solid #EADBCC',
            borderRadius: '20px',
            boxShadow: '0 4px 14px rgba(50, 30, 15, 0.04)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#D66C3E',
              marginBottom: '10px',
              letterSpacing: '0.06em'
            }}
          >
            <QrCode size={16} />
            <span>PICKUP QR CODE (RECEIPT #{currentOrder.orderNumber})</span>
          </div>
          <img
            src={qrCodeUrl}
            alt="Order Pickup QR Code"
            width="170"
            height="170"
            style={{ display: 'block', margin: '0 auto', borderRadius: '12px' }}
          />
          <p style={{ fontSize: '0.78rem', color: '#7A6E63', margin: '10px 0 0', lineHeight: 1.4, fontWeight: 500 }}>
            Show this QR code at the counter for pickup on <strong>{formatShortDate(currentOrder.pickupDate)}</strong>.
          </p>
        </div>

        {/* Pickup Details Card */}
        <div
          style={{
            textAlign: 'left',
            background: '#FAF6F0',
            border: '1.5px solid #EADBCC',
            padding: '1.25rem 1.5rem',
            borderRadius: '16px',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#1E140E' }}>
            <MapPin size={18} color="#D66C3E" />
            <span style={{ fontWeight: 700 }}>Pickup Location:</span>
            <span style={{ color: '#4A423B' }}>{currentOrder.cafeId?.address || 'JEC Campus Food Court'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#1E140E' }}>
            <Calendar size={18} color="#D66C3E" />
            <span style={{ fontWeight: 700 }}>Scheduled Pickup Date:</span>
            <span style={{ color: '#D66C3E', fontWeight: 800 }}>{currentOrder.pickupDate || 'Today'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => triggerDownloadReceipt(currentOrder, true)}
            disabled={downloading}
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
            <span>
              {downloading ? 'Downloading...' : `Download PDF (${formatShortDate(currentOrder.pickupDate)})`}
            </span>
          </button>

          <Link
            to="/my-orders"
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
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(50, 30, 15, 0.04)'
            }}
          >
            <span>View All My Orders</span>
          </Link>

          <Link
            to={`/order/${currentOrder._id || currentOrder.id}`}
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
