import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Upload, AlertCircle, Store, Database, Check, X } from 'lucide-react';

export const ComboFormModal = ({ isOpen, onClose, combo, categories, onSaved, cafeName }) => {
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [basePriceRupees, setBasePriceRupees] = useState('');
  const [fixedItems, setFixedItems] = useState([]);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // DB items state
  const [dbItems, setDbItems] = useState([]);
  const [isAddingNewDbItem, setIsAddingNewDbItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Kitchen Essentials');
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);
  const [newItemNotes, setNewItemNotes] = useState('');
  const [savingItem, setSavingItem] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadDbItems();
    }
  }, [isOpen]);

  const loadDbItems = async () => {
    try {
      const res = await api.get('/items/admin');
      if (res.success && Array.isArray(res.items)) {
        setDbItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load DB items:', err);
    }
  };

  useEffect(() => {
    if (combo) {
      setCategoryId(combo.categoryId?._id || combo.categoryId || '');
      setName(combo.name || '');
      setDescription(combo.description || '');
      setImage(combo.image || '');
      setIsVeg(combo.isVeg !== undefined ? combo.isVeg : true);
      setBasePriceRupees(combo.basePricePaise ? (combo.basePricePaise / 100).toString() : '');
      setFixedItems(combo.fixedItems || []);
      setDisplayOrder(combo.displayOrder || 0);
    } else {
      setCategoryId(categories.length > 0 ? categories[0]._id : '');
      setName('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      setIsVeg(true);
      setBasePriceRupees('199');
      setFixedItems([]);
      setDisplayOrder(0);
    }
    setIsAddingNewDbItem(false);
  }, [combo, categories, isOpen]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/combos/admin/upload-image', formData);
      if (res.imageUrl) {
        setImage(`http://localhost:5000${res.imageUrl}`);
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Fixed item helpers
  const addFixedItem = () => {
    const defaultItemName = dbItems.length > 0 ? dbItems[0].name : '';
    const defaultNotes = dbItems.length > 0 ? (dbItems[0].defaultNotes || '') : '';
    setFixedItems([...fixedItems, { name: defaultItemName, quantity: 1, notes: defaultNotes }]);
  };

  const handleSelectItem = (fIdx, selectedValue) => {
    if (selectedValue === '__ADD_NEW__') {
      setIsAddingNewDbItem(true);
      return;
    }
    const matchedItem = dbItems.find(it => it.name === selectedValue);
    const updated = [...fixedItems];
    updated[fIdx] = {
      ...updated[fIdx],
      name: selectedValue,
      notes: matchedItem?.defaultNotes || updated[fIdx].notes || ''
    };
    setFixedItems(updated);
  };

  const updateFixedItem = (idx, field, val) => {
    const updated = [...fixedItems];
    updated[idx][field] = val;
    setFixedItems(updated);
  };

  const removeFixedItem = (idx) => {
    setFixedItems(fixedItems.filter((_, i) => i !== idx));
  };

  const handleCreateDbItem = async (e) => {
    if (e) e.preventDefault();
    if (!newItemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }
    try {
      setSavingItem(true);
      const res = await api.post('/items/admin', {
        name: newItemName.trim(),
        category: newItemCategory.trim() || 'General',
        isVeg: newItemIsVeg,
        defaultNotes: newItemNotes.trim()
      });
      if (res.success && res.item) {
        toast.success(`"${res.item.name}" added to café database`);
        const updatedList = [...dbItems.filter(i => i._id !== res.item._id), res.item].sort((a, b) => a.name.localeCompare(b.name));
        setDbItems(updatedList);
        // Automatically add to combo fixed items
        setFixedItems(prev => [...prev, { name: res.item.name, quantity: 1, notes: res.item.defaultNotes || '' }]);
        setNewItemName('');
        setNewItemNotes('');
        setIsAddingNewDbItem(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save item to database');
    } finally {
      setSavingItem(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const basePaise = Math.round(parseFloat(basePriceRupees) * 100);

    if (isNaN(basePaise) || basePaise < 0) {
      toast.error('Please enter a valid price in INR');
      return;
    }

    // Filter out any blank fixed items
    const cleanedFixedItems = fixedItems
      .map(fi => ({
        name: (fi.name || '').trim(),
        quantity: parseInt(fi.quantity, 10) || 1,
        notes: (fi.notes || '').trim()
      }))
      .filter(fi => fi.name.length > 0);

    const payload = {
      categoryId,
      name: name.trim(),
      description: description.trim(),
      image,
      isVeg,
      basePricePaise: basePaise,
      offerPricePaise: null,
      availableStock: combo?.availableStock !== undefined ? combo.availableStock : 999,
      isConfigurable: false,
      fixedItems: cleanedFixedItems,
      customizationGroups: [],
      displayOrder: parseInt(displayOrder, 10) || 0
    };

    try {
      setLoading(true);
      if (combo) {
        await api.put(`/combos/admin/${combo._id}`, payload);
        toast.success('Combo updated successfully');
      } else {
        await api.post('/combos/admin', payload);
        toast.success('Combo created successfully');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save combo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={combo ? `Edit Combo: ${combo.name} (${cafeName || 'Current Café'})` : `Add New Combo to ${cafeName || 'Current Café'}`}
      maxWidth="760px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Combo'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cafeName && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.65rem 0.9rem',
            background: 'rgba(234, 88, 12, 0.08)',
            border: '1px solid rgba(234, 88, 12, 0.25)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-primary-dark, #c2410c)',
            fontSize: '0.84rem',
            fontWeight: 500
          }}>
            <Store size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Target Café Catalog:</strong> {cafeName} — This combo is strictly isolated and will only be published to the {cafeName} menu.
            </span>
          </div>
        )}

        {/* Basic Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Combo Name *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Executive Breakfast Panini & Latte"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={2}
            placeholder="Detailed description of flavors, ingredients, and pairings..."
          />
        </div>

        {/* Pricing & Dietary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Price (INR) *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={basePriceRupees}
              onChange={(e) => setBasePriceRupees(e.target.value)}
              placeholder="e.g. 199"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dietary</label>
            <select
              className="form-select"
              value={isVeg ? 'veg' : 'nonveg'}
              onChange={(e) => setIsVeg(e.target.value === 'veg')}
            >
              <option value="veg">Vegetarian (Pure Veg)</option>
              <option value="nonveg">Non-Vegetarian</option>
            </select>
          </div>
        </div>

        {/* Image URL & Upload */}
        <div className="form-group">
          <label className="form-label">Image URL or Local Upload</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
            <label className="btn btn-outline" style={{ cursor: 'pointer', gap: '6px' }}>
              <Upload size={16} />
              <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Included Fixed Items Section with Database Dropdown & Add Option */}
        <div style={{
          borderTop: '1px solid var(--border-light, #e2e8f0)',
          paddingTop: '1.25rem',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <label className="form-label" style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={15} style={{ color: 'var(--brand-accent)' }} />
                <span>Included Fixed Items (DB Dropdown)</span>
              </label>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Select items from your café's database or create new items directly.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAddingNewDbItem(!isAddingNewDbItem)}
                className="btn btn-outline btn-sm"
                style={{ gap: '4px', fontSize: '0.78rem' }}
              >
                <Plus size={13} />
                <span>+ Add Item to DB</span>
              </button>
              <button
                type="button"
                onClick={addFixedItem}
                className="btn btn-primary btn-sm"
                style={{ gap: '4px', fontSize: '0.78rem' }}
              >
                <Plus size={13} />
                <span>Add Item Slot</span>
              </button>
            </div>
          </div>

          {/* Inline "Add New Item to DB" Form */}
          {isAddingNewDbItem && (
            <div style={{
              background: 'var(--bg-surface-subtle, #f8fafc)',
              border: '1px dashed var(--brand-accent, #ea580c)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Save New Item to Café Database
                </strong>
                <button
                  type="button"
                  onClick={() => setIsAddingNewDbItem(false)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '2px 6px' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Item name (e.g. Butter Croissant)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Category (e.g. Bakery)"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <select
                    className="form-select"
                    value={newItemIsVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setNewItemIsVeg(e.target.value === 'veg')}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="veg">🟢 Veg</option>
                    <option value="nonveg">🔴 Non-Veg</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Default notes (e.g. Freshly baked, served warm)"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  style={{ fontSize: '0.85rem', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleCreateDbItem}
                  disabled={savingItem}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '4px', whiteSpace: 'nowrap' }}
                >
                  <Check size={14} />
                  <span>{savingItem ? 'Saving...' : 'Save & Select'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Fixed Items List with DB Dropdowns */}
          {fixedItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1.25rem',
              background: 'var(--bg-surface-subtle, #f8fafc)',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}>
              No fixed items added yet. Click <strong>"Add Item Slot"</strong> above to select items from your café database.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fixedItems.map((fi, fIdx) => (
                <div
                  key={fIdx}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    background: 'var(--bg-surface-subtle, #f8fafc)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light, #e2e8f0)'
                  }}
                >
                  {/* Dropdown for DB items */}
                  <select
                    className="form-select"
                    value={fi.name}
                    onChange={(e) => handleSelectItem(fIdx, e.target.value)}
                    style={{ flex: 2, fontSize: '0.85rem' }}
                  >
                    <option value="">-- Select Item from DB --</option>
                    {dbItems.map((it) => (
                      <option key={it._id} value={it.name}>
                        {it.name} {it.isVeg ? '🟢' : '🔴'} ({it.category || 'Item'})
                      </option>
                    ))}
                    {fi.name && !dbItems.some(it => it.name.toLowerCase() === fi.name.toLowerCase()) && (
                      <option value={fi.name}>
                        {fi.name} (Custom / Legacy)
                      </option>
                    )}
                    <option value="__ADD_NEW__">➕ Add New Item to DB...</option>
                  </select>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty:</span>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={fi.quantity}
                      onChange={(e) => updateFixedItem(fIdx, 'quantity', parseInt(e.target.value, 10) || 1)}
                      style={{ width: '65px', fontSize: '0.85rem', textAlign: 'center' }}
                    />
                  </div>

                  {/* Notes */}
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Notes (e.g. Crispy)"
                    value={fi.notes}
                    onChange={(e) => updateFixedItem(fIdx, 'notes', e.target.value)}
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  />

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFixedItem(fIdx)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#DC2626', padding: '4px 6px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
