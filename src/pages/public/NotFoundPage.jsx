import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--brand-accent)', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0 1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '1.5rem' }}>
        The page or combo you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ gap: '8px' }}>
        <Home size={18} />
        <span>Return to Campus Cafés</span>
      </Link>
    </div>
  );
};
