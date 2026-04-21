import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'customer',
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
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: t('auth.fullName'), type: 'text', placeholder: 'John Smith' },
    { name: 'email', label: t('auth.email'), type: 'email', placeholder: 'your@email.com' },
    { name: 'phone', label: t('auth.phone'), type: 'text', placeholder: '+971 50 000 0000', required: false },
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
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          radial-gradient(ellipse at 10% 50%, rgba(201,168,76,0.07) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 20%, rgba(201,168,76,0.05) 0%, transparent 50%)`,
      }} />

      {/* Language */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{
        width: '100%', maxWidth: '520px',
        position: 'relative', zIndex: 1,
      }} className="fade-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px',
            margin: '0 auto 16px',
            boxShadow: 'var(--shadow-gold)',
          }}>📅</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '400',
            color: 'var(--text-primary)',
          }}>{t('auth.joinUs')}</h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginTop: '6px',
            fontWeight: '300',
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
          {error && (
            <div style={{
              background: '#FFF1F2', border: '1px solid #FECDD3',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px', marginBottom: '24px',
              fontSize: '0.8rem', color: '#9F1239',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="luxury-label">
                    {field.label}
                    {field.required !== false && (
                      <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                    )}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required !== false}
                    placeholder={field.placeholder}
                    className="luxury-input"
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
              </div>

              {/* Role */}
              <div>
                <label className="luxury-label">{t('auth.role')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {['customer', 'staff'].map((role) => (
                    <label key={role} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '14px 18px',
                      border: `1px solid ${formData.role === role ? 'var(--gold)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: formData.role === role ? 'rgba(201,168,76,0.06)' : 'transparent',
                      transition: 'all 0.3s ease',
                    }}>
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                        style={{ accentColor: 'var(--gold)' }}
                      />
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        color: formData.role === role ? 'var(--gold-dark)' : 'var(--text-secondary)',
                        letterSpacing: '0.05em',
                      }}>
                        {role === 'customer' ? t('auth.customer') : t('auth.staff')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-gold"
                style={{ width: '100%', marginTop: '8px' }}>
                {loading ? t('auth.creating') : t('auth.register')}
              </button>
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