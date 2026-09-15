import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ComboFormModal } from '../../components/admin/ComboFormModal';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit3, Archive, EyeOff, Eye, Check, X, Search } from 'lucide-react';

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
        toast.success(res.message);
        loadCatalog();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const handleToggleArchive = async (comboId) => {
    try {
      const res = await api.patch(`/combos/admin/${comboId}/toggle-archive`);
      if (res.success) {
        toast.info(res.message);
        loadCatalog();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle archive');
    }
  };

  return (
    <div>
      <AdminHeader
        title="Combo Menu Management"
        subtitle={`Configure fixed, configurable and promotional combos for ${user?.cafe?.name}`}
        actions={
          <button
            onClick={() => {
              setEditingCombo(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add New Combo</span>
          </button>
        }
      />

      <div style={{ padding: '2rem' }}>
        {/* Filter Toolbar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search combos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadCatalog()}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Combos</option>
              <option value="active">Active Only</option>
              <option value="sold_out">Sold Out Only</option>
              <option value="archived">Archived Only</option>
            </select>
          </div>
        </div>

        {/* Combos Table */}
        <div className="card" style={{ padding: '1.25rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading combo catalog...</div>
          ) : combos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No combos found. Click "Add New Combo" to create one.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Combo Name & Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {combos.map((c) => (
                    <tr key={c._id} style={{ opacity: c.isArchived ? 0.6 : 1 }}>
                      <td style={{ width: '60px' }}>
                        <img
                          src={c.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'}
                          alt={c.name}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {c.description}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          background: 'var(--bg-surface-subtle)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {c.categoryId?.name || 'General'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>
                          {formatINR(c.offerPricePaise != null ? c.offerPricePaise : c.basePricePaise)}
                        </div>
                        {c.offerPricePaise != null && (
                          <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-subtle)' }}>
                            {formatINR(c.basePricePaise)}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {c.availableStock >= 0 ? c.availableStock : 'Unlimited'}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: c.isConfigurable ? 'var(--brand-accent)' : 'var(--text-muted)' }}>
                          {c.isConfigurable ? '⚙️ Configurable' : '🔒 Fixed'}
                        </span>
                      </td>
                      <td>
                        {c.isArchived ? (
                          <span className="badge badge-status-cancelled">Archived</span>
                        ) : c.isSoldOut ? (
                          <span className="badge badge-status-pending">Sold Out</span>
                        ) : (
                          <span className="badge badge-status-completed">Active</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setEditingCombo(c);
                              setIsModalOpen(true);
                            }}
                            className="btn btn-outline btn-sm"
                            title="Edit Combo"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleSoldOut(c._id)}
                            className="btn btn-outline btn-sm"
                            title={c.isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                          >
                            {c.isSoldOut ? <Eye size={14} color="#16A34A" /> : <EyeOff size={14} color="#D97706" />}
                          </button>
                          <button
                            onClick={() => handleToggleArchive(c._id)}
                            className="btn btn-outline btn-sm"
                            title={c.isArchived ? 'Restore' : 'Archive'}
                            style={{ color: c.isArchived ? '#16A34A' : '#DC2626' }}
                          >
                            <Archive size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ComboFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        combo={editingCombo}
        categories={categories}
        onSaved={loadCatalog}
      />
    </div>
  );
};
