import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CategoryModal = ({ isOpen, onClose, category, onSaved }) => {
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDisplayOrder(category.displayOrder || 0);
    } else {
      setName('');
      setDisplayOrder(0);
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setLoading(true);
      if (category) {
        await api.put(`/categories/admin/${category._id}`, { name, displayOrder });
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories/admin', { name, displayOrder });
        toast.success('Category created successfully');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'New Category'}
      maxWidth="440px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Breakfast Combos, Sourdough Specials"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Display Order Index</label>
          <input
            type="number"
            className="form-input"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Lower numbers appear first in the customer menu.
          </span>
        </div>
      </form>
    </Modal>
  );
};
