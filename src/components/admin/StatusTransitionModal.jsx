import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const NEXT_STATUS_MAP = {
  Pending: ['Accepted', 'Cancelled'],
  Accepted: ['Preparing', 'Cancelled'],
  Preparing: ['Ready for Pickup', 'Cancelled'],
  'Ready for Pickup': ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: []
};

export const StatusTransitionModal = ({ isOpen, onClose, order, onOrderUpdated }) => {
  if (!order) return null;

  const [selectedNextStatus, setSelectedNextStatus] = useState(
    NEXT_STATUS_MAP[order.orderStatus]?.[0] || ''
  );
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const allowedNextStatuses = NEXT_STATUS_MAP[order.orderStatus] || [];

  const handleUpdate = async () => {
    if (!selectedNextStatus) return;
    try {
      setLoading(true);
      if (selectedNextStatus === 'Cancelled') {
        await api.post(`/orders/cancel/${order._id}`, { reason: note || 'Cancelled by staff' });
      } else {
        await api.patch(`/orders/admin/${order._id}/status`, {
          nextStatus: selectedNextStatus,
          note
        });
      }
      toast.success(`Order #${order.orderNumber} transitioned to ${selectedNextStatus}`);
      onOrderUpdated();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status: #${order.orderNumber}`}
      maxWidth="480px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`btn ${selectedNextStatus === 'Cancelled' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleUpdate}
            disabled={loading || !selectedNextStatus}
          >
            {loading ? 'Updating...' : `Confirm: ${selectedNextStatus}`}
          </button>
        </>
      }
    >
      <div>
        <div style={{
          background: 'var(--bg-surface-subtle)',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CURRENT STATUS</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
              {order.orderStatus}
            </div>
          </div>
          <ArrowRight size={20} color="var(--brand-accent)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TARGET STATUS</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-accent)' }}>
              {selectedNextStatus || 'None'}
            </div>
          </div>
        </div>

        {allowedNextStatuses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            This order is in a final state ({order.orderStatus}) and cannot be transitioned further.
          </p>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Select Transition Action</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {allowedNextStatuses.map((st) => (
                  <div
                    key={st}
                    onClick={() => setSelectedNextStatus(st)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${selectedNextStatus === st ? (st === 'Cancelled' ? '#DC2626' : 'var(--brand-accent)') : 'var(--border-light)'}`,
                      background: selectedNextStatus === st ? (st === 'Cancelled' ? '#FEE2E2' : 'var(--brand-accent-light)') : '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    {st === 'Cancelled' ? (
                      <XCircle size={18} color="#DC2626" />
                    ) : (
                      <CheckCircle2 size={18} color="var(--brand-accent)" />
                    )}
                    <span>{st === 'Cancelled' ? 'Cancel Order' : `Move to "${st}"`}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Status Update Note (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Kitchen started, Oven ready, Bagged at counter"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
