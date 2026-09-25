import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Upload, Store, Database, Settings, Search, X } from 'lucide-react';



const getItemCategory = (it) => {
  return it?.category || 'Breakfast';
};

const getItemDefaultQty = (it) => {
  return (it?.defaultQty && it.defaultQty > 0) ? it.defaultQty : 1;
};


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

  // Available items in cafe catalog
  const [dbItems, setDbItems] = useState([]);

  // Dropdown items management state
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showManageItemsModal, setShowManageItemsModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemNotes, setNewItemNotes] = useState('');
  const [savingNewItem, setSavingNewItem] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [itemsSearchFilter, setItemsSearchFilter] = useState('');
  const [activeRowIdx, setActiveRowIdx] = useState(null);

  const openAddItemModal = (rowIdx = null) => {
    setActiveRowIdx(rowIdx);
    setNewItemCategory('');
    setNewItemName('');
    setNewItemQty(1);
    setNewItemNotes('');
    setShowAddItemModal(true);
  };

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

  const handleClearForm = () => {
    setCategoryId('');
    setName('');
    setDescription('');
    setImage('');
    setIsVeg(true);
    setBasePriceRupees('');
    setFixedItems([]);
    setDisplayOrder(0);
    toast.info('Form cleared');
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
      // Clean blank form with no pre-filled image, category, price, or items
      setCategoryId('');
      setName('');
      setDescription('');
      setImage('');
      setIsVeg(true);
      setBasePriceRupees('');
      setFixedItems([]);
      setDisplayOrder(0);
    }
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
        setImage(`https://jec-dining-backend.onrender.com${res.imageUrl}`);
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Fixed item helpers - Simple & Direct "Add Item / Delete Item / Delete All"
  const addFixedItem = (customName = '', customQty = null, customNotes = '') => {
    let initialQty = customQty;
    let initialNotes = customNotes;

    if (customName && (!initialQty || initialQty <= 0)) {
      const matched = dbItems.find(it => it.name.toLowerCase() === customName.toLowerCase());
      if (matched) {
        initialQty = getItemDefaultQty(matched);
        initialNotes = initialNotes || matched.defaultNotes || '';
      }
    }

    setFixedItems(prev => [
      ...prev,
      {
        name: customName || '',
        quantity: initialQty || 1,
        notes: initialNotes || '',
        isCustom: false
      }
    ]);
  };

  const handleSelectItem = (fIdx, selectedValue) => {
    if (selectedValue === '__custom__') {
      const updated = [...fixedItems];
      updated[fIdx] = {
        ...updated[fIdx],
        isCustom: true,
        name: ''
      };
      setFixedItems(updated);
      return;
    }

    const matchedItem = dbItems.find(it => it.name === selectedValue);
    const autoQty = matchedItem ? getItemDefaultQty(matchedItem) : 1;
    const autoNotes = matchedItem?.defaultNotes || '';

    const updated = [...fixedItems];
    updated[fIdx] = {
      ...updated[fIdx],
      name: selectedValue,
      quantity: autoQty,
      isCustom: false,
      notes: updated[fIdx].notes || autoNotes
    };
    setFixedItems(updated);
  };

  const updateFixedItem = (idx, field, val) => {
    const updated = [...fixedItems];
    updated[idx] = {
      ...updated[idx],
      [field]: val
    };
    setFixedItems(updated);
  };

  const removeFixedItem = (idx) => {
    setFixedItems(fixedItems.filter((_, i) => i !== idx));
  };

  const handleDeleteAll = () => {
    if (fixedItems.length === 0) return;
    setFixedItems([]);
    toast.info('All items deleted from combo');
  };

  const handleAddNewItemToCatalog = async (e) => {
    if (e) e.preventDefault();
    const trimmed = newItemName.trim();
    if (!trimmed) {
      toast.error('Please enter an item name');
      return;
    }

    try {
      setSavingNewItem(true);
      const res = await api.post('/items/admin', {
        name: trimmed,
        category: newItemCategory || 'Breakfast',
        defaultQty: parseInt(newItemQty, 10) || 1,
        isVeg: true,
        defaultNotes: newItemNotes.trim()
      });

      if (res.success && res.item) {
        toast.success(`"${res.item.name}" added to ${newItemCategory} dropdown list`);
        await loadDbItems();

        if (activeRowIdx !== null && activeRowIdx < fixedItems.length) {
          const updated = [...fixedItems];
          updated[activeRowIdx] = {
            ...updated[activeRowIdx],
            name: res.item.name,
            quantity: res.item.defaultQty || 1,
            notes: res.item.defaultNotes || ''
          };
          setFixedItems(updated);
        }

        setNewItemName('');
        setNewItemQty(1);
        setNewItemNotes('');
        setShowAddItemModal(false);
        setActiveRowIdx(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add item to dropdown');
    } finally {
      setSavingNewItem(false);
    }
  };

  const handleDeleteItemFromCatalog = async (itemId, itemName) => {
    if (!window.confirm(`Delete "${itemName}" permanently from the dropdown list?`)) return;

    try {
      setDeletingItemId(itemId);
      const res = await api.delete(`/items/admin/${itemId}`);
      if (res.success) {
        toast.success(`"${itemName}" deleted from dropdown list`);
        setDbItems(prev => prev.filter(it => it._id !== itemId));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete item from dropdown');
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleClearAllCatalogItems = async () => {
    if (!window.confirm('Delete ALL items from the catalog permanently? This cannot be undone.')) return;

    try {
      const res = await api.delete('/items/admin/all');
      if (res.success) {
        toast.success('All items removed from catalog');
        setDbItems([]);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to clear catalog');
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

  const catalogCategories = useMemo(() => {
    const cats = new Set();
    dbItems.forEach(it => {
      if (it.category) cats.add(it.category);
    });
    return Array.from(cats);
  }, [dbItems]);

  const modalTitle = combo
    ? `Edit Combo: ${combo.name}`
    : `Add New Combo to ${cafeName || 'JECCAFE'}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClearForm}
            disabled={loading}
            style={{ borderRadius: '10px', fontWeight: 700, color: '#8C7E74', borderColor: '#E2D3C4' }}
            title="Reset and clear all form inputs"
          >
            Clear Form
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
              style={{ minWidth: '95px', borderRadius: '10px', fontWeight: 700 }}
            >
              Cancel
            </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              minWidth: '130px',
              borderRadius: '10px',
              fontWeight: 800,
              background: '#C25E30',
              borderColor: '#C25E30',
              boxShadow: '0 3px 10px rgba(194, 94, 48, 0.25)'
            }}
          >
            {loading ? 'Saving...' : 'Save Combo'}
          </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {cafeName && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 0.95rem',
            background: 'rgba(214, 108, 62, 0.08)',
            border: '1px solid rgba(214, 108, 62, 0.25)',
            borderRadius: '12px',
            color: '#A84B22',
            fontSize: '0.84rem',
            fontWeight: 500
          }}>
            <Store size={18} style={{ flexShrink: 0, color: '#D66C3E' }} />
            <span>
              <strong>Target Café Catalog:</strong> {cafeName} — This combo is strictly isolated to the {cafeName} campus menu.
            </span>
          </div>
        )}

        {/* Basic Information - Responsive 2-Col Grid */}
        <div className="modal-form-grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
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

          <div className="form-group" style={{ marginBottom: 0 }}>
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

        <div className="form-group" style={{ marginBottom: 0 }}>
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

        {/* Pricing & Dietary - Responsive 2-Col Grid */}
        <div className="modal-form-grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
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

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Dietary Type</label>
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

        {/* Image URL & Upload - Responsive Row */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Image URL or Local Upload</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{ flex: '1 1 200px' }}
            />
            <label className="btn btn-outline" style={{ cursor: 'pointer', gap: '6px', whiteSpace: 'nowrap' }}>
              <Upload size={16} />
              <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          {image && (
            <div style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              background: '#FAF6F1',
              borderRadius: '12px',
              border: '1px solid #EADBCC'
            }}>
              <div style={{
                width: '72px',
                height: '54px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#FFFFFF',
                flexShrink: 0
              }}>
                <img
                  src={image}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7A6E63' }}>
                <div style={{ fontWeight: 600, color: '#1E140E' }}>Live Image Preview (4:3 object-fit)</div>
                <div style={{ fontSize: '0.72rem' }}>Centered & responsive crop for customer cards</div>
              </div>
            </div>
          )}
        </div>

        {/* Included Fixed Items Section - Dropdown Select, Delete, Delete All, Responsive */}
        <div className="combo-builder-box">
          <div className="combo-builder-header">
            <div className="combo-builder-title-wrap">
              <div className="combo-builder-title">
                <Database size={16} style={{ color: '#C25E30' }} />
                <span>Included Items in this Combo</span>
                {fixedItems.length > 0 && (
                  <span className="combo-items-badge">{fixedItems.length} items</span>
                )}
              </div>
              <div className="combo-builder-subtitle">
                Select items from catalog and set portion quantities for kitchen prep.
              </div>
            </div>

            <div className="combo-builder-actions">
              {/* Dropdown Catalog Management Buttons */}
              <button
                type="button"
                onClick={() => openAddItemModal()}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  color: '#C25E30',
                  borderColor: '#E2D3C4',
                  background: '#FAF6EE',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Add a new item to the dropdown menu"
              >
                <Plus size={13} />
                <span>Add to Dropdown</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManageItemsModal(true)}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  color: '#6E5C50',
                  borderColor: '#E2D3C4',
                  background: '#FAF6EE',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Delete or manage items in dropdown list"
              >
                <Settings size={13} />
                <span>Manage Dropdown</span>
              </button>

              {fixedItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="combo-delete-all-btn"
                  title="Delete all items from this combo"
                >
                  <Trash2 size={13} />
                  <span>Delete All</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => addFixedItem()}
                className="btn btn-primary btn-sm"
                style={{
                  gap: '5px',
                  fontSize: '0.82rem',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: '#C25E30',
                  borderColor: '#C25E30',
                  fontWeight: 700
                }}
              >
                <Plus size={15} />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Fixed Items List */}
          {fixedItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1.6rem',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1.5px dashed #E2D3C4',
              color: '#8A7E74',
              fontSize: '0.88rem'
            }}>
              No items in this combo yet. Click <strong>"Add Item"</strong> above to choose from your catalog.
            </div>
          ) : (
            <div className="combo-items-list">
              {fixedItems.map((fi, fIdx) => {
                const knownNames = new Set(dbItems.map(it => it.name.trim().toLowerCase()));
                const isKnown = fi.name && knownNames.has(fi.name.trim().toLowerCase());
                const currentItem = dbItems.find(it => it.name.trim().toLowerCase() === (fi.name || '').trim().toLowerCase());
                const currentCat = currentItem ? getItemCategory(currentItem) : null;

                return (
                  <div key={fIdx} className="combo-builder-item-card">
                    {/* Item Dropdown / Custom Name */}
                    <div className="combo-item-name-wrap">
                      {fi.isCustom ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Type custom item name..."
                            value={fi.name}
                            onChange={(e) => updateFixedItem(fIdx, 'name', e.target.value)}
                            style={{
                              height: '42px',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              borderRadius: '10px',
                              borderColor: '#E2D3C4',
                              flex: 1
                            }}
                            autoFocus
                            required
                          />
                          <button
                            type="button"
                            className="combo-custom-toggle-btn"
                            onClick={() => updateFixedItem(fIdx, 'isCustom', false)}
                            title="Switch back to select dropdown"
                          >
                            List
                          </button>
                        </div>
                      ) : (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <select
                            className="form-select combo-item-select"
                            value={fi.name || ''}
                            onChange={(e) => {
                              if (e.target.value === '__add_new__') {
                                openAddItemModal(fIdx);
                              } else if (e.target.value === '__manage__') {
                                setShowManageItemsModal(true);
                              } else {
                                handleSelectItem(fIdx, e.target.value);
                              }
                            }}
                            required
                          >
                            <option value="">-- Choose Item from Catalog --</option>

                            {catalogCategories.length > 0 ? (
                              catalogCategories.map(cat => {
                                const catItems = dbItems.filter(it => it.category === cat);
                                if (catItems.length === 0) return null;
                                return (
                                  <optgroup key={cat} label={cat}>
                                    {catItems.map((it) => (
                                      <option key={it._id || it.name} value={it.name}>
                                        {it.name} (Count: {getItemDefaultQty(it)} nos)
                                      </option>
                                    ))}
                                  </optgroup>
                                );
                              })
                            ) : (
                              dbItems.map((it) => (
                                <option key={it._id || it.name} value={it.name}>
                                  {it.name} (Count: {getItemDefaultQty(it)} nos)
                                </option>
                              ))
                            )}

                            {fi.name && !isKnown && (
                              <optgroup label="Current Custom Item">
                                <option value={fi.name}>{fi.name}</option>
                              </optgroup>
                            )}

                            <optgroup label="⚙️ Custom & Dropdown Management">
                              <option value="__custom__">✏️ Type Custom Item Name...</option>
                              <option value="__add_new__">➕ Add New Item to Dropdown...</option>
                              <option value="__manage__">⚙️ Manage & Delete Dropdown Items...</option>
                            </optgroup>
                          </select>

                          {currentCat && (
                            <span
                              className={`combo-meal-badge ${currentCat.toLowerCase()}`}
                              style={{
                                position: 'absolute',
                                right: '34px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                                fontSize: '0.66rem'
                              }}
                            >
                              {currentCat}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity Stepper: [-] [qty] [+] nos */}
                    <div className="combo-item-qty-wrap" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        className="combo-qty-btn"
                        onClick={() => {
                          const current = parseInt(fi.quantity, 10) || 1;
                          updateFixedItem(fIdx, 'quantity', Math.max(1, current - 1));
                        }}
                        title="Decrease count"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="combo-qty-input"
                        value={fi.quantity}
                        onChange={(e) => updateFixedItem(fIdx, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                        title="Item count in nos (e.g. 3 for Dosa 3 nos)"
                      />
                      <button
                        type="button"
                        className="combo-qty-btn"
                        onClick={() => {
                          const current = parseInt(fi.quantity, 10) || 1;
                          updateFixedItem(fIdx, 'quantity', current + 1);
                        }}
                        title="Increase count"
                      >
                        +
                      </button>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#8A7E74', marginLeft: '2px' }}>
                        nos
                      </span>
                    </div>

                    {/* Notes / Special Instructions */}
                    <div className="combo-item-notes-wrap">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Prep notes (e.g. With coconut chutney & sambar)..."
                        value={fi.notes || ''}
                        onChange={(e) => updateFixedItem(fIdx, 'notes', e.target.value)}
                        style={{
                          width: '100%',
                          fontSize: '0.85rem',
                          height: '42px',
                          borderRadius: '10px',
                          borderColor: '#E2D3C4'
                        }}
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeFixedItem(fIdx)}
                      className="combo-item-delete-btn"
                      title="Delete item from combo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}

              {/* Add another item & Total meal items preview bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => addFixedItem()}
                  className="combo-add-more-btn"
                >
                  <Plus size={14} />
                  <span>Add Another Item</span>
                </button>

                {fixedItems.some(f => f.name) && (
                  <div className="combo-summary-preview" style={{ margin: 0 }}>
                    <span style={{ fontWeight: 800, color: '#C25E30' }}>Combo Breakdown:</span>
                    {fixedItems.filter(f => f.name).map((f, i) => (
                      <span key={i} style={{ background: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #EADBCC', fontWeight: 700, fontSize: '0.78rem' }}>
                        {f.quantity}× {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Sub-Modal: Add New Item to Dropdown List with Meal Tag */}
      <Modal
        isOpen={showAddItemModal}
        onClose={() => { setShowAddItemModal(false); setActiveRowIdx(null); }}
        title="Add New Item to Catalog"
        maxWidth="460px"
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => { setShowAddItemModal(false); setActiveRowIdx(null); }}
              disabled={savingNewItem}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAddNewItemToCatalog}
              disabled={savingNewItem || !newItemName.trim()}
              style={{ background: '#C25E30', borderColor: '#C25E30', fontWeight: 700 }}
            >
              {savingNewItem ? 'Saving...' : 'Save to Dropdown'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddNewItemToCatalog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 800, color: '#2D1A10', marginBottom: '6px' }}>
              Item Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dosa, Chapathi, Idli, Steamed Rice..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Category</label>
              <input
                type="text"
                list="combo-form-categories-list"
                className="form-input"
                placeholder="e.g. Breakfast, Lunch, Tea, Dinner..."
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
              />
              <datalist id="combo-form-categories-list">
                <option value="Breakfast" />
                <option value="Lunch" />
                <option value="Tea & Snacks" />
                <option value="Dinner" />
                {catalogCategories.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 800, color: '#2D1A10', marginBottom: '6px' }}>
                Item Count (nos) *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  placeholder="e.g. 3"
                  required
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6E5C50' }}>nos</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#8A7E74', marginTop: '3px', display: 'block' }}>
                e.g. Dosa 3 nos, Idli 3 nos, Chapathi 3 nos
              </span>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="form-label">Default Prep Notes (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Served with chutney & sambar"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '0.78rem', color: '#7A6E63', background: '#FAF6EE', padding: '8px 12px', borderRadius: '8px', border: '1px solid #EADBCC' }}>
            💡 This item will be saved with count <strong>{newItemQty} nos</strong>{newItemCategory ? ` under ${newItemCategory}` : ''}.
          </div>
        </form>
      </Modal>

      {/* Sub-Modal: Manage & Delete Items in Dropdown */}
      <Modal
        isOpen={showManageItemsModal}
        onClose={() => { setShowManageItemsModal(false); setItemsSearchFilter(''); setManageCategoryFilter('All'); }}
        title="Manage Dropdown Catalog Items"
        maxWidth="520px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#7A6E63' }}>
                {dbItems.length} items in catalog
              </span>
              {dbItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllCatalogItems}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2', fontSize: '0.72rem', padding: '2px 8px' }}
                  title="Clear all catalog items"
                >
                  Clear All Items
                </button>
              )}
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => { setShowManageItemsModal(false); setItemsSearchFilter(''); }}
              style={{ background: '#C25E30', borderColor: '#C25E30', fontWeight: 700 }}
            >
              Done
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Quick search input */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9E8E82' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search items by name..."
              value={itemsSearchFilter}
              onChange={(e) => setItemsSearchFilter(e.target.value)}
              style={{ paddingLeft: '34px', height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}
            />
            {itemsSearchFilter && (
              <button
                type="button"
                onClick={() => setItemsSearchFilter('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9E8E82' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* List of items with meal badges & delete button */}
          <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
            {dbItems
              .filter(it => it.name.toLowerCase().includes(itemsSearchFilter.toLowerCase()))
              .map((it) => {
                const cat = getItemCategory(it);
                const qty = getItemDefaultQty(it);
                return (
                  <div
                    key={it._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#FFFFFF',
                      border: '1px solid #EADBCC',
                      borderRadius: '8px',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: it.isVeg ? '#16A34A' : '#DC2626',
                          flexShrink: 0
                        }}
                        title={it.isVeg ? 'Veg' : 'Non-Veg'}
                      />
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1E140E' }}>
                        {it.name}
                      </span>
                      <span className={`combo-meal-badge ${cat.toLowerCase()}`}>
                        {cat}
                      </span>
                      <span style={{ fontSize: '0.74rem', background: '#F0E5D8', color: '#C25E30', padding: '1px 7px', borderRadius: '4px', fontWeight: 700 }}>
                        {qty} nos
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteItemFromCatalog(it._id, it.name)}
                      disabled={deletingItemId === it._id}
                      className="combo-item-delete-btn"
                      style={{ width: '30px', height: '30px' }}
                      title={`Delete "${it.name}" from dropdown list`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            {dbItems.filter(it => it.name.toLowerCase().includes(itemsSearchFilter.toLowerCase())).length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#8A7E74', fontSize: '0.85rem' }}>
                {itemsSearchFilter ? 'No matching items found for this search.' : 'No items in catalog yet.'}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => { setShowManageItemsModal(false); openAddItemModal(); }}
            className="combo-add-more-btn"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Plus size={14} />
            <span>Add Another New Item to Dropdown</span>
          </button>
        </div>
      </Modal>
    </Modal>
  );
};
