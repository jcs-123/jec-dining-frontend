import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories/admin');
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Active combos must be reassigned first.')) return;
    try {
      const res = await api.delete(`/categories/admin/${id}`);
      if (res.success) {
        toast.info('Category removed');
        loadCategories();
      }
    } catch (err) {
      toast.error(err.message || 'Cannot delete category with active combos');
    }
  };

  return (
    <div>
      <AdminHeader
        title="Category Management"
        subtitle={`Organize and order menu sections for ${user?.cafe?.name}`}
        actions={
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        }
      />

      <div style={{ padding: '2rem', maxWidth: '800px' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading categories...</div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No categories configured yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>URL Slug</th>
                    <th>Display Order</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td style={{ fontWeight: 700 }}>{cat.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><code>{cat.slug}</code></td>
                      <td style={{ fontWeight: 600 }}>{cat.displayOrder}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setIsModalOpen(true);
                            }}
                            className="btn btn-outline btn-sm"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#DC2626' }}
                          >
                            <Trash2 size={14} />
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSaved={loadCategories}
      />
    </div>
  );
};
