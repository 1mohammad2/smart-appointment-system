import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation before hitting API
    if (!formData.email || !formData.password) {
      return setError('Please enter your email and password.');
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return setError('Please enter a valid email address.');
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // Always show error INLINE — never redirect
      const status = err.response?.status;
      const msg    = err.response?.data?.message;

      if (status === 401 || msg?.toLowerCase().includes('invalid')) {
        setError('Incorrect email or password. Please try again.');
      } else if (status === 429) {
        setError('Too many login attempts. Please wait 15 minutes and try again.');
      } else if (status === 404) {
        setError('No account found with this email. Would you like to register?');
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--cream)',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .login-left  { display: none !important; }
          .login-right { grid-column: 1 / -1 !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      {/* Left Panel */}
      <div className="login-left" style={{
        background: 'linear-gradient(160deg, #1A1A1A 0%, #2C2C2C 50%, #1A1A1A 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(201,168,76,0.08) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(201,168,76,0.05) 0%, transparent 50%)`,
        }} />
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          width: '1px', height: '100%',
          background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)',
        }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '380px' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', margin: '0 auto 32px',
            boxShadow: '0 8px 32px rgba(201,168,76,0.3)',
          }}>📅</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '2.8rem',
            fontWeight: '300', color: 'white', lineHeight: 1.1,
            marginBottom: '8px', letterSpacing: '0.02em',
          }}>
            Appoint<span style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
            }}>Pro</span>
          </div>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '40px',
          }}>Premium Scheduling</div>
          <div className="gold-divider" style={{ margin: '0 auto 40px' }} />
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '1.3rem',
            fontWeight: '300', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6, fontStyle: 'italic',
          }}>
            "Where every appointment becomes an exceptional experience"
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right" style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 48px',
        background: 'var(--warm-white)', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
          <LanguageSwitcher />
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }} className="fade-up">
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              fontSize: '0.65rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--gold)',
              marginBottom: '12px', fontWeight: '600',
            }}>Welcome Back</div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '2.4rem',
              fontWeight: '400', color: 'var(--text-primary)',
              lineHeight: 1.1, marginBottom: '8px',
            }}>{t('auth.welcomeBack')}</h1>
            <p style={{
              color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '300',
            }}>{t('auth.welcomeMsg')}</p>
          </div>

          {/* ── Inline Error — NEVER redirects ── */}
          {error && (
            <div
              className="shake"
              style={{
                background: '#FFF1F2',
                border: '1px solid #FECDD3',
                borderLeft: '4px solid #ef4444',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '0.82rem', color: '#9F1239',
                  fontWeight: '600', marginBottom: '4px',
                }}>Sign In Failed</p>
                <p style={{ fontSize: '0.78rem', color: '#BE123C', lineHeight: 1.5 }}>
                  {error}
                </p>
                {/* Show register link if account not found */}
                {error.includes('register') && (
                  <Link to="/register" style={{
                    fontSize: '0.75rem', color: 'var(--gold)',
                    fontWeight: '600', textDecoration: 'none',
                    display: 'inline-block', marginTop: '6px',
                  }}>Create an account →</Link>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="luxury-label">{t('auth.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => { handleChange(e); setError(''); }}
                required
                placeholder="your@email.com"
                className="luxury-input"
                style={{
                  borderColor: error && error.includes('email') ? '#FECDD3' : undefined,
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="luxury-label">{t('auth.password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={(e) => { handleChange(e); setError(''); }}
                  required
                  placeholder="••••••••"
                  className="luxury-input"
                  style={{
                    paddingRight: '48px',
                    borderColor: error && error.includes('password') ? '#FECDD3' : undefined,
                  }}
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)',
                  }}>{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
              <Link to="/forgot-password" style={{
                fontSize: '0.75rem', color: 'var(--gold)',
                textDecoration: 'none', fontWeight: '500',
              }}>{t('auth.forgotPassword')}</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-gold"
              style={{ width: '100%', marginBottom: '24px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }}
                    viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                      strokeDasharray="32" strokeDashoffset="8" />
                  </svg>
                  {t('auth.signingIn')}
                </span>
              ) : t('auth.signin')}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('auth.noAccount')}{' '}
              <Link to="/register" style={{
                color: 'var(--gold)', textDecoration: 'none', fontWeight: '600',
              }}>{t('auth.register')}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;