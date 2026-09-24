import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Tag, Hash, Info, FolderPlus, Edit3, Check } from 'lucide-react';

export const CategoryModal = ({ isOpen, onClose, category, cafeName, onSaved }) => {
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDisplayOrder(category.displayOrder ?? 0);
    } else {
      setName('');
      setDisplayOrder(0);
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.showError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      if (category) {
        await api.put(`/categories/admin/${category._id}`, {
          name: trimmedName,
          displayOrder: Number(displayOrder) || 0
        });
        toast.showSuccess(`Category "${trimmedName}" updated successfully`);
      } else {
        await api.post('/categories/admin', {
          name: trimmedName,
          displayOrder: Number(displayOrder) || 0
        });
        toast.showSuccess(`Category "${trimmedName}" created successfully`);
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.showError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(category);
  const modalTitle = isEditing
    ? `Edit Category: ${category?.name}`
    : `Add New Category to ${cafeName || 'Menu'}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#FAF5EE',
              border: '1px solid #EADBCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C25E30',
              flexShrink: 0
            }}
          >
            {isEditing ? <Edit3 size={16} /> : <FolderPlus size={16} />}
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E140E' }}>
            {modalTitle}
          </span>
        </div>
      }
      maxWidth="480px"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
            style={{ fontWeight: 600, borderRadius: '10px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            style={{
              background: '#C25E30',
              borderColor: '#C25E30',
              fontWeight: 700,
              borderRadius: '10px',
              gap: '6px'
            }}
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check size={16} />
                <span>{isEditing ? 'Update Category' : 'Create Category'}</span>
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Category Name */}
        <div className="form-group" style={{ margin: 0 }}>
          <label
            className="form-label"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: '#3C2A1E',
              marginBottom: '6px'
            }}
          >
            <Tag size={15} color="#C25E30" />
            <span>Category Name</span>
            <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Breakfast Combos, Sourdough Specials, Cold Brews"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            style={{
              height: '44px',
              fontSize: '0.92rem',
              borderRadius: '10px',
              border: '1.5px solid #EADBCC',
              background: '#FAF8F5'
            }}
          />
          <span style={{ fontSize: '0.78rem', color: '#7A6E63', marginTop: '4px', display: 'block' }}>
            Will appear as a prominent navigation tab and filter in student menu.
          </span>
        </div>

        {/* Display Order Index */}
        <div className="form-group" style={{ margin: 0 }}>
          <label
            className="form-label"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: '#3C2A1E',
              marginBottom: '6px'
            }}
          >
            <Hash size={15} color="#C25E30" />
            <span>Display Order Index</span>
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              className="form-input"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              style={{
                width: '90px',
                height: '44px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '10px',
                border: '1.5px solid #EADBCC',
                background: '#FAF8F5'
              }}
            />
            {/* Quick preset chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDisplayOrder(val)}
                  style={{
                    border: displayOrder === val ? '1.5px solid #C25E30' : '1px solid #EADBCC',
                    background: displayOrder === val ? '#FAF3ED' : '#FAF8F5',
                    color: displayOrder === val ? '#C25E30' : '#695A4D',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {val === 0 ? '0 (First)' : val}
                </button>
              ))}
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#7A6E63', marginTop: '4px', display: 'block' }}>
            Lower numbers appear first (e.g. 0 appears on the far left of menu tabs).
          </span>
        </div>

        {/* Tip Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: '#FAF6EE',
            border: '1px solid #EADBCC',
            color: '#5C4E43',
            fontSize: '0.8rem',
            lineHeight: 1.4
          }}
        >
          <Info size={16} color="#C25E30" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            Combos tagged with this category will automatically be grouped under this section in the customer ordering menu.
          </div>
        </div>
      </form>
    </Modal>
  );
};
