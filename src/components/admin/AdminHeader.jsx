import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const AdminHeader = ({ title, subtitle, actions }) => {
  const { user } = useAuth();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.4rem 2rem',
      background: '#FFFFFF',
      borderBottom: '1.5px solid #EADBCC',
      boxShadow: '0 2px 8px rgba(50, 30, 15, 0.03)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#1E140E',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h1>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: '#FAF6F0',
            border: '1px solid #EADBCC',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#D66C3E',
            letterSpacing: '0.04em'
          }}>
            <ShieldCheck size={13} />
            {user?.cafe?.name} Tenant
          </span>
        </div>
        {subtitle && <p style={{ fontSize: '0.84rem', color: '#7A6E63', marginTop: '3px', fontWeight: 500, margin: '3px 0 0' }}>{subtitle}</p>}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {actions}
        </div>
      )}
    </header>
  );
};
