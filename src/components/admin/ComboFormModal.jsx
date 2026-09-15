import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Upload, AlertCircle } from 'lucide-react';

export const ComboFormModal = ({ isOpen, onClose, combo, categories, onSaved }) => {
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [basePriceRupees, setBasePriceRupees] = useState('');
  const [offerPriceRupees, setOfferPriceRupees] = useState('');
  const [availableStock, setAvailableStock] = useState(50);
  const [isConfigurable, setIsConfigurable] = useState(false);
  const [fixedItems, setFixedItems] = useState([]);
  const [customizationGroups, setCustomizationGroups] = useState([]);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (combo) {
      setCategoryId(combo.categoryId?._id || combo.categoryId || '');
      setName(combo.name || '');
      setDescription(combo.description || '');
      setImage(combo.image || '');
      setIsVeg(combo.isVeg !== undefined ? combo.isVeg : true);
      setBasePriceRupees(combo.basePricePaise ? (combo.basePricePaise / 100).toString() : '');
      setOfferPriceRupees(combo.offerPricePaise ? (combo.offerPricePaise / 100).toString() : '');
      setAvailableStock(combo.availableStock !== undefined ? combo.availableStock : 50);
      setIsConfigurable(!!combo.isConfigurable);
      setFixedItems(combo.fixedItems || []);
      setCustomizationGroups(
        (combo.customizationGroups || []).map(g => ({
          ...g,
          options: (g.options || []).map(o => ({
            ...o,
            extraPriceRupees: o.extraPricePaise ? (o.extraPricePaise / 100).toString() : '0'
          }))
        }))
      );
      setDisplayOrder(combo.displayOrder || 0);
    } else {
      setCategoryId(categories.length > 0 ? categories[0]._id : '');
      setName('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      setIsVeg(true);
      setBasePriceRupees('199');
      setOfferPriceRupees('');
      setAvailableStock(50);
      setIsConfigurable(false);
      setFixedItems([{ name: 'Standard Beverage / Side', quantity: 1, notes: '' }]);
      setCustomizationGroups([]);
      setDisplayOrder(0);
    }
  }, [combo, categories, isOpen]);

  // Image file upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/combos/admin/upload-image', formData);
      if (res.success && res.imageUrl) {
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
    setFixedItems([...fixedItems, { name: '', quantity: 1, notes: '' }]);
  };

  const updateFixedItem = (idx, field, val) => {
    const updated = [...fixedItems];
    updated[idx][field] = val;
    setFixedItems(updated);
  };

  const removeFixedItem = (idx) => {
    setFixedItems(fixedItems.filter((_, i) => i !== idx));
  };

  // Customization group helpers
  const addCustomizationGroup = () => {
    setCustomizationGroups([
      ...customizationGroups,
      {
        groupName: 'Choose Your Option',
        minSelect: 1,
        maxSelect: 1,
        options: [
          { name: 'Standard Selection', extraPriceRupees: '0', isDefault: true, isVeg: true }
        ]
      }
    ]);
  };

  const removeCustomizationGroup = (gIdx) => {
    setCustomizationGroups(customizationGroups.filter((_, i) => i !== gIdx));
  };

  const addOptionToGroup = (gIdx) => {
    const updated = [...customizationGroups];
    updated[gIdx].options.push({
      name: '',
      extraPriceRupees: '0',
      isDefault: false,
      isVeg: true
    });
    setCustomizationGroups(updated);
  };

  const removeOptionFromGroup = (gIdx, oIdx) => {
    const updated = [...customizationGroups];
    updated[gIdx].options = updated[gIdx].options.filter((_, i) => i !== oIdx);
    setCustomizationGroups(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const basePaise = Math.round(parseFloat(basePriceRupees) * 100);
    const offerPaise = offerPriceRupees ? Math.round(parseFloat(offerPriceRupees) * 100) : null;

    if (isNaN(basePaise) || basePaise < 0) {
      toast.error('Please enter a valid base price in INR');
      return;
    }

    if (offerPaise !== null && offerPaise > basePaise) {
      toast.error('Offer price cannot be greater than regular base price');
      return;
    }

    const payload = {
      categoryId,
      name: name.trim(),
      description: description.trim(),
      image,
      isVeg,
      basePricePaise: basePaise,
      offerPricePaise: offerPaise,
      availableStock: parseInt(availableStock, 10),
      isConfigurable,
      fixedItems,
      customizationGroups: customizationGroups.map(g => ({
        groupName: g.groupName,
        minSelect: parseInt(g.minSelect, 10) || 1,
        maxSelect: parseInt(g.maxSelect, 10) || 1,
        options: g.options.map(o => ({
          name: o.name,
          extraPricePaise: Math.round(parseFloat(o.extraPriceRupees || 0) * 100),
          isDefault: !!o.isDefault,
          isVeg: !!o.isVeg
        }))
      })),
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
      title={combo ? `Edit Combo: ${combo.name}` : 'Create New Combo'}
      maxWidth="720px"
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
        {/* Basic Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Combo Name *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Sourdough & Flat White Duo"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
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

        {/* Pricing & Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Base Price (INR) *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={basePriceRupees}
              onChange={(e) => setBasePriceRupees(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Offer Price (INR)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={offerPriceRupees}
              onChange={(e) => setOfferPriceRupees(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              className="form-input"
              value={availableStock}
              onChange={(e) => setAvailableStock(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dietary</label>
            <select
              className="form-select"
              value={isVeg ? 'veg' : 'nonveg'}
              onChange={(e) => setIsVeg(e.target.value === 'veg')}
            >
              <option value="veg">🟢 Vegetarian</option>
              <option value="nonveg">🔴 Non-Vegetarian</option>
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

        {/* Fixed Items Section */}
        <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Included Fixed Items</label>
            <button type="button" onClick={addFixedItem} className="btn btn-outline btn-sm" style={{ gap: '4px' }}>
              <Plus size={13} />
              <span>Add Fixed Item</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {fixedItems.map((fi, fIdx) => (
              <div key={fIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Item name (e.g. Sourdough Toast)"
                  value={fi.name}
                  onChange={(e) => updateFixedItem(fIdx, 'name', e.target.value)}
                  style={{ flex: 2 }}
                />
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Qty"
                  value={fi.quantity}
                  onChange={(e) => updateFixedItem(fIdx, 'quantity', parseInt(e.target.value, 10) || 1)}
                  style={{ width: '70px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Notes (optional)"
                  value={fi.notes}
                  onChange={(e) => updateFixedItem(fIdx, 'notes', e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeFixedItem(fIdx)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#DC2626' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Configurable Choices Section */}
        <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={isConfigurable}
                  onChange={(e) => setIsConfigurable(e.target.checked)}
                />
                <span>Enable Customer Choices (Configurable Combo)</span>
              </label>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Allows customers to pick their drink, sauce, or patty during ordering.
              </div>
            </div>

            {isConfigurable && (
              <button type="button" onClick={addCustomizationGroup} className="btn btn-outline btn-sm" style={{ gap: '4px' }}>
                <Plus size={13} />
                <span>Add Choice Group</span>
              </button>
            )}
          </div>

          {isConfigurable && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
              {customizationGroups.map((g, gIdx) => (
                <div key={gIdx} style={{
                  background: 'var(--bg-surface-subtle)',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={g.groupName}
                      onChange={(e) => {
                        const upd = [...customizationGroups];
                        upd[gIdx].groupName = e.target.value;
                        setCustomizationGroups(upd);
                      }}
                      placeholder="Group Title (e.g. Choose Beverage)"
                      style={{ flex: 1, fontWeight: 700 }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                      <span>Min:</span>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        style={{ width: '55px', padding: '4px 6px' }}
                        value={g.minSelect}
                        onChange={(e) => {
                          const upd = [...customizationGroups];
                          upd[gIdx].minSelect = parseInt(e.target.value, 10) || 0;
                          setCustomizationGroups(upd);
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                      <span>Max:</span>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        style={{ width: '55px', padding: '4px 6px' }}
                        value={g.maxSelect}
                        onChange={(e) => {
                          const upd = [...customizationGroups];
                          upd[gIdx].maxSelect = parseInt(e.target.value, 10) || 1;
                          setCustomizationGroups(upd);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomizationGroup(gIdx)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#DC2626' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px' }}>
                    {g.options.map((opt, oIdx) => (
                      <div key={oIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Option Name (e.g. Vietnamese Cold Brew)"
                          value={opt.name}
                          onChange={(e) => {
                            const upd = [...customizationGroups];
                            upd[gIdx].options[oIdx].name = e.target.value;
                            setCustomizationGroups(upd);
                          }}
                          style={{ flex: 2 }}
                        />
                        <input
                          type="number"
                          step="0.01"
                          className="form-input"
                          placeholder="Extra INR"
                          value={opt.extraPriceRupees}
                          onChange={(e) => {
                            const upd = [...customizationGroups];
                            upd[gIdx].options[oIdx].extraPriceRupees = e.target.value;
                            setCustomizationGroups(upd);
                          }}
                          style={{ width: '90px' }}
                        />
                        <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={opt.isDefault}
                            onChange={(e) => {
                              const upd = [...customizationGroups];
                              upd[gIdx].options[oIdx].isDefault = e.target.checked;
                              setCustomizationGroups(upd);
                            }}
                          />
                          <span>Default</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeOptionFromGroup(gIdx, oIdx)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#DC2626', padding: '4px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOptionToGroup(gIdx)}
                      className="btn btn-ghost btn-sm"
                      style={{ alignSelf: 'flex-start', fontSize: '0.75rem', color: 'var(--brand-accent)' }}
                    >
                      + Add Option Choice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
