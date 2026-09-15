import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHeader = ({ title, subtitle, actions }) => {
  const { user } = useAuth();
  const cafeSlug = user?.cafe?.slug || 'jeccafe';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem 2rem',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{title}</h1>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-surface-subtle)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.725rem',
            fontWeight: 700,
            color: 'var(--brand-accent)'
          }}>
            <ShieldCheck size={13} />
            {user?.cafe?.name} Tenant
          </span>
        </div>
        {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link
          to={`/${cafeSlug}`}
          target="_blank"
          className="btn btn-outline btn-sm"
          style={{ gap: '6px' }}
        >
          <ExternalLink size={14} />
          <span>Customer View</span>
        </Link>
        {actions}
      </div>
    </header>
  );
};
