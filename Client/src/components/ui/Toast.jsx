import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return {
    toasts,
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };
};

const Toast = ({ toasts }) => {
  const config = {
    success: {
      bg: 'var(--warm-white)',
      border: '#BBF7D0',
      icon: '✦',
      iconColor: '#22c55e',
      textColor: 'var(--text-primary)',
    },
    error: {
      bg: 'var(--warm-white)',
      border: '#FECDD3',
      icon: '✕',
      iconColor: '#ef4444',
      textColor: 'var(--text-primary)',
    },
    info: {
      bg: 'var(--warm-white)',
      border: 'var(--gold-light)',
      icon: '✦',
      iconColor: 'var(--gold)',
      textColor: 'var(--text-primary)',
    },
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: '32px', right: '32px',
        zIndex: 9999, display: 'flex',
        flexDirection: 'column', gap: '10px',
      }}>
        {toasts.map((toast) => {
          const c = config[toast.type];
          return (
            <div key={toast.id} style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '12px',
              minWidth: '280px', maxWidth: '360px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideIn 0.3s ease forwards',
            }}>
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                background: `${c.iconColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', color: c.iconColor,
                fontWeight: '700', flexShrink: 0,
              }}>{c.icon}</div>
              <span style={{
                fontSize: '0.82rem',
                color: c.textColor,
                fontWeight: '500',
                letterSpacing: '0.02em',
              }}>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Toast;