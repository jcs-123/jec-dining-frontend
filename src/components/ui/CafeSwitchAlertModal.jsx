import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CafeSwitchAlertModal = () => {
  const { pendingCafeSwitch, cartCafe } = useCart();

  if (!pendingCafeSwitch) return null;

  return (
    <Modal
      isOpen={true}
      onClose={pendingCafeSwitch.onCancel}
      title="Switch Café Order?"
      maxWidth="460px"
      footer={
        <>
          <button className="btn btn-outline" onClick={pendingCafeSwitch.onCancel}>
            Keep Current Cart
          </button>
          <button className="btn btn-primary" onClick={pendingCafeSwitch.onConfirm}>
            Clear & Switch to {pendingCafeSwitch.targetCafe?.name}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          background: '#FEF3C7',
          padding: '10px',
          borderRadius: '12px',
          color: '#D97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={28} />
        </div>
        <div>
          <p style={{ fontWeight: 600, color: '#1C1917', marginBottom: '8px' }}>
            Your cart already contains items from {cartCafe?.name}.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#78716C' }}>
            Each order can only be placed with one café at a time. Switching to{' '}
            <strong>{pendingCafeSwitch.targetCafe?.name}</strong> will empty your current cart.
          </p>
        </div>
      </div>
    </Modal>
  );
};
