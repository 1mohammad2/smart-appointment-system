import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast, { useToast } from '../components/ui/Toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    name: '', description: '', duration: '', price: '',
  });
  const { toasts, success, error: toastError } = useToast();
  const { t } = useTranslation();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data.data);
    } catch {
      toastError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/services', formData);
      setFormData({ name: '', description: '', duration: '', price: '' });
      setShowForm(false);
      success(t('common.success') + ' ✓');
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/services/${deleteDialog.id}`);
      setDeleteDialog({ isOpen: false, id: null });
      success(t('common.success') + ' ✓');
      fetchServices();
    } catch {
      toastError(t('common.error'));
    }
  };

  if (loading) return <Spinner />;

  const inputStyle = {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    background: 'var(--warm-white)',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <Toast toasts={toasts} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={t('services.deactivateTitle')}
        message={t('services.deactivateMsg')}
        confirmText={t('services.yesDeactivate')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null })}
      />

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{
              fontSize: '0.65rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--gold)',
              fontWeight: '600', marginBottom: '8px',
            }}>Management</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem', fontWeight: '400',
              color: 'var(--text-primary)',
            }}>{t('services.title')}</h1>
            <p style={{
              color: 'var(--text-muted)', fontSize: '0.8rem',
              marginTop: '6px',
            }}>{services.length} {t('services.active')}</p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? 'btn-ghost' : 'btn-gold'}
          >
            {showForm ? t('services.cancel') : `+ ${t('services.addService')}`}
          </button>
        </div>
        <div className="gold-divider" style={{ margin: '20px 0 0' }} />
      </div>

      {/* Add Service Form */}
      {showForm && (
        <div className="luxury-card fade-up" style={{
          padding: '36px', marginBottom: '32px',
          borderLeft: '3px solid var(--gold)',
        }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--gold)',
            fontWeight: '600', marginBottom: '4px',
          }}>New</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem', fontWeight: '400',
            color: 'var(--text-primary)', marginBottom: '28px',
          }}>{t('services.newService')}</h2>

          {error && (
            <div style={{
              background: '#FFF1F2', border: '1px solid #FECDD3',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px', marginBottom: '20px',
              fontSize: '0.8rem', color: '#9F1239',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px',
            }}>
              <div>
                <label className="luxury-label">
                  {t('services.name')}
                  <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                </label>
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required placeholder={t('services.namePlaceholder')}
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--gold)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="luxury-label">
                  {t('services.duration')}
                  <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                </label>
                <input type="number" value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required min="5" placeholder="30"
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--gold)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="luxury-label">
                  {t('services.price')}
                  <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                </label>
                <input type="number" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required min="0" placeholder="500"
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--gold)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="luxury-label">{t('services.description')}</label>
                <input type="text" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('services.descPlaceholder')}
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--gold)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn-gold">
              ✦ {t('services.create')}
            </button>
          </form>
        </div>
      )}

      {/* Services Grid */}
      {services.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: 'var(--warm-white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🛎️</div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', fontStyle: 'italic',
            color: 'var(--text-muted)', marginBottom: '12px',
          }}>{t('services.noServices')}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('services.addFirst')}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {services.map((service, i) => (
            <div key={service._id} className="luxury-card fade-up"
              style={{
                padding: '28px',
                animationDelay: `${i * 0.08}s`,
                position: 'relative', overflow: 'hidden',
              }}>
              {/* Gold top accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
              }} />

              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '12px',
              }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.05))',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}>⭐</div>

                <button
                  onClick={() => setDeleteDialog({ isOpen: true, id: service._id })}
                  style={{
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '12px',
                    color: 'var(--text-muted)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#9F1239';
                    e.currentTarget.style.background = '#FFF1F2';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'none';
                  }}
                >{t('services.deactivate')}</button>
              </div>

              {/* Name */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem', fontWeight: '500',
                color: 'var(--text-primary)', marginBottom: '8px',
              }}>{service.name}</h3>

              {service.description && (
                <p style={{
                  fontSize: '0.8rem', color: 'var(--text-muted)',
                  lineHeight: 1.5, marginBottom: '20px',
                  fontWeight: '300',
                }}>{service.description}</p>
              )}

              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{
                    fontSize: '0.6rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    marginBottom: '2px',
                  }}>Rate</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem', fontWeight: '500',
                    background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {t('common.aed')} {service.price}
                  </div>
                </div>

                <div style={{
                  textAlign: 'right',
                }}>
                  <div style={{
                    fontSize: '0.6rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    marginBottom: '2px',
                  }}>Duration</div>
                  <div style={{
                    background: 'var(--beige)',
                    color: 'var(--text-secondary)',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.78rem',
                    fontWeight: '500',
                  }}>
                    {service.duration} {t('common.min')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;