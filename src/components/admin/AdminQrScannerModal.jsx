import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Camera,
  RefreshCw,
  ShoppingBag,
  User,
  Calendar,
  Lock,
  ArrowRight,
  Barcode
} from 'lucide-react';

export const AdminQrScannerModal = ({ isOpen, onClose, onOrderDelivered }) => {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1); // 1: Scan QR, 2: Verify Order, 3: Deliver
  const [manualInput, setManualInput] = useState('');
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [verifyingOrder, setVerifyingOrder] = useState(false);
  const [scannedOrder, setScannedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const html5QrCodeRef = useRef(null);
  const scannerContainerId = 'qr-reader-container';

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setScannedOrder(null);
      setErrorMsg('');
      setCameraError('');
      setManualInput('');

      // Delay camera initialization slightly for DOM mounting
      const timer = setTimeout(() => {
        startScanner();
      }, 250);

      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [isOpen]);

  const startScanner = async () => {
    try {
      const container = document.getElementById(scannerContainerId);
      if (!container) return;

      stopScanner();

      const qrCode = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = qrCode;

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleQrCodeDecoded(decodedText);
        },
        () => {
          // Frame parse failure (normal while scanning)
        }
      );
      setScannerActive(true);
      setCameraError('');
    } catch (err) {
      console.warn('Camera scanner initialization notice:', err);
      setCameraError('Camera access is unavailable');
      setScannerActive(false);
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().then(() => {
            html5QrCodeRef.current?.clear();
          }).catch(() => {});
        } else {
          html5QrCodeRef.current.clear();
        }
      } catch {}
      html5QrCodeRef.current = null;
    }
    setScannerActive(false);
  };

  const extractOrderId = (text) => {
    if (!text) return '';
    const clean = text.trim();

    // Check URL pattern: .../admin/verify-pickup/<orderId>
    const matchUrl = clean.match(/verify-pickup\/([a-zA-Z0-9_-]+)/);
    if (matchUrl && matchUrl[1]) {
      return matchUrl[1];
    }

    // Check prefix JEC_ORDER:<orderId>
    if (clean.startsWith('JEC_ORDER:')) {
      return clean.replace('JEC_ORDER:', '').trim();
    }

    // Check ORDER:<orderId>
    if (clean.startsWith('ORDER:')) {
      return clean.replace('ORDER:', '').trim();
    }

    // Strip leading hash if present (e.g. #ORD-123)
    if (clean.startsWith('#')) {
      return clean.replace(/^#+/, '').trim();
    }

    return clean;
  };

  const handleQrCodeDecoded = async (decodedText) => {
    const rawId = extractOrderId(decodedText);
    if (!rawId) return;

    stopScanner();
    await lookupAndDisplayOrder(rawId);
  };

  const lookupAndDisplayOrder = async (queryId) => {
    try {
      setLoadingOrder(true);
      setErrorMsg('');

      let foundOrder = null;

      // 1. Try admin list search by orderNumber / ID
      try {
        const searchRes = await api.get(`/orders/admin/list?search=${encodeURIComponent(queryId)}`);
        if (searchRes.success && searchRes.orders && searchRes.orders.length > 0) {
          foundOrder = searchRes.orders.find(
            (o) =>
              (o.orderNumber && o.orderNumber.toUpperCase() === queryId.toUpperCase()) ||
              (o._id && o._id.toString() === queryId)
          ) || searchRes.orders[0];
        }
      } catch {}

      // 2. Try direct ID fallback
      if (!foundOrder) {
        try {
          const res = await api.get(`/orders/my-orders/${queryId}`);
          if (res.success && res.order) foundOrder = res.order;
        } catch {}
      }

      if (foundOrder) {
        setScannedOrder(foundOrder);
        if (foundOrder.orderStatus === 'Completed') {
          setCurrentStep(3);
        } else {
          setCurrentStep(2);
        }
      } else {
        setErrorMsg(`No order found matching token or ID: "${queryId}"`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error searching for order');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const targetId = extractOrderId(manualInput);
    lookupAndDisplayOrder(targetId);
  };

  const handleMarkDelivered = async () => {
    if (!scannedOrder) return;
    try {
      setVerifyingOrder(true);
      const res = await api.post(`/orders/admin/${scannedOrder._id}/verify-pickup`);
      if (res.success && res.order) {
        setScannedOrder(res.order);
        setCurrentStep(3);
        toast.success(`Order #${res.order.orderNumber} marked as Delivered!`);
        if (onOrderDelivered) {
          onOrderDelivered(res.order);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update delivery status');
    } finally {
      setVerifyingOrder(false);
    }
  };

  const handleScanNext = () => {
    setScannedOrder(null);
    setErrorMsg('');
    setManualInput('');
    setCurrentStep(1);
    startScanner();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(20, 10, 5, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="scanner-modal-card">
        {/* Header */}
        <div className="scanner-modal-header">
          <div className="scanner-header-left">
            <div className="scanner-icon-badge">
              <QrCode size={22} />
            </div>
            <div>
              <h2 className="scanner-header-title">
                Scan QR & Deliver
              </h2>
              <p className="scanner-header-subtitle">
                Instant pickup verification & handover terminal
              </p>
            </div>
          </div>

          <button
            type="button"
            className="scanner-close-btn"
            onClick={onClose}
            aria-label="Close terminal"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3-Step Tracker matching Mockup */}
        <div className="scanner-step-tracker">
          {/* Step 1 */}
          <div className={`scanner-step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="scanner-step-num">1</div>
            <span className="scanner-step-label">Scan QR</span>
          </div>

          {/* Line 1-2 */}
          <div className={`scanner-step-line ${currentStep >= 2 ? 'active' : ''}`} />

          {/* Step 2 */}
          <div className={`scanner-step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="scanner-step-num">2</div>
            <span className="scanner-step-label">Verify Order</span>
          </div>

          {/* Line 2-3 */}
          <div className={`scanner-step-line ${currentStep >= 3 ? 'active' : ''}`} />

          {/* Step 3 */}
          <div className={`scanner-step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep === 3 ? 'completed' : ''}`}>
            <div className="scanner-step-num">3</div>
            <span className="scanner-step-label">Deliver</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="scanner-modal-body">
          {/* Step 1: Scanner Viewport Box & Manual Input */}
          {currentStep === 1 && (
            <>
              {/* Dark Scanner Viewport Box */}
              <div className="scanner-viewport-box">
                {/* Glowing top ambient lens flare */}
                <div className="scanner-top-flare" />

                {/* 4 Bracket Corners */}
                <div className="scanner-bracket scanner-bracket-tl" />
                <div className="scanner-bracket scanner-bracket-tr" />
                <div className="scanner-bracket scanner-bracket-bl" />
                <div className="scanner-bracket scanner-bracket-br" />

                {/* Video container for Html5Qrcode */}
                <div
                  id={scannerContainerId}
                  className="scanner-video-feed"
                  style={{ display: scannerActive ? 'block' : 'none' }}
                />

                {/* Camera Inactive / Notice View matching Mockup */}
                {!scannerActive && (
                  <div className="scanner-camera-off-wrap">
                    <div className="scanner-cam-icon-box">
                      <Camera size={48} color="#D66C3E" strokeWidth={1.75} />
                      <span className="scanner-cam-alert-badge">!</span>
                    </div>

                    <h3 className="scanner-camera-title">Camera access is unavailable</h3>
                    <p className="scanner-camera-desc">
                      Allow camera permission to scan a customer QR code, or use manual verification below.
                    </p>

                    <div className="scanner-camera-actions">
                      <button
                        type="button"
                        onClick={startScanner}
                        className="scanner-btn-enable"
                      >
                        Enable Camera
                      </button>
                      <button
                        type="button"
                        onClick={startScanner}
                        className="scanner-btn-retry"
                      >
                        Retry
                      </button>
                    </div>

                    <div className="scanner-privacy-note">
                      <Lock size={13} />
                      <span>Camera data is processed only for verification.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message Alert Banner */}
              {errorMsg && (
                <div
                  style={{
                    background: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Divider: OR VERIFY MANUALLY */}
              <div className="scanner-divider">
                <div className="scanner-divider-line" />
                <span className="scanner-divider-text">OR VERIFY MANUALLY</span>
                <div className="scanner-divider-line" />
              </div>

              {/* Manual Input Form */}
              <form onSubmit={handleManualSubmit} className="scanner-manual-form">
                <div className="scanner-input-group">
                  <span className="scanner-hash-badge">#</span>
                  <input
                    type="text"
                    className="scanner-manual-input"
                    placeholder="Enter Order ID or verification token"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="scanner-submit-btn"
                  disabled={!manualInput.trim() || loadingOrder}
                >
                  <span>{loadingOrder ? 'Verifying...' : 'Verify Order'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Barcode Scanner Note */}
              <div className="scanner-barcode-note">
                <Barcode size={18} color="#8A7E74" />
                <span>USB and handheld barcode scanners are supported.</span>
              </div>
            </>
          )}

          {/* Step 2 & 3: Order Details Preview & Delivery Action */}
          {currentStep >= 2 && scannedOrder && (
            <div
              style={{
                background: '#FAF6EE',
                border: '1.5px solid #EADBCC',
                borderRadius: '18px',
                padding: '20px',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              {/* Order status banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #EADBCC'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8A7264', textTransform: 'uppercase' }}>
                    Order Number
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D66C3E' }}>
                    #{scannedOrder.orderNumber}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      background: scannedOrder.orderStatus === 'Completed' ? '#DCFCE7' : '#FEF3C7',
                      color: scannedOrder.orderStatus === 'Completed' ? '#166534' : '#92400E',
                      border: `1px solid ${scannedOrder.orderStatus === 'Completed' ? '#86EFAC' : '#FDE68A'}`
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{scannedOrder.orderStatus === 'Completed' ? 'DELIVERED' : scannedOrder.orderStatus.toUpperCase()}</span>
                  </span>
                </div>
              </div>

              {/* Customer & Scheduled Time */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '12px', border: '1px solid #EADBCC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7A6E63', marginBottom: '3px' }}>
                    <User size={13} />
                    <span>Customer</span>
                  </div>
                  <strong style={{ color: '#1E140E' }}>{scannedOrder.customerSnapshot?.name || 'Customer'}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#8A7264' }}>{scannedOrder.customerSnapshot?.phone || 'No phone'}</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '12px', border: '1px solid #EADBCC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7A6E63', marginBottom: '3px' }}>
                    <Calendar size={13} />
                    <span>Pickup Date</span>
                  </div>
                  <strong style={{ color: '#1E140E' }}>{scannedOrder.pickupDate || 'Today'}</strong>
                </div>
              </div>

              {/* Items to Hand Over */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E140E', marginBottom: '8px' }}>
                  Items to Hand Over:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {scannedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #EADBCC',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#D66C3E' }}>{item.quantity}x</span>
                        <span style={{ fontWeight: 600, color: '#1E140E' }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#7A6E63' }}>{formatINR(item.totalPricePaise)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {scannedOrder.orderStatus === 'Completed' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      background: '#DCFCE7',
                      color: '#166534',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Order is verified and marked as Delivered & Handed Over</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleScanNext}
                    className="scanner-submit-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <RefreshCw size={16} />
                    <span>Scan Next Customer</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleMarkDelivered}
                    disabled={verifyingOrder}
                    style={{
                      flex: 2,
                      minWidth: '180px',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{verifyingOrder ? 'Updating...' : 'Deliver Order'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleScanNext}
                    style={{
                      flex: 1,
                      minWidth: '110px',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: '1.5px solid #EADBCC',
                      background: '#FFFFFF',
                      color: '#4A423B',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
