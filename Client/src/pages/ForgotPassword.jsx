import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgotpassword', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }} className="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: sent
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', margin: '0 auto 16px',
            boxShadow: 'var(--shadow-gold)',
            transition: 'all 0.5s ease',
          }}>{sent ? '✉️' : '🔑'}</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem', fontWeight: '400',
            color: 'var(--text-primary)',
          }}>
            {sent ? t('auth.checkEmail') : t('auth.resetPassword')}
          </h1>
          {sent && (
            <p style={{
              color: 'var(--text-muted)', fontSize: '0.875rem',
              marginTop: '8px', fontWeight: '300', lineHeight: 1.6,
            }}>{t('auth.checkEmailMsg')}</p>
          )}
        </div>

        <div style={{
          background: 'var(--warm-white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
        }}>
          {!sent ? (
            <>
              {error && (
                <div style={{
                  background: '#FFF1F2', border: '1px solid #FECDD3',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px', marginBottom: '24px',
                  fontSize: '0.8rem', color: '#9F1239',
                }}>{error}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label className="luxury-label">{t('auth.email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="luxury-input"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-gold" style={{ width: '100%' }}>
                  {loading ? t('auth.sending') : t('auth.sendResetLink')}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px',
                background: '#F0FDF4',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', margin: '0 auto 24px',
              }}>✅</div>
              <p style={{
                color: 'var(--text-secondary)', fontSize: '0.85rem',
                lineHeight: 1.7,
              }}>{t('auth.checkEmailMsg')}</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/login" style={{
              fontSize: '0.8rem', color: 'var(--gold)',
              textDecoration: 'none', fontWeight: '600',
            }}>← {t('auth.backToLogin')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;