const ConfirmDialog = ({
  isOpen, title, message,
  onConfirm, onCancel,
  confirmText = 'Confirm',
  confirmColor = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(26,26,26,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Dialog */}
      <div className="fade-up" style={{
        position: 'relative',
        background: 'var(--warm-white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px',
        width: '100%', maxWidth: '420px',
        margin: '24px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Gold top line */}
        <div style={{
          position: 'absolute', top: 0, left: '40px', right: '40px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          borderRadius: '2px',
        }} />

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem', fontWeight: '400',
          color: 'var(--text-primary)', marginBottom: '12px',
        }}>{title}</h3>

        <p style={{
          color: 'var(--text-muted)', fontSize: '0.875rem',
          lineHeight: 1.6, marginBottom: '32px',
          fontWeight: '300',
        }}>{message}</p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} className="btn-ghost" style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px 24px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: confirmColor === 'danger'
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;