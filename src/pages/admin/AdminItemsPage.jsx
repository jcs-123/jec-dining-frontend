import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ItemModal } from '../../components/admin/ItemModal';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Package,
  UtensilsCrossed,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminItemsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, combosRes] = await Promise.allSettled([
        api.get('/items/admin'),
        api.get('/combos/admin/list')
      ]);

      if (itemsRes.status === 'fulfilled' && itemsRes.value?.success) {
        setItems(itemsRes.value.items || []);
      }
      if (combosRes.status === 'fulfilled' && combosRes.value?.success) {
        setCombos(combosRes.value.combos || []);
      }
    } catch (err) {
      console.error('Failed to load items catalog:', err);
      toast.showError('Could not load menu items');
    } finally {
      setLoading(false);
    }
  };

  // Calculate combo usage per item name
  const itemComboUsageMap = useMemo(() => {
    const map = {};
    for (const combo of combos) {
      if (Array.isArray(combo.fixedItems)) {
        for (const fi of combo.fixedItems) {
          const nameLower = (fi.name || '').trim().toLowerCase();
          if (nameLower) {
            if (!map[nameLower]) map[nameLower] = [];
            map[nameLower].push(combo.name);
          }
        }
      }
    }
    return map;
  }, [combos]);

  // Unique categories list
  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    items.forEach(it => {
      if (it.category) cats.add(it.category);
    });
    return Array.from(cats);
  }, [items]);

  // Filtering
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      // Search text
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = (it.name || '').toLowerCase().includes(q);
        const matchCat = (it.category || '').toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && it.category !== categoryFilter) return false;

      return true;
    });
  }, [items, search, categoryFilter]);

  const handleDelete = async (item) => {
    const usedIn = itemComboUsageMap[(item.name || '').toLowerCase()] || [];
    const warningMsg = usedIn.length > 0
      ? `This item is currently used in ${usedIn.length} combo(s) (${usedIn.join(', ')}). Deleting it will remove it from the dropdown list. Proceed?`
      : `Are you sure you want to delete "${item.name}" from the catalog?`;

    if (!window.confirm(warningMsg)) return;

    try {
      setDeletingId(item._id);
      const res = await api.delete(`/items/admin/${item._id}`);
      if (res.success) {
        toast.showSuccess(`Item "${item.name}" deleted successfully`);
        setItems(prev => prev.filter(it => it._id !== item._id));
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const totalVeg = items.filter(it => it.isVeg).length;
  const totalNonVeg = items.filter(it => !it.isVeg).length;

  return (
    <div>
      <AdminHeader
        title="Menu Items Catalog"
        subtitle={`Constituent kitchen items, sides, and ingredients for ${user?.cafe?.name || 'JECCAFE'}`}
        actions={
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#C25E30',
              borderColor: '#C25E30'
            }}
          >
            <Plus size={16} />
            <span>Add New Item</span>
          </button>
        }
      />

      <div className="admin-content-body">
        {/* KPI Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '1.25rem'
        }}>
          <div className="card" style={{ padding: '14px 18px', background: '#FFFFFF', border: '1px solid #EADBCC', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.74rem', color: '#7A6E63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Catalog Items
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1E140E', marginTop: '4px' }}>
              {items.length}
            </div>
          </div>

          <div className="card" style={{ padding: '14px 18px', background: '#FFFFFF', border: '1px solid #EADBCC', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pure Vegetarian
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
              {totalVeg}
            </div>
          </div>

          <div className="card" style={{ padding: '14px 18px', background: '#FFFFFF', border: '1px solid #EADBCC', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.74rem', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Non-Vegetarian
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#B91C1C', marginTop: '4px' }}>
              {totalNonVeg}
            </div>
          </div>

          <div className="card" style={{ padding: '14px 18px', background: '#FFFFFF', border: '1px solid #EADBCC', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.74rem', color: '#C25E30', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Item Categories
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#C25E30', marginTop: '4px' }}>
              {uniqueCategories.length}
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card" style={{ padding: '14px 18px', background: '#FFFFFF', border: '1px solid #EADBCC', borderRadius: '14px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search input */}
            <div style={{ flex: '1 1 240px', position: 'relative', minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9E8E82' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by item name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '36px', height: '40px', borderRadius: '10px', fontSize: '0.85rem' }}
              />
            </div>


            {/* Category Filter */}
            <div style={{ flex: '0 1 180px', minWidth: '150px' }}>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ height: '40px', borderRadius: '10px', fontSize: '0.84rem' }}
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Table / Cards Card */}
        <div className="card" style={{ background: '#FFFFFF', border: '1.5px solid #EADBCC', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0E6DC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E140E' }}>
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </span>
            <span style={{ fontSize: '0.78rem', color: '#7A6E63' }}>
              Synced with Combo Form dropdown
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7A6E63' }}>
              Loading menu items...
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7A6E63' }}>
              <Package size={36} style={{ color: '#C25E30', margin: '0 auto 10px', display: 'block', opacity: 0.6 }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E140E' }}>No items found</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                {search ? 'Try clearing your search query' : 'Click "Add New Item" to create your first catalog item'}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="combos-data-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Count (nos)</th>
                    <th>Used In Combos</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => {
                    const usage = itemComboUsageMap[(item.name || '').toLowerCase()] || [];

                    return (
                      <tr key={item._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                background: item.isVeg ? '#16A34A' : '#DC2626',
                                flexShrink: 0
                              }}
                              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                            />
                            <span style={{ fontWeight: 700, color: '#1E140E', fontSize: '0.92rem' }}>
                              {item.name}
                            </span>
                          </div>
                          {item.defaultNotes && (
                            <div style={{ fontSize: '0.74rem', color: '#8A7E74', marginTop: '2px', paddingLeft: '17px' }}>
                              Notes: {item.defaultNotes}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="combo-cat-badge">
                            {item.category || 'General'}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontWeight: 700,
                            color: '#C25E30',
                            background: '#FDF5EE',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            border: '1px solid #F0D9C8'
                          }}>
                            <span>{item.defaultQty || 1}</span>
                            <span style={{ fontSize: '0.72rem', color: '#8A7E74' }}>nos</span>
                          </span>
                        </td>
                        <td>
                          {usage.length > 0 ? (
                            <span style={{
                              background: '#FDF4EB',
                              border: '1px solid #F3DAC5',
                              color: '#A84B22',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 700
                            }} title={usage.join(', ')}>
                              {usage.length} {usage.length === 1 ? 'combo' : 'combos'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.76rem', color: '#9E8E82' }}>
                              Not in combos yet
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              }}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.76rem', gap: '4px' }}
                              title="Edit item details"
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item._id}
                              className="combo-item-delete-btn"
                              style={{ width: '32px', height: '32px' }}
                              title="Delete item permanently"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Item Modal (Add / Edit) */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSaved={loadData}
        existingCategories={uniqueCategories}
      />
    </div>
  );
};
