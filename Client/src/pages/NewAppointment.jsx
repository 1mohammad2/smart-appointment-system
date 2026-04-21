import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

const NewAppointment = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    service: '', staff: '', date: '',
    startTime: '', endTime: '', notes: '',
  });
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [svcRes, staffRes] = await Promise.all([
          api.get('/services'),
          api.get('/auth/staff'),
        ]);
        setServices(svcRes.data.data);
        setStaff(staffRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'service') {
      const svc = services.find((s) => s._id === value);
      setSelectedService(svc || null);
      setFormData((prev) => ({ ...prev, service: value }));
      return;
    }

    if (name === 'startTime' && selectedService) {
      const [h, m] = value.split(':').map(Number);
      const total = h * 60 + m + selectedService.duration;
      const endH = String(Math.floor(total / 60) % 24).padStart(2, '0');
      const endM = String(total % 60).padStart(2, '0');
      setFormData((prev) => ({ ...prev, startTime: value, endTime: `${endH}:${endM}` }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.startTime >= formData.endTime) {
      return setError('End time must be after start time');
    }
    setLoading(true);
    try {
      await api.post('/appointments', formData);
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <Spinner />;

  const today = new Date().toISOString().split('T')[0];

  const selectStyle = {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 18px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    background: 'var(--warm-white)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E9890' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: '40px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--gold)',
          fontWeight: '600', marginBottom: '8px',
        }}>Booking</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem', fontWeight: '400',
          color: 'var(--text-primary)', lineHeight: 1,
        }}>{t('newAppointment.title')}</h1>
        <p style={{
          color: 'var(--text-muted)', fontSize: '0.85rem',
          marginTop: '8px', fontWeight: '300',
        }}>{t('newAppointment.subtitle')}</p>
        <div className="gold-divider" style={{ margin: '20px 0 0' }} />
      </div>

      {/* Form Card */}
      <div className="luxury-card fade-up-1" style={{ padding: '40px' }}>
        {error && (
          <div style={{
            background: '#FFF1F2', border: '1px solid #FECDD3',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px', marginBottom: '28px',
            fontSize: '0.8rem', color: '#9F1239',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Service */}
            <div>
              <label className="luxury-label">
                {t('newAppointment.service')}
                <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
              </label>
              <select name="service" value={formData.service}
                onChange={handleChange} required style={selectStyle}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">{t('newAppointment.selectService')}</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — {s.duration} {t('newAppointment.minutes')} — {t('common.aed')} {s.price}
                  </option>
                ))}
              </select>

              {/* Service Info Card */}
              {selectedService && (
                <div style={{
                  marginTop: '10px',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex', gap: '24px',
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.6rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: 'var(--text-muted)',
                    }}>{t('newAppointment.duration')}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gold-dark)' }}>
                      {selectedService.duration} {t('newAppointment.minutes')}
                    </div>
                  </div>
                  <div style={{ width: '1px', background: 'var(--border)' }} />
                  <div>
                    <div style={{
                      fontSize: '0.6rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: 'var(--text-muted)',
                    }}>Rate</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gold-dark)' }}>
                      {t('common.aed')} {selectedService.price}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Staff */}
            <div>
              <label className="luxury-label">
                {t('newAppointment.staff')}
                <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
              </label>
              <select name="staff" value={formData.staff}
                onChange={handleChange} required style={selectStyle}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">{t('newAppointment.selectStaff')}</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="luxury-label">
                {t('newAppointment.date')}
                <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
              </label>
              <input type="date" name="date"
                value={formData.date} onChange={handleChange}
                required min={today} className="luxury-input"
              />
            </div>

            {/* Time Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="luxury-label">
                  {t('newAppointment.startTime')}
                  <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                </label>
                <input type="time" name="startTime"
                  value={formData.startTime} onChange={handleChange}
                  required className="luxury-input"
                />
              </div>
              <div>
                <label className="luxury-label">
                  {t('newAppointment.endTime')}
                  <span style={{ color: 'var(--gold)', marginInlineStart: '4px' }}>*</span>
                </label>
                <input type="time" name="endTime"
                  value={formData.endTime} onChange={handleChange}
                  required className="luxury-input"
                />
              </div>
            </div>

            {selectedService && formData.startTime && (
              <p style={{
                fontSize: '0.72rem', color: 'var(--gold)',
                letterSpacing: '0.05em', marginTop: '-12px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                ✦ {t('newAppointment.autoCalc')}
              </p>
            )}

            {/* Notes */}
            <div>
              <label className="luxury-label">{t('newAppointment.notes')}</label>
              <textarea name="notes" value={formData.notes}
                onChange={handleChange} rows={4} maxLength={300}
                placeholder={t('newAppointment.notesPlaceholder')}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 18px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  background: 'var(--warm-white)',
                  resize: 'none',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{
                textAlign: 'right', fontSize: '0.7rem',
                color: 'var(--text-muted)', marginTop: '4px',
              }}>{formData.notes.length}/300</div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)' }} />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => navigate('/appointments')}
                className="btn-ghost" style={{ flex: 1 }}>
                {t('newAppointment.cancel')}
              </button>
              <button type="submit" disabled={loading}
                className="btn-gold" style={{ flex: 2 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }}
                      viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="8" />
                    </svg>
                    {t('newAppointment.booking')}
                  </span>
                ) : `✦ ${t('newAppointment.book')}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointment;