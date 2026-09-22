import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const AdminHeader = ({ title, subtitle, actions }) => {
  const { user } = useAuth();

  return (
    <header className="admin-header-container">
      <div className="admin-header-info">
        <div className="admin-header-title-row">
          <h1 className="admin-header-title">
            {title}
          </h1>
          <span className="admin-header-tenant-badge">
            <ShieldCheck size={13} style={{ flexShrink: 0 }} />
            <span>{user?.cafe?.name || 'JECCAFE'} Tenant</span>
          </span>
        </div>
        {subtitle && (
          <p className="admin-header-subtitle">
            {subtitle}
          </p>
        )}
      </div>

      <div className="admin-header-actions">
        {actions && (
          <div className="admin-header-action-items">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
