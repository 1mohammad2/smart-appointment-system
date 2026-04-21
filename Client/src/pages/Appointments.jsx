import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast, { useToast } from '../components/ui/Toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false, id: null, action: null,
  });
  const { user } = useAuth();
  const { toasts, success, error: toastError } = useToast();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const LIMIT = 10;

  const fetchAppointments = async (page = 1, status = 'all', searchTerm = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: LIMIT,
        ...(status !== 'all' && { status }),
        ...(searchTerm && { search: searchTerm }),
      });
      const { data } = await api.get(`/appointments?${params}`);
      setAppointments(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      toastError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage, filter, search);
  }, [currentPage, filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchAppointments(1, filter, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusUpdate = async () => {
    const { id, action } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null, action: null });
    try {
      await api.put(`/appointments/${id}/status`, { status: action });
      success(`${t('common.success')} ✓`);
      fetchAppointments(currentPage, filter, search);
    } catch {
      toastError(t('common.error'));
    }
  };

  const statusConfig = {
    all:       { label: t('appointments.all'),       color: 'var(--text-secondary)' },
    pending:   { label: t('appointments.pending'),   color: '#92700A' },
    confirmed: { label: t('appointments.confirmed'), color: '#166534' },
    completed: { label: t('appointments.completed'), color: '#1E40AF' },
    cancelled: { label: t('appointments.cancelled'), color: '#9F1239' },
  };

  const badgeClass = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    cancelled: 'badge-cancelled',
    completed: 'badge-completed',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <Toast toasts={toasts} />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action === 'cancelled'
          ? t('appointments.cancelTitle')
          : confirmDialog.action === 'completed'
          ? t('appointments.complete') + '?'
          : t('appointments.confirmTitle')}
        message={confirmDialog.action === 'cancelled'
          ? t('appointments.cancelMsg')
          : t('appointments.confirmMsg')}
        confirmText={confirmDialog.action === 'cancelled'
          ? t('appointments.yesCancel')
          : t('appointments.yesConfirm')}
        confirmColor={confirmDialog.action === 'cancelled'
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'}
        onConfirm={handleStatusUpdate}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null, action: null })}
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
            }}>Schedule</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem', fontWeight: '400',
              color: 'var(--text-primary)', lineHeight: 1,
            }}>{t('appointments.title')}</h1>
            <p style={{
              color: 'var(--text-muted)', fontSize: '0.8rem',
              marginTop: '6px', letterSpacing: '0.05em',
            }}>{total} {t('appointments.total')}</p>
          </div>
          <Link to="/appointments/new" className="btn-gold"
            style={{ textDecoration: 'none' }}>
            + {t('appointments.new')}
          </Link>
        </div>
        <div className="gold-divider" style={{ margin: '20px 0 0' }} />
      </div>

      {/* Search */}
      <div className="fade-up-1" style={{ marginBottom: '20px', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: isAr ? 'auto' : '16px',
          right: isAr ? '16px' : 'auto',
          top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', fontSize: '14px', pointerEvents: 'none',
        }}>🔍</div>
        <input
          type="text"
          placeholder={t('appointments.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="luxury-input"
          style={{
            paddingLeft: isAr ? '18px' : '44px',
            paddingRight: isAr ? '44px' : '18px',
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="fade-up-2" style={{
        display: 'flex', gap: '8px', marginBottom: '32px',
        flexWrap: 'wrap',
      }}>
        {Object.entries(statusConfig).map(([key, val]) => (
          <button key={key}
            onClick={() => { setFilter(key); setCurrentPage(1); }}
            style={{
              padding: '8px 20px',
              border: filter === key
                ? '1px solid var(--gold)'
                : '1px solid var(--border)',
              borderRadius: '100px',
              background: filter === key
                ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))'
                : 'var(--warm-white)',
              color: filter === key ? 'white' : 'var(--text-secondary)',
              fontSize: '0.72rem',
              fontWeight: '500',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)',
            }}
          >{val.label}</button>
        ))}
      </div>

      {/* List */}
      {loading ? <Spinner /> : appointments.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: 'var(--warm-white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📭</div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', fontStyle: 'italic',
            color: 'var(--text-muted)', marginBottom: '12px',
          }}>{t('appointments.noFound')}</p>
          <Link to="/appointments/new" style={{
            fontSize: '0.75rem', color: 'var(--gold)',
            textDecoration: 'none', fontWeight: '500',
            letterSpacing: '0.08em',
          }}>{t('appointments.bookFirst')} →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {appointments.map((apt, i) => (
            <div key={apt._id} className="apt-row fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              }}>
                {/* Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '6px', flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontWeight: '600', color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}>{apt.service?.name}</span>
                    <span className={`status-badge ${badgeClass[apt.status]}`}>
                      {statusConfig[apt.status]?.label}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.78rem', color: 'var(--text-muted)',
                    display: 'flex', gap: '16px', flexWrap: 'wrap',
                  }}>
                    <span>
                      📅 {new Date(apt.date).toLocaleDateString(
                        isAr ? 'ar-AE' : 'en-AE',
                        { weekday: 'short', month: 'short', day: 'numeric' }
                      )}
                    </span>
                    <span>⏰ {apt.startTime} — {apt.endTime}</span>
                    <span>👤 {apt.customer?.name}</span>
                    <span>🧑‍💼 {apt.staff?.name}</span>
                    {apt.service?.price && (
                      <span style={{ color: 'var(--gold)', fontWeight: '500' }}>
                        {t('common.aed')} {apt.service.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(user?.role === 'admin' || user?.role === 'staff') &&
                    apt.status === 'pending' && (
                      <button
                        onClick={() => setConfirmDialog({ isOpen: true, id: apt._id, action: 'confirmed' })}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white', border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem', fontWeight: '600',
                          letterSpacing: '0.08em', cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >✓ {t('appointments.confirm')}</button>
                    )}

                  {user?.role === 'admin' && apt.status === 'confirmed' && (
                    <button
                      onClick={() => setConfirmDialog({ isOpen: true, id: apt._id, action: 'completed' })}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white', border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.7rem', fontWeight: '600',
                        letterSpacing: '0.08em', cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >🎉 {t('appointments.complete')}</button>
                  )}

                  {user?.role === 'admin' &&
                    apt.status !== 'cancelled' &&
                    apt.status !== 'completed' && (
                      <button
                        onClick={() => setConfirmDialog({ isOpen: true, id: apt._id, action: 'cancelled' })}
                        style={{
                          padding: '8px 16px',
                          background: 'transparent',
                          color: '#9F1239',
                          border: '1px solid #FECDD3',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem', fontWeight: '600',
                          letterSpacing: '0.08em', cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#FFF1F2';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >✕ {t('appointments.cancel')}</button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', gap: '12px', marginTop: '40px',
        }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-ghost"
            style={{
              padding: '10px 20px', fontSize: '0.72rem',
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >← {t('appointments.previous')}</button>

          <div style={{
            display: 'flex', gap: '6px', alignItems: 'center',
          }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '36px', height: '36px',
                    border: currentPage === page
                      ? '1px solid var(--gold)'
                      : '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: currentPage === page
                      ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))'
                      : 'var(--warm-white)',
                    color: currentPage === page ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.8rem', fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                  }}
                >{page}</button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-ghost"
            style={{
              padding: '10px 20px', fontSize: '0.72rem',
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >{t('appointments.next')} →</button>
        </div>
      )}
    </div>
  );
};

export default Appointments;