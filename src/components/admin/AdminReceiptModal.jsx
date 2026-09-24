import React, { useRef, useState, useEffect } from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Coffee,
  Zap,
  Phone,
  User,
  ShieldCheck,
  QrCode,
  Download
} from 'lucide-react';
import { formatINR, formatKolkataTime } from '../../utils/formatters';
import { generateQrDataUrl } from '../../utils/qrCode';

export const AdminReceiptModal = ({ order, cafe, isOpen, onClose }) => {
  const receiptRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (order?.orderNumber || order?._id) {
      const qrData = order.orderNumber || order._id;
      generateQrDataUrl(qrData).then(setQrCodeUrl);
    }
  }, [order?.orderNumber, order?._id]);

  if (!isOpen || !order) return null;

  const isJeccafe = (cafe?.slug === 'jeccafe') || (!cafe?.slug && !(order?.cafeId?.slug || '').includes('byte'));
  const accentColor = '#D66C3E';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(26, 18, 14, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(30, 20, 14, 0.35)',
          border: '1.5px solid #EADBCC',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Top Action Bar (Screen Only) */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            background: '#FAF6F0',
            borderBottom: '1.5px solid #EADBCC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1E140E'
              }}
            >
              Order Receipt
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #86EFAC'
              }}
            >
              {order.paymentStatus || 'Cash on Delivery'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1E140E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(30, 20, 14, 0.25)',
                transition: 'all 0.15s ease'
              }}
              title="Print receipt or save as PDF"
            >
              <Printer size={14} />
              <span>Print Bill</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EADBCC',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7A6E63',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div
          ref={receiptRef}
          className="admin-receipt-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            background: '#FFFFFF',
            color: '#1E140E',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          {/* Café Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: isJeccafe
                  ? 'linear-gradient(135deg, #361D11 0%, #7E4323 100%)'
                  : 'linear-gradient(135deg, #0A3D40 0%, #157E82 100%)',
                color: '#FFFFFF',
                marginBottom: '10px',
                boxShadow: '0 4px 12px rgba(50, 30, 15, 0.15)'
              }}
            >
              {isJeccafe ? <Coffee size={24} strokeWidth={2.3} /> : <Zap size={24} strokeWidth={2.3} />}
            </div>

            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#1E140E',
                margin: 0,
                letterSpacing: '-0.02em'
              }}
            >
              {cafe?.name || (isJeccafe ? 'JECCAFE' : 'JEC BYTES')}
            </h2>

            <p
              style={{
                fontSize: '0.82rem',
                color: '#7A6E63',
                margin: '4px 0 0',
                fontWeight: 500
              }}
            >
              {cafe?.tagline || (isJeccafe ? 'Authentic South Indian Delicacies & Filter Coffee' : 'Smoky Charcoal Alfaham, Arabian Mandi & Pepsi')}
            </p>

            <div
              style={{
                fontSize: '0.75rem',
                color: '#9C8E84',
                marginTop: '4px'
              }}
            >
              {cafe?.address || 'JEC Campus, Central Dining Plaza'}
            </div>
          </div>

          {/* Token Banner */}
          <div
            style={{
              background: '#FAF6F0',
              border: '1.5px dashed #D66C3E',
              borderRadius: '16px',
              padding: '14px 18px',
              textAlign: 'center',
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D66C3E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              COUNTER PICKUP TOKEN
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#1E140E',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                margin: '4px 0'
              }}
            >
              #{order.orderNumber}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#5C5046', fontWeight: 600 }}>
              Scheduled for: <strong>{order.pickupDate || 'Today'}</strong>
            </div>
          </div>

          {/* Order Details Metadata Table */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px 16px',
              padding: '12px 14px',
              background: '#FBF9F6',
              borderRadius: '12px',
              border: '1px solid #EADBCC',
              fontSize: '0.78rem',
              marginBottom: '20px'
            }}
          >
            <div>
              <span style={{ color: '#8C7E74', display: 'block', fontSize: '0.7rem' }}>Customer Name</span>
              <strong style={{ color: '#1E140E' }}>{order.customerSnapshot?.name || 'Walk-in Guest'}</strong>
            </div>
            <div>
              <span style={{ color: '#8C7E74', display: 'block', fontSize: '0.7rem' }}>Contact Phone</span>
              <strong style={{ color: '#1E140E' }}>{order.customerSnapshot?.phone || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#8C7E74', display: 'block', fontSize: '0.7rem' }}>Order Placed At</span>
              <span style={{ color: '#1E140E' }}>{formatKolkataTime(order.createdAt)}</span>
            </div>
            <div>
              <span style={{ color: '#8C7E74', display: 'block', fontSize: '0.7rem' }}>Payment Mode</span>
              <span style={{ color: '#1E140E', fontWeight: 600 }}>
                {order.paymentStatus || 'Cash on Delivery'}
              </span>
            </div>
          </div>

          {/* Items Purchased Table */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#8C7E74',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderBottom: '1.5px solid #1E140E',
                paddingBottom: '6px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>Item & Description</span>
              <span>Amount</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    paddingBottom: '8px',
                    borderBottom: '1px dashed #E5DDD2'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E140E' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#7A6E63' }}>
                      Qty: {item.quantity} × {formatINR(item.unitPricePaise || Math.round(item.totalPricePaise / item.quantity))}
                    </div>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div style={{ fontSize: '0.7rem', color: '#8C7E74', marginTop: '2px' }}>
                        {item.selectedOptions.map((opt, oIdx) => (
                          <span key={oIdx} style={{ display: 'inline-block', marginRight: '6px' }}>
                            + {opt.optionName} {opt.extraPricePaise > 0 ? `(${formatINR(opt.extraPricePaise)})` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1E140E', whiteSpace: 'nowrap' }}>
                    {formatINR(item.totalPricePaise)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Summary */}
          <div
            style={{
              borderTop: '1.5px solid #1E140E',
              paddingTop: '10px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#5C5046', marginBottom: '6px' }}>
              <span>Subtotal</span>
              <span>{formatINR(order.subtotalPaise)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#5C5046', marginBottom: '6px' }}>
              <span>Tax / GST</span>
              <span>{formatINR(order.taxPaise || 0)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '2px solid #1E140E',
                borderBottom: '2px solid #1E140E',
                padding: '10px 0',
                marginTop: '10px'
              }}
            >
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.15rem', fontWeight: 800, color: '#1E140E' }}>
                Total Amount
              </span>
              <span
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: '#D66C3E'
                }}
              >
                {formatINR(order.totalPaise)}
              </span>
            </div>
          </div>

          {/* QR Verification for Counter Staff */}
          <div
            style={{
              textAlign: 'center',
              padding: '14px',
              background: '#FAF6F0',
              borderRadius: '16px',
              border: '1px solid #EADBCC',
              marginBottom: '16px'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7A6E63', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
              COUNTER PICKUP QR VERIFICATION
            </div>
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Order Verification QR"
                width="130"
                height="130"
                style={{ display: 'block', margin: '0 auto', borderRadius: '8px' }}
              />
            ) : (
              <div style={{ width: '130px', height: '130px', margin: '0 auto', background: '#F8FAFC', borderRadius: '8px' }} />
            )}
            <div style={{ fontSize: '0.7rem', color: '#9C8E84', marginTop: '6px' }}>
              Scan at café checkout terminal to verify handover
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9C8E84', lineHeight: 1.5 }}>
            Thank you for dining with JEC Campus Services!
            <br />
            Need help? Contact counter manager or campus admin.
          </div>
        </div>
      </div>
    </div>
  );
};
