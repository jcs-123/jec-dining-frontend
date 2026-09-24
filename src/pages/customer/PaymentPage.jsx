import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { ShieldCheck, CreditCard, CheckCircle2, XCircle, AlertTriangle, Lock, Coffee, Zap } from 'lucide-react';

export const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const toast = useToast();

  const [paymentData, setPaymentData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle', 'processing', 'success', 'failed'
  const [errorMessage, setErrorMessage] = useState('');

  // Sandbox simulated inputs
  const [cardHolder, setCardHolder] = useState('CAMPUS DINER');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8890');
  const [cardExpiry, setCardExpiry] = useState('08/29');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('active_payment_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPaymentData(parsed);
        if (parsed?.order?.customerName) {
          setCardHolder(parsed.order.customerName.toUpperCase());
        }
      } else {
        // Fallback: fetch order details
        navigate('/my-orders');
      }
    } catch {
      navigate('/my-orders');
    }
  }, [navigate]);

  if (!paymentData) {
    return <div className="app-container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading payment portal...</div>;
  }

  const { order, payment, cafe } = paymentData;
  const isJeccafe = cafe?.slug === 'jeccafe';

  const handleSimulatePayment = async (action) => {
    try {
      setProcessing(true);
      setPaymentState('processing');
      setErrorMessage('');

      // Short simulated network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const res = await api.post('/payments/simulate-mock', {
        paymentAttemptId: payment.paymentAttemptId,
        action // 'success' | 'fail'
      });

      if (action === 'success' && res.success) {
        setPaymentState('success');
        clearCart();
        sessionStorage.removeItem('active_payment_data');
        toast.success('Payment authorized and verified!');
        setTimeout(() => {
          navigate(`/order-success/${order.id}`);
        }, 1200);
      } else {
        setPaymentState('failed');
        setErrorMessage(res.message || 'Payment was declined by issuing bank simulator.');
        toast.error('Payment simulation failed');
      }
    } catch (err) {
      setPaymentState('failed');
      setErrorMessage(err.message || 'Transaction failed');
      toast.error(err.message || 'Payment error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '560px', padding: '2rem 1rem' }}>
      <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-xl)', borderRadius: '24px' }}>
        {/* Merchant Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--divider)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: isJeccafe ? '#2E1C14' : '#0C383E',
              color: isJeccafe ? '#C86D44' : '#E86034',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isJeccafe ? <Coffee size={20} /> : <Zap size={20} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                {payment.merchantName || cafe?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Order #{order.orderNumber}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AMOUNT DUE</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
              {formatINR(order.totalPaise)}
            </div>
          </div>
        </div>

        {/* Development Mode Notice */}
        <div style={{
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          padding: '10px 14px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1.5rem',
          fontSize: '0.825rem',
          color: '#92400E'
        }}>
          <ShieldCheck size={18} color="#D97706" />
          <div>
            <strong>Interactive Sandbox Gateway:</strong> Simulates multi-merchant checkout with instant signature verification.
          </div>
        </div>

        {/* Payment Form View */}
        {paymentState === 'processing' ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div className="animate-pulse" style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--brand-accent-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--brand-accent)'
            }}>
              <Lock size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Authorizing Payment...
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Verifying credentials with {cafe?.name} gateway adapter
            </p>
          </div>
        ) : paymentState === 'success' ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <CheckCircle2 size={56} color="#16A34A" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.5rem' }}>
              Payment Verified!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Redirecting to order confirmation...
            </p>
          </div>
        ) : (
          <div>
            {/* Simulated Card Container */}
            <div style={{
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, #3D261C 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.8 }}>PREMIUM CAMPUS CARD</span>
                <CreditCard size={24} color="var(--brand-accent)" />
              </div>

              <div style={{ fontSize: '1.2rem', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '1.25rem' }}>
                {cardNumber}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ opacity: 0.7, fontSize: '0.65rem' }}>CARD HOLDER</div>
                  <div style={{ fontWeight: 600 }}>{cardHolder}</div>
                </div>
                <div>
                  <div style={{ opacity: 0.7, fontSize: '0.65rem' }}>EXPIRES</div>
                  <div style={{ fontWeight: 600 }}>{cardExpiry}</div>
                </div>
              </div>
            </div>

            {/* Error message banner if declined */}
            {errorMessage && (
              <div style={{
                background: '#FEE2E2',
                color: '#DC2626',
                padding: '10px 14px',
                borderRadius: '10px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <XCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Sandbox Simulator Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleSimulatePayment('success')}
                disabled={processing}
                className="btn btn-primary btn-full"
                style={{ padding: '0.85rem', fontSize: '1rem', gap: '8px' }}
              >
                <CheckCircle2 size={18} />
                <span>Simulate Successful Payment ({formatINR(order.totalPaise)})</span>
              </button>

              <button
                onClick={() => handleSimulatePayment('fail')}
                disabled={processing}
                className="btn btn-outline btn-full"
                style={{ color: '#DC2626', borderColor: '#FCA5A5', gap: '8px' }}
              >
                <XCircle size={18} />
                <span>Simulate Card Decline / Failure</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
