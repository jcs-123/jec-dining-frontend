import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Trash2,
  X,
  ShieldCheck,
  Store,
  GraduationCap,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const SuperAdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ all: 0, customers: 0, cafeAdmins: 0, superAdmins: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cafes, setCafes] = useState([]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'customer',
    cafeId: '',
    phone: '',
    admissionNumber: ''
  });

  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('role', activeTab);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await api.get(`/super-admin/users?${params.toString()}`);
      if (res.success) {
        setUsers(res.users || []);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users directory');
    } finally {
      setLoading(false);
    }
  };

  const fetchCafes = async () => {
    try {
      const res = await api.get('/cafes');
      if (res.success) {
        setCafes(res.cafes || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCafes();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/super-admin/users/${userId}`);
      if (res.success) {
        toast.success(res.message || 'User deleted successfully');
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Name, email, and password are required');
      return;
    }

    if (formData.role === 'cafe_admin' && !formData.cafeId) {
      toast.error('Please assign a café to the Café Administrator');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/super-admin/users', formData);
      if (res.success) {
        toast.success(res.message || 'User created successfully!');
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          role: 'customer',
          cafeId: '',
          phone: '',
          admissionNumber: ''
        });
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            Campus Users & Authority Governance
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Manage and provision Customers, Café Administrators, and Super Administrators
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchUsers}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#CBD5E1',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <UserPlus size={16} />
            + Add New User
          </button>
        </div>
      </div>

      {/* Role Navigation Tabs & Search */}
      <div style={{
        background: 'linear-gradient(175deg, #111B2C 0%, #0D1524 100%)',
        border: '1px solid #1E2E4A',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Users', count: counts.all },
            { id: 'customer', label: 'Customers', count: counts.customers },
            { id: 'cafe_admin', label: 'Café Admins', count: counts.cafeAdmins },
            { id: 'super_admin', label: 'Super Admins', count: counts.superAdmins }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 600,
                  background: isSelected ? '#10B981' : '#0B111D',
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  border: isSelected ? '1px solid #10B981' : '1px solid #1E293B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search name, email, admission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              background: '#0B111D',
              border: '1px solid #1E293B',
              color: '#F8FAFC',
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </form>
      </div>

      {/* Users Table */}
      <div style={{
        background: 'linear-gradient(175deg, #111B2C 0%, #0D1524 100%)',
        border: '1px solid #1E2E4A',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)'
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94A3B8' }}>
            Loading platform users directory...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
            No users found matching the selected filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E293B', textAlign: 'left', color: '#64748B', background: '#090E17' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>User / Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Email Address</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Assigned Venue</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Admission / Contact</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Date Joined</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  let roleBadgeBg = 'rgba(148, 163, 184, 0.15)';
                  let roleBadgeColor = '#94A3B8';
                  let roleLabel = 'Customer';

                  if (u.role === 'super_admin') {
                    roleBadgeBg = 'rgba(16, 185, 129, 0.2)';
                    roleBadgeColor = '#34D399';
                    roleLabel = 'Super Admin';
                  } else if (u.role === 'cafe_admin') {
                    roleBadgeBg = 'rgba(59, 130, 246, 0.2)';
                    roleBadgeColor = '#60A5FA';
                    roleLabel = 'Café Admin';
                  }

                  return (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{u.name}</div>
                        {u.username && (
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>@{u.username}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '8px',
                          background: roleBadgeBg,
                          color: roleBadgeColor,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          {roleLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {u.cafeId ? (
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '8px',
                            background: u.cafeId.slug === 'jeccafe' ? 'rgba(234, 88, 12, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                            color: u.cafeId.slug === 'jeccafe' ? '#FB923C' : '#38BDF8',
                            fontSize: '0.74rem',
                            fontWeight: 700
                          }}>
                            {u.cafeId.name}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            {u.role === 'super_admin' ? 'Master (All Venues)' : 'No Venue Bound'}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8' }}>
                        <div>{u.admissionNumber || '—'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{u.phone || ''}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          title="Delete User"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#F87171',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#111B2C',
            border: '1px solid #1E2E4A',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <UserPlus size={20} color="#10B981" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                Provision New User
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0 0 1.25rem' }}>
              Add a Customer, Café Administrator, or Master Super Admin
            </p>

            <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Role Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Select User Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'customer', label: 'Customer', desc: 'Student / Staff' },
                    { id: 'cafe_admin', label: 'Café Admin', desc: 'Venue Manager' },
                    { id: 'super_admin', label: 'Super Admin', desc: 'Full Master' }
                  ].map((r) => {
                    const isSelected = formData.role === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => handleFormChange('role', r.id)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#0B111D',
                          border: isSelected ? '1.5px solid #10B981' : '1px solid #1E293B',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isSelected ? '#34D399' : '#F8FAFC' }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: '#64748B', marginTop: '2px' }}>
                          {r.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* If Cafe Admin or Customer: Cafe Selection */}
              {(formData.role === 'cafe_admin' || formData.role === 'customer') && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {formData.role === 'cafe_admin' ? 'Assigned Venue (Required)' : 'Preferred Venue (Optional)'}
                  </label>
                  <select
                    value={formData.cafeId}
                    onChange={(e) => handleFormChange('cafeId', e.target.value)}
                    required={formData.role === 'cafe_admin'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#0B111D',
                      border: '1px solid #1E293B',
                      color: '#F8FAFC',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">{formData.role === 'cafe_admin' ? '-- Select Venue --' : '-- No Preference / Campus Wide --'}</option>
                    {cafes.map(c => (
                      <option key={c._id} value={c._id}>{c.name} ({c.slug})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#0B111D',
                      border: '1px solid #1E293B',
                      color: '#F8FAFC',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@jecc.ac.in"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#0B111D',
                      border: '1px solid #1E293B',
                      color: '#F8FAFC',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Username & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                    Username (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#0B111D',
                      border: '1px solid #1E293B',
                      color: '#F8FAFC',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                    Initial Password *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student@123"
                    value={formData.password}
                    onChange={(e) => handleFormChange('password', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#0B111D',
                      border: '1px solid #1E293B',
                      color: '#F8FAFC',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Contact & Admission Number (If Customer) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#0B111D',
                      border: '1px solid #1E293B',
                      color: '#F8FAFC',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                {formData.role === 'customer' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                      Admission / ID Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JEC/2026/CS101"
                      value={formData.admissionNumber}
                      onChange={(e) => handleFormChange('admissionNumber', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: '#0B111D',
                        border: '1px solid #1E293B',
                        color: '#F8FAFC',
                        fontSize: '0.84rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    color: '#94A3B8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {submitting ? 'Creating User...' : `Create ${formData.role.replace('_', ' ')}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
