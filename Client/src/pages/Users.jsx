import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import Toast, { useToast } from '../components/ui/Toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, success, error: toastError } = useToast();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data.data);
    } catch {
      toastError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const makeStaff = async (id, currentRole) => {
    try {
      const newRole = currentRole === 'staff' ? 'customer' : 'staff';
      await api.put(`/auth/make-staff/${id}`, { role: newRole });
      success(newRole === 'staff' ? '✓ Promoted to Staff' : '✓ Changed to Customer');
      fetchUsers();
    } catch {
      toastError('Failed to update user');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/auth/users/${id}/toggle`, { isActive: !isActive });
      success('✓ User status updated');
      fetchUsers();
    } catch {
      toastError('Failed to update user');
    }
  };

  if (loading) return <Spinner />;

  const roleColors = {
    customer: { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
    staff:    { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <Toast toasts={toasts} />

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--gold)',
          fontWeight: '600', marginBottom: '8px',
        }}>Administration</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem', fontWeight: '400',
          color: 'var(--text-primary)',
        }}>User Management</h1>
        <p style={{
          color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px',
        }}>{users.length} registered users</p>
        <div className="gold-divider" style={{ margin: '20px 0 0' }} />
      </div>

      {/* Info Box */}
      <div style={{
        background: 'rgba(201,168,76,0.06)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '28px',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
      }}>
        💡 {isAr
          ? 'فقط الـ Admin يستطيع ترقية المستخدمين إلى Staff. Staff يظهر في قائمة حجز المواعيد.'
          : 'Only Admin can promote users to Staff. Staff members appear in the appointment booking dropdown.'}
      </div>

      {/* Users List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {users.map((user, i) => (
          <div key={user._id} className="apt-row fade-up"
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: '16px', flexWrap: 'wrap',
            }}>
              {/* User Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                  border: '1px solid rgba(201,168,76,0.2)',
                  flexShrink: 0,
                }}>
                  {user.role === 'staff' ? '🧑‍💼' : '👤'}
                </div>
                <div>
                  <div style={{
                    fontWeight: '600', color: 'var(--text-primary)',
                    fontSize: '0.95rem', marginBottom: '4px',
                  }}>{user.name}</div>
                  <div style={{
                    fontSize: '0.78rem', color: 'var(--text-muted)',
                  }}>{user.email}</div>
                  <div style={{
                    fontSize: '0.7rem', color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Role & Actions */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
              }}>
                {/* Role Badge */}
                <span style={{
                  padding: '4px 14px',
                  borderRadius: '100px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: roleColors[user.role]?.bg || '#F3F4F6',
                  color: roleColors[user.role]?.color || '#374151',
                  border: `1px solid ${roleColors[user.role]?.border || '#E5E7EB'}`,
                }}>{user.role}</span>

                {/* Active Status */}
                <span style={{
                  padding: '4px 14px',
                  borderRadius: '100px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  background: user.isActive ? '#F0FDF4' : '#FFF1F2',
                  color: user.isActive ? '#166534' : '#9F1239',
                  border: `1px solid ${user.isActive ? '#BBF7D0' : '#FECDD3'}`,
                }}>
                  {user.isActive ? '● Active' : '● Inactive'}
                </span>

                {/* Promote/Demote Button */}
                <button
                  onClick={() => makeStaff(user._id, user.role)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: user.role === 'staff'
                      ? 'transparent'
                      : 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    color: user.role === 'staff' ? 'var(--text-secondary)' : 'white',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (user.role !== 'staff') return;
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.color = 'var(--gold)';
                  }}
                  onMouseLeave={e => {
                    if (user.role !== 'staff') return;
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {user.role === 'staff' ? '↓ Demote to Customer' : '↑ Promote to Staff'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;