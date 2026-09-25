import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Upload, Store, Database, Settings, Search, X } from 'lucide-react';

const MEAL_CATEGORIES = [
  { id: 'All', label: 'All Items', icon: '🌟', badgeClass: 'all' },
  { id: 'Breakfast', label: 'Breakfast', icon: '🌅', badgeClass: 'breakfast', hint: 'Dosa (3), Idli (3), Vada (2), Poori (3)...' },
  { id: 'Lunch', label: 'Lunch', icon: '🍛', badgeClass: 'lunch', hint: 'Thali Meals, Steamed Rice, Biryani, Curries...' },
  { id: 'Tea', label: 'Tea & Snacks', icon: '☕', badgeClass: 'tea', hint: 'Filter Coffee, Tea, Samosa (2), Puffs...' },
  { id: 'Dinner', label: 'Dinner', icon: '🌙', badgeClass: 'dinner', hint: 'Chapathi (3), Butter Naan, Fried Rice, Paneer...' }
];

const detectMealCategory = (name) => {
  const n = (name || '').toLowerCase();
  if (/dosa|idli|vada|poori|puri|pongal|upma|puttu|appam|oats|poha|omelette/i.test(n)) return 'Breakfast';
  if (/meals|thali|steamed rice|curd rice|sambar rice|lemon rice|biryani|chicken curry|fish curry|dal fry|lunch/i.test(n)) return 'Lunch';
  if (/tea|chai|coffee|samosa|puff|cutlet|bajji|pakoda|vada pav|snack|cookie|biscuit|cake|roll|fries|nachos|churros|drink|juice|shake|mocktail/i.test(n)) return 'Tea';
  if (/chapathi|chapati|phulka|roti|naan|paneer|manchurian|noodles|fried rice|gravy|kothu|dinner/i.test(n)) return 'Dinner';
  return 'Breakfast';
};

const getItemCategory = (it) => {
  if (it?.category && it.category !== 'General' && it.category !== 'Kitchen Essentials' && it.category !== 'Meal Component') {
    return it.category;
  }
  return detectMealCategory(it?.name);
};

const getItemDefaultQty = (it) => {
  if (it?.defaultQty && it.defaultQty > 0) return it.defaultQty;
  const n = (it?.name || '').toLowerCase();
  if (/dosa|idli|poori|chapathi|chapati/i.test(n)) return 3;
  if (/vada|samosa|naan|parotta/i.test(n)) return 2;
  return 1;
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

  // Meal category filter tab in item builder
  const [selectedMealFilter, setSelectedMealFilter] = useState('All');
  const [manageCategoryFilter, setManageCategoryFilter] = useState('All');

  // Dropdown items management state
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showManageItemsModal, setShowManageItemsModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Breakfast');
  const [newItemQty, setNewItemQty] = useState(3);
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);
  const [savingNewItem, setSavingNewItem] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [itemsSearchFilter, setItemsSearchFilter] = useState('');
  const [activeRowIdx, setActiveRowIdx] = useState(null);

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
    setSelectedMealFilter('All');
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
      setSelectedMealFilter('All');
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
      quantity: (updated[fIdx].quantity === 1 || !updated[fIdx].quantity) ? autoQty : updated[fIdx].quantity,
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
        category: newItemCategory,
        defaultQty: parseInt(newItemQty, 10) || 1,
        isVeg: newItemIsVeg,
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
        setNewItemQty(3);
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

  const breakfastItems = dbItems.filter(it => getItemCategory(it) === 'Breakfast');
  const lunchItems = dbItems.filter(it => getItemCategory(it) === 'Lunch');
  const teaItems = dbItems.filter(it => getItemCategory(it) === 'Tea');
  const dinnerItems = dbItems.filter(it => getItemCategory(it) === 'Dinner');
  const otherItems = dbItems.filter(it => !['Breakfast', 'Lunch', 'Tea', 'Dinner'].includes(getItemCategory(it)));

  const quickItems = selectedMealFilter === 'All'
    ? dbItems.slice(0, 18)
    : dbItems.filter(it => getItemCategory(it) === selectedMealFilter);

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
                onClick={() => { setActiveRowIdx(null); setShowAddItemModal(true); }}
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

          {/* Meal Category Filter Pills (Separate Tags: Breakfast, Lunch, Tea, Dinner) */}
          <div className="combo-meal-filter-bar">
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
              Meal Tags:
            </span>
            {MEAL_CATEGORIES.map(cat => {
              const count = cat.id === 'All'
                ? dbItems.length
                : dbItems.filter(it => getItemCategory(it) === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`combo-meal-tag-pill ${selectedMealFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedMealFilter(cat.id)}
                  title={cat.hint || cat.label}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span style={{ opacity: 0.75, fontSize: '0.72rem', fontWeight: 800 }}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Select Preset Portion Chips (e.g. Dosa 3, Idli 3, Vada 2...) */}
          {quickItems.length > 0 && (
            <div className="combo-quick-add-section">
              <div className="combo-quick-add-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>⚡ Quick Add to Combo</span>
                  <span style={{ color: '#C25E30', fontWeight: 800 }}>
                    ({selectedMealFilter === 'All' ? 'All Catalog Items' : `${selectedMealFilter} Selection`}):
                  </span>
                </span>
                <span style={{ fontSize: '0.7rem', color: '#8C7B6E', fontWeight: 600, textTransform: 'none' }}>
                  Click to add with pre-configured portions (e.g. Dosa 3, Idli 3)
                </span>
              </div>
              <div className="combo-quick-add-chips">
                {quickItems.map((it) => {
                  const qty = getItemDefaultQty(it);
                  const cat = getItemCategory(it);
                  return (
                    <button
                      key={it._id || it.name}
                      type="button"
                      className="combo-quick-add-btn"
                      onClick={() => addFixedItem(it.name, qty, it.defaultNotes)}
                      title={`Click to add ${it.name} (${qty} portions) to combo`}
                    >
                      <Plus size={13} color="#C25E30" strokeWidth={2.5} />
                      <span style={{ fontWeight: 700 }}>{it.name}</span>
                      <span className="qty-tag">×{qty}</span>
                      <span className={`combo-meal-badge ${cat.toLowerCase()}`} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                        {cat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fixed Items List */}
          {fixedItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1.4rem',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1.5px dashed #E2D3C4',
              color: '#8A7E74',
              fontSize: '0.86rem'
            }}>
              No items in this combo yet. Click any <strong>Quick Add chip above (e.g. Dosa ×3, Idli ×3)</strong> or click <strong>"Add Item"</strong> to choose from catalog.
            </div>
          ) : (
            <div className="combo-items-list">
              {fixedItems.map((fi, fIdx) => {
                const knownNames = new Set(dbItems.map(it => it.name.trim().toLowerCase()));
                const isKnown = fi.name && knownNames.has(fi.name.trim().toLowerCase());
                const currentItem = dbItems.find(it => it.name.trim().toLowerCase() === (fi.name || '').trim().toLowerCase());
                const currentCat = currentItem ? getItemCategory(currentItem) : (fi.name ? detectMealCategory(fi.name) : null);

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
                                setActiveRowIdx(fIdx);
                                setShowAddItemModal(true);
                              } else if (e.target.value === '__manage__') {
                                setShowManageItemsModal(true);
                              } else {
                                handleSelectItem(fIdx, e.target.value);
                              }
                            }}
                            required
                          >
                            <option value="">-- Select Item (Grouped by Meal Tag) --</option>

                            {breakfastItems.length > 0 && (
                              <optgroup label="🌅 Breakfast (Dosa, Idli, Vada, Poori...)">
                                {breakfastItems.map((it) => (
                                  <option key={it._id || it.name} value={it.name}>
                                    {it.name} {getItemDefaultQty(it) > 1 ? `(Portion: ${getItemDefaultQty(it)})` : ''}
                                  </option>
                                ))}
                              </optgroup>
                            )}

                            {lunchItems.length > 0 && (
                              <optgroup label="🍛 Lunch (Thali Meals, Rice, Biryani, Curries...)">
                                {lunchItems.map((it) => (
                                  <option key={it._id || it.name} value={it.name}>
                                    {it.name} {getItemDefaultQty(it) > 1 ? `(Portion: ${getItemDefaultQty(it)})` : ''}
                                  </option>
                                ))}
                              </optgroup>
                            )}

                            {teaItems.length > 0 && (
                              <optgroup label="☕ Tea & Snacks (Coffee, Tea, Samosa, Puffs...)">
                                {teaItems.map((it) => (
                                  <option key={it._id || it.name} value={it.name}>
                                    {it.name} {getItemDefaultQty(it) > 1 ? `(Portion: ${getItemDefaultQty(it)})` : ''}
                                  </option>
                                ))}
                              </optgroup>
                            )}

                            {dinnerItems.length > 0 && (
                              <optgroup label="🌙 Dinner (Chapathi, Naan, Fried Rice, Paneer...)">
                                {dinnerItems.map((it) => (
                                  <option key={it._id || it.name} value={it.name}>
                                    {it.name} {getItemDefaultQty(it) > 1 ? `(Portion: ${getItemDefaultQty(it)})` : ''}
                                  </option>
                                ))}
                              </optgroup>
                            )}

                            {otherItems.length > 0 && (
                              <optgroup label="🍽️ General Items">
                                {otherItems.map((it) => (
                                  <option key={it._id || it.name} value={it.name}>
                                    {it.name}
                                  </option>
                                ))}
                              </optgroup>
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

                    {/* Quantity Stepper: [-] [qty] [+] */}
                    <div className="combo-item-qty-wrap">
                      <button
                        type="button"
                        className="combo-qty-btn"
                        onClick={() => {
                          const current = parseInt(fi.quantity, 10) || 1;
                          updateFixedItem(fIdx, 'quantity', Math.max(1, current - 1));
                        }}
                        title="Decrease portion quantity"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="combo-qty-input"
                        value={fi.quantity}
                        onChange={(e) => updateFixedItem(fIdx, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                        title="Portion quantity (e.g. 3 for 3 dosas or 3 idlis)"
                      />
                      <button
                        type="button"
                        className="combo-qty-btn"
                        onClick={() => {
                          const current = parseInt(fi.quantity, 10) || 1;
                          updateFixedItem(fIdx, 'quantity', current + 1);
                        }}
                        title="Increase portion quantity"
                      >
                        +
                      </button>
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
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dosa, Idli, Medu Vada, Paneer Butter Masala..."
              value={newItemName}
              onChange={(e) => {
                const val = e.target.value;
                setNewItemName(val);
                const detected = detectMealCategory(val);
                if (detected) setNewItemCategory(detected);
              }}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="form-label">Meal Type Tag *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '4px' }}>
              {[
                { id: 'Breakfast', label: '🌅 Breakfast', hint: 'Morning (Dosa, Idli, Vada, Poori)' },
                { id: 'Lunch', label: '🍛 Lunch', hint: 'Afternoon (Thali, Rice, Biryani)' },
                { id: 'Tea', label: '☕ Tea & Snacks', hint: 'Evening (Coffee, Tea, Samosa, Puffs)' },
                { id: 'Dinner', label: '🌙 Dinner', hint: 'Night (Chapathi, Naan, Paneer)' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setNewItemCategory(m.id);
                    if (m.id === 'Breakfast' && newItemQty === 1) setNewItemQty(3);
                    if (m.id === 'Dinner' && newItemQty === 1) setNewItemQty(3);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: newItemCategory === m.id ? '2px solid #C25E30' : '1px solid #E2D3C4',
                    background: newItemCategory === m.id ? '#FDF5EE' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: newItemCategory === m.id ? '#C25E30' : '#2D1A10' }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#8A7E74' }}>{m.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-form-grid-2">
            <div>
              <label className="form-label">Default Portion / Qty</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={newItemQty}
                onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                placeholder="e.g. 3 for Dosa or Idli"
                required
              />
            </div>

            <div>
              <label className="form-label">Dietary Preference</label>
              <select
                className="form-select"
                value={newItemIsVeg ? 'veg' : 'nonveg'}
                onChange={(e) => setNewItemIsVeg(e.target.value === 'veg')}
              >
                <option value="veg">Vegetarian (Pure Veg)</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

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
            💡 This item will be tagged under <strong>{newItemCategory}</strong> with a default portion of <strong>{newItemQty}</strong>.
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.8rem', color: '#7A6E63' }}>
              {dbItems.length} items in catalog
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => { setShowManageItemsModal(false); setItemsSearchFilter(''); setManageCategoryFilter('All'); }}
              style={{ background: '#C25E30', borderColor: '#C25E30', fontWeight: 700 }}
            >
              Done
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Meal Tag Filter Pills in Manage Modal */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {MEAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`combo-meal-tag-pill ${manageCategoryFilter === cat.id ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                onClick={() => setManageCategoryFilter(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

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
              .filter(it => manageCategoryFilter === 'All' || getItemCategory(it) === manageCategoryFilter)
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
                      {qty > 1 && (
                        <span style={{ fontSize: '0.72rem', background: '#F0E5D8', color: '#C25E30', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          ×{qty}
                        </span>
                      )}
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
            {dbItems
              .filter(it => manageCategoryFilter === 'All' || getItemCategory(it) === manageCategoryFilter)
              .filter(it => it.name.toLowerCase().includes(itemsSearchFilter.toLowerCase())).length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#8A7E74', fontSize: '0.85rem' }}>
                No matching items found for {manageCategoryFilter === 'All' ? 'this search' : manageCategoryFilter}.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => { setShowManageItemsModal(false); setShowAddItemModal(true); }}
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
