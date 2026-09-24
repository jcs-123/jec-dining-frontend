import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Tag,
  FolderTree,
  UtensilsCrossed,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

export const AdminCategoriesPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, comboRes] = await Promise.allSettled([
        api.get('/categories/admin'),
        api.get('/combos/admin/list')
      ]);

      if (catRes.status === 'fulfilled' && catRes.value?.success) {
        setCategories(catRes.value.categories || []);
      }
      if (comboRes.status === 'fulfilled' && comboRes.value?.success) {
        setCombos(comboRes.value.combos || []);
      }
    } catch (err) {
      console.error('Failed to load category data:', err);
      toast.showError('Could not load categories');
    } finally {
      setLoading(false);
    }
  };

  // Map of combo count per categoryId
  const comboCountMap = combos.reduce((acc, combo) => {
    const catId = combo.categoryId?._id || combo.categoryId;
    if (catId) {
      acc[catId] = (acc[catId] || 0) + 1;
    }
    return acc;
  }, {});

  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete category "${category.name}"? Any assigned combos will remain safe and available.`)) {
      return;
    }

    try {
      const res = await api.delete(`/categories/admin/${category._id}`);
      if (res.success) {
        toast.showSuccess(`Category "${category.name}" deleted successfully`);
        loadData();
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to delete category');
    }
  };

  // Live search filter by name or slug
  const filteredCategories = categories.filter((cat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return cat.name?.toLowerCase().includes(q) || cat.slug?.toLowerCase().includes(q);
  });

  return (
    <div>
      <AdminHeader
        title="Category Management"
        subtitle={`Organize and order menu sections for ${user?.cafe?.name || 'JECCAFE'}`}
        actions={
          <button
            onClick={() => {
              setEditingCategory(null);
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
            <span>Add Category to {user?.cafe?.name || 'Café'}</span>
          </button>
        }
      />

      <div className="admin-page-container">
        {/* 1. Search & Stats Toolbar */}
        <div className="categories-toolbar-card">
          <div className="categories-search-wrap">
            <Search size={16} className="categories-search-icon" />
            <input
              type="text"
              className="categories-search-input"
              placeholder="Search categories by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="categories-toolbar-right hide-on-mobile">
            <div className="categories-counts-summary">
              <span className="combos-count-stat">{categories.length} total categories</span>
              <span className="combos-count-sep">•</span>
              <span className="combos-count-stat" style={{ color: '#15803D' }}>
                <span className="dot-indicator success" />
                Menu tabs active
              </span>
              <span className="combos-count-sep">•</span>
              <span className="combos-count-stat" style={{ color: '#7A6E63' }}>
                <ArrowUpDown size={13} />
                Sorted by display order
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Categories Content */}
        {loading ? (
          <div className="categories-table-card" style={{ padding: '3.5rem', textAlign: 'center', color: '#7A6E63' }}>
            Loading menu categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="categories-table-card" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#FAF5EE',
                color: '#C25E30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <FolderTree size={24} />
            </div>
            <div style={{ fontWeight: 800, color: '#1E140E', fontSize: '1.05rem', marginBottom: '4px' }}>
              {search ? 'No matching categories found' : 'No categories configured yet'}
            </div>
            <p style={{ color: '#7A6E63', fontSize: '0.85rem', margin: '0 0 16px' }}>
              {search
                ? 'Try a different search term or clear the filter.'
                : 'Create categories like Breakfast, Combos, or Beverages to organize student menus.'}
            </p>
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '10px', fontWeight: 700 }}
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ background: '#C25E30', borderColor: '#C25E30', fontWeight: 700, borderRadius: '10px' }}
              >
                <Plus size={15} />
                <span>Add First Category</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table View */}
            <div className="categories-table-card">
              <div className="table-responsive" style={{ border: 'none' }}>
                <table className="categories-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Order</th>
                      <th>Category Name</th>
                      <th>URL Slug</th>
                      <th>Assigned Combos</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((cat) => {
                      const combosCount = comboCountMap[cat._id] || 0;
                      return (
                        <tr key={cat._id}>
                          {/* Order Badge */}
                          <td>
                            <span className="cat-order-badge">#{cat.displayOrder ?? 0}</span>
                          </td>

                          {/* Category Name */}
                          <td>
                            <div className="cat-name-cell">
                              <div className="cat-icon-wrap">
                                <Tag size={16} />
                              </div>
                              <div>
                                <div className="cat-name-title">{cat.name}</div>
                                {cat.createdAt && (
                                  <div style={{ fontSize: '0.74rem', color: '#8A7E74' }}>
                                    Created {new Date(cat.createdAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* URL Slug */}
                          <td>
                            <code className="cat-slug-code">{cat.slug}</code>
                          </td>

                          {/* Assigned Combos Count */}
                          <td>
                            <span className="cat-combos-count-badge">
                              <UtensilsCrossed size={12} color="#C25E30" />
                              <span>{combosCount} {combosCount === 1 ? 'combo' : 'combos'}</span>
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            <span className="combo-status-pill active">
                              <span className="dot-indicator success" />
                              ACTIVE
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div className="combo-actions-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setIsModalOpen(true);
                                }}
                                className="combo-action-btn btn-edit"
                                title="Edit Category"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(cat)}
                                className="combo-action-btn btn-delete"
                                title="Delete Category"
                              >
                                <Trash2 size={15} color="#DC2626" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards Grid View */}
            <div className="mobile-categories-grid">
              {filteredCategories.map((cat) => {
                const combosCount = comboCountMap[cat._id] || 0;
                return (
                  <div key={cat._id} className="category-card-item">
                    {/* Header: Order & Status */}
                    <div className="cat-card-header">
                      <span className="cat-order-badge">Display Order #{cat.displayOrder ?? 0}</span>
                      <span className="combo-status-pill active">
                        <span className="dot-indicator success" />
                        ACTIVE
                      </span>
                    </div>

                    {/* Body: Icon + Title */}
                    <div className="cat-card-body">
                      <div className="cat-icon-wrap">
                        <Tag size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="cat-name-title" style={{ fontSize: '1rem', marginBottom: '2px' }}>
                          {cat.name}
                        </div>
                        {cat.createdAt && (
                          <div style={{ fontSize: '0.74rem', color: '#8A7E74' }}>
                            Added {new Date(cat.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta Row: Slug + Combo Count */}
                    <div className="cat-card-meta">
                      <code className="cat-slug-code" style={{ fontSize: '0.78rem' }}>
                        slug: /{cat.slug}
                      </code>
                      <span className="cat-combos-count-badge">
                        <UtensilsCrossed size={12} color="#C25E30" />
                        <span>{combosCount} {combosCount === 1 ? 'combo' : 'combos'}</span>
                      </span>
                    </div>

                    {/* Actions Row */}
                    <div className="cat-card-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsModalOpen(true);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          minHeight: '40px'
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Edit Category</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="combo-action-btn btn-delete"
                        title="Delete Category"
                        style={{ width: '40px', height: '40px', flexShrink: 0 }}
                      >
                        <Trash2 size={16} color="#DC2626" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        cafeName={user?.cafe?.name}
        onSaved={loadData}
      />
    </div>
  );
};
