import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ComboFormModal } from '../../components/admin/ComboFormModal';
import {
  Plus,
  Edit3,
  Archive,
  EyeOff,
  Eye,
  Search,
  Sliders,
  Lock,
  Trash2,
  UtensilsCrossed
} from 'lucide-react';

export const AdminCombosPage = () => {
  const { user } = useAuth();
  const [combos, setCombos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'sold_out', 'archived'

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadCatalog();
  }, [statusFilter]);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const [comboRes, catRes] = await Promise.all([
        api.get(`/combos/admin/list?${params.toString()}`),
        api.get('/categories/admin')
      ]);

      if (comboRes.success) setCombos(comboRes.combos || []);
      if (catRes.success) setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSoldOut = async (comboId) => {
    try {
      const res = await api.patch(`/combos/admin/${comboId}/toggle-sold-out`);
      if (res.success) {
        toast.showSuccess(res.message || 'Combo stock status updated');
        loadCatalog();
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to toggle stock status');
    }
  };

  const handleToggleArchive = async (comboId) => {
    if (!window.confirm('Are you sure you want to delete or archive this combo?')) return;
    try {
      const res = await api.patch(`/combos/admin/${comboId}/toggle-archive`);
      if (res.success) {
        toast.showSuccess(res.message || 'Combo archived');
        loadCatalog();
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to toggle archive');
    }
  };

  // Filtered combos based on live search
  const filteredCombos = combos.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.categoryId?.name?.toLowerCase().includes(q)
    );
  });

  // Calculate quick stats
  const activeCount = combos.filter((c) => !c.isSoldOut && !c.isArchived).length;
  const soldOutCount = combos.filter((c) => c.isSoldOut && !c.isArchived).length;

  return (
    <div>
      <AdminHeader
        title="Combo Menu Management"
        subtitle={`Configure and manage combos exclusively for ${user?.cafe?.name || 'JECCAFE'}`}
        actions={
          <button
            onClick={() => {
              setEditingCombo(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{
              gap: '6px',
              background: '#C25E30',
              borderColor: '#C25E30',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '10px'
            }}
          >
            <Plus size={16} />
            <span>Add Combo to {user?.cafe?.name || 'Café'}</span>
          </button>
        }
      />

      <div className="admin-page-container">
        {/* 1. Filter Toolbar matching Mockup */}
        <div className="combos-toolbar-card">
          {/* Search bar */}
          <div className="combos-search-wrap">
            <Search size={16} className="combos-search-icon" />
            <input
              type="text"
              className="combos-search-input"
              placeholder="Search combos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadCatalog()}
            />
          </div>

          {/* Counts & Status Filter Select */}
          <div className="combos-toolbar-right">
            <div className="combos-counts-summary">
              <span className="combos-count-stat">{combos.length} combos</span>
              <span className="combos-count-sep">•</span>
              <span className="combos-count-stat" style={{ color: '#15803D' }}>
                <span className="dot-indicator success" />
                {activeCount} active
              </span>
              <span className="combos-count-sep">•</span>
              <span className="combos-count-stat" style={{ color: '#D97706' }}>
                <span className="dot-indicator warning" />
                {soldOutCount} sold out
              </span>
            </div>

            <select
              className="combos-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Combos</option>
              <option value="active">Active Only</option>
              <option value="sold_out">Sold Out Only</option>
              <option value="archived">Archived Only</option>
            </select>
          </div>
        </div>

        {/* 2. Main Combos Content */}
        {loading ? (
          <div className="combos-table-card" style={{ padding: '3.5rem', textAlign: 'center', color: '#7A6E63' }}>
            Loading combo catalog...
          </div>
        ) : filteredCombos.length === 0 ? (
          <div className="combos-table-card" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#FAF5EE', color: '#C25E30', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <UtensilsCrossed size={24} />
            </div>
            <div style={{ fontWeight: 800, color: '#1E140E', fontSize: '1.05rem', marginBottom: '4px' }}>
              No combos found
            </div>
            <p style={{ color: '#7A6E63', fontSize: '0.85rem', margin: '0 0 16px' }}>
              {search ? 'No combos match your search query.' : 'Get started by creating your first combo menu item.'}
            </p>
            <button
              onClick={() => {
                setEditingCombo(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ background: '#C25E30', borderColor: '#C25E30', fontWeight: 700, borderRadius: '10px' }}
            >
              <Plus size={15} />
              <span>Add New Combo</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="combos-table-card">
              <div className="table-responsive" style={{ border: 'none' }}>
                <table className="combos-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '64px' }}>Photo</th>
                      <th>Combo Name & Description</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCombos.map((c) => (
                      <tr key={c._id} style={{ opacity: c.isArchived ? 0.6 : 1 }}>
                        {/* Photo */}
                        <td style={{ width: '64px' }}>
                          <img
                            src={c.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'}
                            alt={c.name}
                            className="combo-photo-thumb"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80';
                            }}
                          />
                        </td>

                        {/* Name & Description */}
                        <td>
                          <div className="combo-name-title">{c.name}</div>
                          <div className="combo-desc-text">
                            {c.description || 'No description available'}
                          </div>
                        </td>

                        {/* Category */}
                        <td>
                          <span className="combo-cat-badge">
                            {c.categoryId?.name || 'General'}
                          </span>
                        </td>

                        {/* Price */}
                        <td>
                          <div className="combo-price-val">
                            {formatINR(c.basePricePaise)}
                          </div>
                        </td>

                        {/* Stock / Configurable */}
                        <td>
                          <span className={`combo-stock-indicator ${c.isConfigurable ? 'configurable' : 'fixed'}`}>
                            {c.isConfigurable ? (
                              <>
                                <Sliders size={13} />
                                <span>Configurable</span>
                              </>
                            ) : (
                              <>
                                <Lock size={13} />
                                <span>Fixed</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          {c.isArchived ? (
                            <span className="combo-status-pill archived">ARCHIVED</span>
                          ) : c.isSoldOut ? (
                            <span className="combo-status-pill sold-out">
                              <span className="dot-indicator warning" />
                              SOLD OUT
                            </span>
                          ) : (
                            <span className="combo-status-pill active">
                              <span className="dot-indicator success" />
                              ACTIVE
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="combo-actions-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCombo(c);
                                setIsModalOpen(true);
                              }}
                              className="combo-action-btn btn-edit"
                              title="Edit Combo"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSoldOut(c._id)}
                              className="combo-action-btn btn-visibility"
                              title={c.isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                            >
                              {c.isSoldOut ? <Eye size={15} color="#16A34A" /> : <EyeOff size={15} color="#D97706" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleArchive(c._id)}
                              className="combo-action-btn btn-delete"
                              title={c.isArchived ? 'Restore' : 'Delete / Archive'}
                            >
                              {c.isArchived ? <Archive size={15} color="#16A34A" /> : <Trash2 size={15} color="#DC2626" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet Card Grid View */}
            <div className="mobile-combos-grid">
              {filteredCombos.map((c) => (
                <div key={c._id} className="combo-card-item" style={{ opacity: c.isArchived ? 0.6 : 1 }}>
                  {/* Top: Photo + Title + Category + Price */}
                  <div className="combo-card-top">
                    <img
                      src={c.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=160&q=80'}
                      alt={c.name}
                      className="combo-card-thumb"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=160&q=80';
                      }}
                    />
                    <div className="combo-card-info">
                      <div className="combo-card-name">{c.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="combo-cat-badge">
                          {c.categoryId?.name || 'General'}
                        </span>
                      </div>
                      <div className="combo-price-val" style={{ color: '#C25E30' }}>
                        {formatINR(c.basePricePaise)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {c.description && (
                    <div className="combo-card-desc">
                      {c.description}
                    </div>
                  )}

                  {/* Meta / Stock */}
                  <div className="combo-card-meta">
                    <span className={`combo-stock-indicator ${c.isConfigurable ? 'configurable' : 'fixed'}`}>
                      {c.isConfigurable ? (
                        <>
                          <Sliders size={13} />
                          <span>Configurable</span>
                        </>
                      ) : (
                        <>
                          <Lock size={13} />
                          <span>Fixed</span>
                        </>
                      )}
                    </span>

                    <div>
                      {c.isArchived ? (
                        <span className="combo-status-pill archived">ARCHIVED</span>
                      ) : c.isSoldOut ? (
                        <span className="combo-status-pill sold-out">
                          <span className="dot-indicator warning" />
                          SOLD OUT
                        </span>
                      ) : (
                        <span className="combo-status-pill active">
                          <span className="dot-indicator success" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="combo-card-bottom">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCombo(c);
                        setIsModalOpen(true);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '8px'
                      }}
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSoldOut(c._id)}
                      className="combo-action-btn btn-visibility"
                      title={c.isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                    >
                      {c.isSoldOut ? <Eye size={15} color="#16A34A" /> : <EyeOff size={15} color="#D97706" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleArchive(c._id)}
                      className="combo-action-btn btn-delete"
                      title={c.isArchived ? 'Restore' : 'Delete'}
                    >
                      {c.isArchived ? <Archive size={15} color="#16A34A" /> : <Trash2 size={15} color="#DC2626" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ComboFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        combo={editingCombo}
        categories={categories}
        cafeName={user?.cafe?.name}
        onSaved={loadCatalog}
      />
    </div>
  );
};
