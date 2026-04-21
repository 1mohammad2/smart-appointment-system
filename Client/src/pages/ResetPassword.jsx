import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.put(`/auth/resetpassword/${token}`, { password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
    }}>
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }} className="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', margin: '0 auto 16px',
            boxShadow: 'var(--shadow-gold)',
          }}>🔐</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem', fontWeight: '400',
            color: 'var(--text-primary)',
          }}>{t('auth.resetPassword')}</h1>
        </div>

        <div style={{
          background: 'var(--warm-white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
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
              <div>
                <label className="luxury-label">{t('auth.newPassword')}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required placeholder="••••••••"
                    className="luxury-input"
                    style={{ paddingRight: '48px' }}
                  />
                  <button type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: '14px',
                      color: 'var(--text-muted)',
                    }}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div>
                <label className="luxury-label">{t('auth.confirmNewPassword')}</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required placeholder="••••••••"
                  className="luxury-input"
                />
              </div>

              <button type="submit" disabled={loading}
                className="btn-gold" style={{ width: '100%' }}>
                {loading ? t('auth.resetting') : t('auth.resetPassword')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;