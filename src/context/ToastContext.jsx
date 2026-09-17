import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const lastToastRef = useRef({ msg: '', time: 0 });

  const removeToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    if (!message) return;

    const now = Date.now();
    // Debounce duplicate identical toast within 600ms
    if (lastToastRef.current.msg === message && now - lastToastRef.current.time < 600) {
      return;
    }
    lastToastRef.current = { msg: message, time: now };

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const id = now + Math.random();
    setToast({ id, message, type });

    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    }
  }, []);

  const success = (msg, dur) => addToast(msg, 'success', dur);
  const error = (msg, dur) => addToast(msg, 'error', dur);
  const info = (msg, dur) => addToast(msg, 'info', dur);

  return (
    <ToastContext.Provider value={{
      addToast,
      success,
      error,
      info,
      showSuccess: success,
      showError: error,
      showInfo: info
    }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '92%',
          maxWidth: '460px',
          pointerEvents: 'none'
        }}>
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '18px',
              background: toast.type === 'success'
                ? 'linear-gradient(135deg, #182C20 0%, #101E16 100%)'
                : toast.type === 'error'
                ? 'linear-gradient(135deg, #381A1A 0%, #220F0F 100%)'
                : 'linear-gradient(135deg, #1C2638 0%, #111827 100%)',
              color: '#FFFFFF',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.14) inset',
              border: `1px solid ${
                toast.type === 'success' ? '#22C55E55' : toast.type === 'error' ? '#EF444455' : '#3B82F655'
              }`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              animation: 'toastSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.4 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: toast.type === 'success' ? '#22C55E25' : toast.type === 'error' ? '#EF444425' : '#3B82F625',
                border: `1px solid ${toast.type === 'success' ? '#22C55E60' : toast.type === 'error' ? '#EF444460' : '#3B82F660'}`
              }}>
                {toast.type === 'success' && <CheckCircle2 size={18} color="#4ADE80" strokeWidth={2.4} />}
                {toast.type === 'error' && <AlertCircle size={18} color="#F87171" strokeWidth={2.4} />}
                {toast.type === 'info' && <Info size={18} color="#60A5FA" strokeWidth={2.4} />}
              </div>
              <span style={{ letterSpacing: '0.01em', color: '#F9FAFB' }}>{toast.message}</span>
            </div>
            <button
              onClick={removeToast}
              aria-label="Dismiss toast"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                cursor: 'pointer',
                color: '#D1D5DB',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
