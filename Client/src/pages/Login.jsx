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
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
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
          .login-left { display: none !important; }
          .login-right { grid-column: 1 / -1 !important; }
        }
      `}</style>

      {/* Left Panel — Decorative */}
      <div className="login-left" style={{
        background: 'linear-gradient(160deg, #1A1A1A 0%, #2C2C2C 50%, #1A1A1A 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(201,168,76,0.08) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(201,168,76,0.05) 0%, transparent 50%)`,
        }} />

        {/* Gold Lines */}
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          width: '1px', height: '100%',
          background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '380px' }}>
          {/* Logo Icon */}
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px',
            margin: '0 auto 32px',
            boxShadow: '0 8px 32px rgba(201,168,76,0.3)',
          }}>📅</div>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.8rem',
            fontWeight: '300',
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '8px',
            letterSpacing: '0.02em',
          }}>
            Appoint<span style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
            }}>Pro</span>
          </div>

          <div style={{
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '40px',
          }}>Premium Scheduling</div>

          <div className="gold-divider" style={{ margin: '0 auto 40px' }} />

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: '300',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}>
            "Where every appointment becomes an exceptional experience"
          </p>

          {/* Bottom Decorative */}
          <div style={{
            marginTop: '60px',
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                width: i === 2 ? '24px' : '6px',
                height: '2px',
                background: i === 2 ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="login-right" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 48px',
        background: 'var(--warm-white)',
        position: 'relative',
      }}>
        {/* Language Switcher */}
        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
          <LanguageSwitcher />
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }} className="fade-up">
          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '12px',
              fontWeight: '600',
            }}>Welcome Back</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: '400',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '8px',
            }}>{t('auth.welcomeBack')}</h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: '300',
            }}>{t('auth.welcomeMsg')}</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FFF1F2',
              border: '1px solid #FECDD3',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '0.8rem',
              color: '#9F1239',
            }}>{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="luxury-label">{t('auth.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="luxury-input"
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="luxury-label">{t('auth.password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="luxury-input"
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '14px',
                    color: 'var(--text-muted)',
                  }}
                >{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
              <Link to="/forgot-password" style={{
                fontSize: '0.75rem',
                color: 'var(--gold)',
                textDecoration: 'none',
                fontWeight: '500',
              }}>{t('auth.forgotPassword')}</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-gold"
              style={{ width: '100%', marginBottom: '24px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }}
                    viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="8" />
                  </svg>
                  {t('auth.signingIn')}
                </span>
              ) : t('auth.signin')}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <p style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}>
              {t('auth.noAccount')}{' '}
              <Link to="/register" style={{
                color: 'var(--gold)',
                textDecoration: 'none',
                fontWeight: '600',
              }}>{t('auth.register')}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;