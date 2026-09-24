import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ItemModal = ({ isOpen, onClose, item, onSaved, existingCategories = [] }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kitchen Essentials');
  const [isVeg, setIsVeg] = useState(true);
  const [defaultNotes, setDefaultNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCategory(item.category || 'Kitchen Essentials');
      setIsVeg(item.isVeg !== undefined ? item.isVeg : true);
      setDefaultNotes(item.defaultNotes || '');
    } else {
      setName('');
      setCategory('Kitchen Essentials');
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
        category: category.trim() || 'Kitchen Essentials',
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="form-label">Dietary Type *</label>
            <select
              className="form-select"
              value={isVeg ? 'veg' : 'nonveg'}
              onChange={(e) => setIsVeg(e.target.value === 'veg')}
            >
              <option value="veg">🟢 Pure Veg</option>
              <option value="nonveg">🔴 Non-Veg</option>
            </select>
          </div>

          <div>
            <label className="form-label">Item Category</label>
            <input
              type="text"
              list="item-categories-list"
              className="form-input"
              placeholder="e.g. Kitchen Essentials..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="item-categories-list">
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
