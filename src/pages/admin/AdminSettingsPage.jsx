import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useToast } from '../../context/ToastContext';
import { Save, Lock, ShieldCheck, Clock } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isOpenOverride, setIsOpenOverride] = useState('auto'); // 'auto', 'open', 'closed'

  // Password Change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get(`/cafes/${user?.cafe?.slug || 'jeccafe'}`);
      if (res.success && res.cafe) {
        const c = res.cafe;
        setName(c.name || '');
        setTagline(c.tagline || '');
        setDescription(c.description || '');
        setOpeningHours(c.openingHours || '');
        setAddress(c.address || '');
        setPhone(c.phone || '');
        setEmail(c.email || '');
        setIsOpenOverride(c.isOpenOverride === true ? 'open' : c.isOpenOverride === false ? 'closed' : 'auto');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name,
        tagline,
        description,
        openingHours,
        address,
        phone,
        email,
        isOpenOverride: isOpenOverride === 'open' ? true : isOpenOverride === 'closed' ? false : null
      };

      const res = await api.put('/cafes/settings', payload);
      if (res.success) {
        toast.success('Café settings updated successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setPasswordLoading(true);
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (res.success) {
        toast.success('Administrator password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Password update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Café Configuration & Profile"
        subtitle={`Operating hours, store details and security for ${user?.cafe?.name}`}
      />

      <div className="admin-page-container" style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Cafe Profile Form */}
        <div className="card" style={{ padding: 'clamp(1.15rem, 3vw, 2rem)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Store Profile & Timings</h2>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Café Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Operating Hours Display</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 08:00 AM - 10:30 PM"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Live Status Override</label>
                <select
                  className="form-select"
                  value={isOpenOverride}
                  onChange={(e) => setIsOpenOverride(e.target.value)}
                >
                  <option value="auto">Automatic (Calculated from Kolkata time)</option>
                  <option value="open">Force OPEN (Override)</option>
                  <option value="closed">Force CLOSED (Override)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Pickup Location / Counter</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Store Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Store Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem', gap: '8px', marginTop: '0.5rem' }}
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Café Profile'}</span>
            </button>
          </form>
        </div>

        {/* Change Administrator Password Form */}
        <div className="card" style={{ padding: 'clamp(1.15rem, 3vw, 2rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Lock size={20} color="var(--brand-accent)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Change Administrator Password</h2>
          </div>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '440px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="btn btn-outline"
              style={{ alignSelf: 'flex-start', padding: '0.65rem 1.25rem', gap: '6px' }}
            >
              <ShieldCheck size={16} />
              <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
