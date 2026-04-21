import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

const StatCard = ({ title, value, icon, delay = '0s' }) => (
  <div className="stat-card fade-up" style={{ animationDelay: delay }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{
          fontSize: '0.65rem', fontWeight: '600',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: '10px',
        }}>{title}</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.8rem', fontWeight: '300',
          color: 'var(--text-primary)', lineHeight: 1,
        }}>{value}</div>
      </div>
      <div style={{
        width: '48px', height: '48px',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px',
        border: '1px solid rgba(201,168,76,0.2)',
      }}>{icon}</div>
    </div>
  </div>
);

const COLORS = ['#C9A84C', '#22c55e', '#ef4444', '#3b82f6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--warm-white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.8rem',
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: 'var(--gold)', fontWeight: '600' }}>
          {payload[0].value} appointments
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/appointments?limit=100');
        setAppointments(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner />;

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  const pieData = [
    { name: t('dashboard.pending'), value: stats.pending },
    { name: t('dashboard.confirmed'), value: stats.confirmed },
    { name: t('dashboard.cancelled'), value: stats.cancelled },
    { name: t('dashboard.completed'), value: stats.completed },
  ].filter((d) => d.value > 0);

  const days = isAr
    ? ['أحد', 'اثن', 'ثلا', 'أرب', 'خمس', 'جمع', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const count = appointments.filter((a) =>
      new Date(a.date).toDateString() === date.toDateString()
    ).length;
    return { day: days[date.getDay()], appointments: count };
  });

  const upcoming = appointments
    .filter((a) => new Date(a.date) >= new Date() && a.status !== 'cancelled')
    .slice(0, 5);

  const statusConfig = {
    pending:   { badge: 'badge-pending',   label: t('dashboard.pending') },
    confirmed: { badge: 'badge-confirmed', label: t('dashboard.confirmed') },
    cancelled: { badge: 'badge-cancelled', label: t('dashboard.cancelled') },
    completed: { badge: 'badge-completed', label: t('dashboard.completed') },
  };

  const statCards = [
    { title: t('dashboard.total'),     value: stats.total,     icon: '📋', delay: '0s' },
    { title: t('dashboard.pending'),   value: stats.pending,   icon: '⏳', delay: '0.1s' },
    { title: t('dashboard.confirmed'), value: stats.confirmed, icon: '✅', delay: '0.2s' },
    { title: t('dashboard.completed'), value: stats.completed, icon: '🎉', delay: '0.3s' },
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--gold)',
          fontWeight: '600', marginBottom: '8px',
        }}>
          {new Date().toLocaleDateString(isAr ? 'ar-AE' : 'en-AE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem', fontWeight: '400',
          color: 'var(--text-primary)', lineHeight: 1.1,
        }}>
          {t('dashboard.welcome')},{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontStyle: 'italic',
          }}>{user?.name}</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)', marginTop: '8px',
          fontSize: '0.875rem', fontWeight: '300',
        }}>{t('dashboard.overview')}</p>
        <div className="gold-divider" style={{ margin: '20px 0 0' }} />
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {/* Bar Chart */}
        <div className="luxury-card" style={{ padding: '28px' }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--gold)',
            fontWeight: '600', marginBottom: '4px',
          }}>Analytics</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem', fontWeight: '400',
            color: 'var(--text-primary)', marginBottom: '24px',
          }}>{t('dashboard.last7Days')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7Days} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--beige-dark)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.05)' }} />
              <Bar dataKey="appointments" fill="url(#goldGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" />
                  <stop offset="100%" stopColor="var(--gold-dark)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="luxury-card" style={{ padding: '28px' }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--gold)',
            fontWeight: '600', marginBottom: '4px',
          }}>Overview</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem', fontWeight: '400',
            color: 'var(--text-primary)', marginBottom: '24px',
          }}>{t('dashboard.statusOverview')}</h3>
          {pieData.length === 0 ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '200px', color: 'var(--text-muted)',
              fontFamily: 'var(--font-display)', fontSize: '1rem',
              fontStyle: 'italic',
            }}>{t('dashboard.noData')}</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80} dataKey="value"
                  paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="luxury-card" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px',
        }}>
          <div>
            <div style={{
              fontSize: '0.65rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--gold)',
              fontWeight: '600', marginBottom: '4px',
            }}>Schedule</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem', fontWeight: '400',
              color: 'var(--text-primary)',
            }}>{t('dashboard.upcoming')}</h3>
          </div>
          <Link to="/appointments/new" className="btn-gold"
            style={{ textDecoration: 'none', fontSize: '0.7rem', padding: '10px 24px' }}>
            + {t('dashboard.newAppointment')}
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem', fontStyle: 'italic',
              marginBottom: '8px',
            }}>{t('dashboard.noUpcoming')}</p>
            <Link to="/appointments/new" style={{
              fontSize: '0.75rem', color: 'var(--gold)',
              textDecoration: 'none', fontWeight: '500',
              letterSpacing: '0.05em',
            }}>{t('dashboard.bookFirst')} →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcoming.map((apt, i) => (
              <div key={apt._id} className="apt-row fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: '500', color: 'var(--text-primary)',
                      marginBottom: '4px', fontSize: '0.9rem',
                    }}>{apt.service?.name}</div>
                    <div style={{
                      fontSize: '0.78rem', color: 'var(--text-muted)',
                    }}>
                      {new Date(apt.date).toLocaleDateString(isAr ? 'ar-AE' : 'en-AE', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                      {' · '}{apt.startTime}
                      {' · '}{apt.staff?.name}
                    </div>
                  </div>
                  <span className={`status-badge ${statusConfig[apt.status]?.badge}`}>
                    {statusConfig[apt.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;