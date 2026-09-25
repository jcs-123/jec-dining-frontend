import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ItemModal = ({ isOpen, onClose, item, onSaved, existingCategories = [] }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [defaultQty, setDefaultQty] = useState(1);
  const [isVeg, setIsVeg] = useState(true);
  const [defaultNotes, setDefaultNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCategory(item.category || 'Breakfast');
      setDefaultQty(item.defaultQty || 1);
      setIsVeg(item.isVeg !== undefined ? item.isVeg : true);
      setDefaultNotes(item.defaultNotes || '');
    } else {
      setName('');
      setCategory('Breakfast');
      setDefaultQty(1);
      setIsVeg(true);
      setDefaultNotes('');
    }
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.showError('Item name is required');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        category: category.trim() || 'Breakfast',
        defaultQty: Math.max(1, parseInt(defaultQty, 10) || 1),
        isVeg,
        defaultNotes: defaultNotes.trim()
      };

      if (item && item._id) {
        await api.put(`/items/admin/${item._id}`, payload);
        toast.showSuccess(`Item "${name}" updated successfully`);
      } else {
        await api.post('/items/admin', payload);
        toast.showSuccess(`Item "${name}" added to catalog`);
      }

      onSaved();
      onClose();
    } catch (err) {
      toast.showError(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? `Edit Item: ${item.name}` : 'Add New Item to Catalog'}
      maxWidth="480px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            style={{
              background: '#C25E30',
              borderColor: '#C25E30',
              fontWeight: 700,
              minWidth: '110px'
            }}
          >
            {loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label className="form-label">Item Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Idli, Chapathi, Steamed Rice, Butter Naan..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
          <div>
            <label className="form-label">Item Category *</label>
            <input
              type="text"
              list="item-categories-list"
              className="form-input"
              placeholder="e.g. Breakfast, Lunch, Tea, Dinner..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <datalist id="item-categories-list">
              <option value="Breakfast" />
              <option value="Lunch" />
              <option value="Tea & Snacks" />
              <option value="Dinner" />
              <option value="Dinner Curry" />
              <option value="Kitchen Essentials" />
              <option value="Meal Component" />
              <option value="Bakery & Desserts" />
              <option value="Hot Beverages" />
              <option value="Cold Beverages" />
              <option value="Sides & Appetizers" />
              {existingCategories.map((c, i) => (
                <option key={i} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="form-label">Item Count (nos) *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min="1"
                className="form-input"
                value={defaultQty}
                onChange={(e) => setDefaultQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                placeholder="e.g. 3"
                required
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6E5C50' }}>nos</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#8A7E74', marginTop: '2px', display: 'block' }}>
              e.g. Dosa 3 nos, Idli 3 nos
            </span>
          </div>
        </div>

        <div>
          <label className="form-label">Default Prep Notes (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Serve hot, garnish with coriander..."
            value={defaultNotes}
            onChange={(e) => setDefaultNotes(e.target.value)}
          />
        </div>

        <div style={{
          fontSize: '0.8rem',
          color: '#7A6E63',
          background: '#FAF6EE',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid #EADBCC'
        }}>
          💡 <strong>Combo Builder Sync:</strong> Any items added here immediately appear in the Combo form dropdown for constituent portions and prep count reporting.
        </div>
      </form>
    </Modal>
  );
};
