const Spinner = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '20px',
  }}>
    <div style={{
      width: '48px', height: '48px',
      border: '2px solid var(--beige-dark)',
      borderTop: '2px solid var(--gold)',
      borderRadius: '50%',
      animation: 'luxurySpin 0.8s linear infinite',
    }} />
    <div style={{
      fontSize: '0.65rem',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
    }}>Loading</div>
    <style>{`
      @keyframes luxurySpin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Spinner;