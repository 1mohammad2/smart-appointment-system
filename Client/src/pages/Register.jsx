import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.name.trim().length < 2) {
      return setError('Name must be at least 2 characters');
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return setError('Please enter a valid email address');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      // Always register as customer — role assigned by Admin later
      await register({ ...formData, role: 'customer' });
      navigate('/dashboard');
    } catch (err) {
      // Show error inline — no redirect
      const msg = err.response?.data?.message;
      if (msg?.toLowerCase().includes('email')) {
        setError('This email is already registered. Try logging in instead.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name',  label: t('auth.fullName'), type: 'text',     placeholder: 'John Smith',          required: true },
    { name: 'email', label: t('auth.email'),    type: 'email',    placeholder: 'your@email.com',       required: true },
    { name: 'phone', label: t('auth.phone'),    type: 'tel',      placeholder: '+971 50 000 0000',     required: true },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          radial-gradient(ellipse at 10% 50%, rgba(201,168,76,0.07) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 20%, rgba(201,168,76,0.05) 0%, transparent 50%)`,
      }} />

      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}
        className="fade-up">

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', margin: '0 auto 16px',
            boxShadow: 'var(--shadow-gold)',
          }}>📅</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem', fontWeight: '400',
            color: 'var(--text-primary)',
          }}>{t('auth.joinUs')}</h1>
          <p style={{
            color: 'var(--text-muted)', fontSize: '0.85rem',
            marginTop: '6px', fontWeight: '300',
          }}>{t('auth.joinMsg')}</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--warm-white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px',
          boxShadow: 'var(--shadow-lg)',
        }}>

          {/* ── Inline Error Message ── */}
          {error && (
            <div style={{
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
              <div>
                <p style={{
                  fontSize: '0.82rem', color: '#9F1239',
                  fontWeight: '600', marginBottom: '2px',
                }}>Registration Failed</p>
                <p style={{ fontSize: '0.78rem', color: '#BE123C' }}>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Text Fields */}
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="luxury-label">
                    {field.label}
                    <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="luxury-input"
                    style={{
                      borderColor: error && !formData[field.name] ? '#FECDD3' : undefined,
                    }}
                  />
                </div>
              ))}

              {/* Password */}
              <div>
                <label className="luxury-label">
                  {t('auth.password')}
                  <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Min. 6 characters"
                    className="luxury-input"
                    style={{ paddingRight: '48px' }}
                  />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: '14px',
                      color: 'var(--text-muted)',
                    }}>{showPassword ? '🙈' : '👁️'}</button>
                </div>
                {/* Password strength hint */}
                {formData.password.length > 0 && formData.password.length < 6 && (
                  <p style={{
                    fontSize: '0.72rem', color: '#ef4444',
                    marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>⚠️ Password is too short — minimum 6 characters</p>
                )}
                {formData.password.length >= 6 && (
                  <p style={{
                    fontSize: '0.72rem', color: '#22c55e',
                    marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>✓ Password looks good</p>
                )}
              </div>

              {/* Info box — no role needed */}
              <div style={{
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>ℹ️</span>
                <p style={{
                  fontSize: '0.75rem', color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  Your account will be created as a <strong>Client</strong>. If you need staff access, contact the administrator after registering.
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="btn-gold" style={{ width: '100%', marginTop: '8px' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }}
                      viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                        strokeDasharray="32" strokeDashoffset="8" />
                    </svg>
                    {t('auth.creating')}
                  </span>
                ) : `✦ ${t('auth.register')}`}
              </button>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('auth.hasAccount')}{' '}
              <Link to="/login" style={{
                color: 'var(--gold)', textDecoration: 'none', fontWeight: '600',
              }}>{t('auth.signin')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;