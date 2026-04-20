import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        background: scrolled
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(250,248,245,0.98)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
            }}>📅</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}>AppointPro</div>
              <div style={{
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                fontWeight: '500',
              }}>Premium Scheduling</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
               className="hidden-mobile">
            {[
              { path: '/dashboard', label: t('nav.dashboard') },
              { path: '/appointments', label: t('nav.appointments') },
              ...(user?.role === 'admin' ? [{ path: '/services', label: t('nav.services') }] : []),
            ].map(({ path, label }) => (
              <Link key={path} to={path} style={{
                textDecoration: 'none',
                padding: '8px 20px',
                fontSize: '0.72rem',
                fontWeight: '500',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isActive(path) ? 'var(--gold)' : 'var(--text-secondary)',
                borderBottom: isActive(path) ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => !isActive(path) && (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => !isActive(path) && (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
               className="hidden-mobile">
            <LanguageSwitcher />

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}>{user?.name}</div>
              <div style={{
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>{user?.role}</div>
            </div>

            <button onClick={handleLogout} className="btn-ghost"
              style={{ padding: '8px 20px', fontSize: '0.7rem' }}>
              {t('nav.logout')}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '8px',
              cursor: 'pointer', color: 'var(--text-primary)',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--warm-white)',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px',
          }}>
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{user?.role}</div>
            </div>

            {[
              { path: '/dashboard', label: t('nav.dashboard') },
              { path: '/appointments', label: t('nav.appointments') },
              ...(user?.role === 'admin' ? [{ path: '/services', label: t('nav.services') }] : []),
            ].map(({ path, label }) => (
              <Link key={path} to={path}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '12px 0',
                  textDecoration: 'none',
                  fontSize: '0.8rem', fontWeight: '500',
                  color: isActive(path) ? 'var(--gold)' : 'var(--text-secondary)',
                  borderBottom: '1px solid var(--beige)',
                  letterSpacing: '0.05em',
                }}
              >{label}</Link>
            ))}

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <LanguageSwitcher />
              <button onClick={handleLogout} className="btn-ghost"
                style={{ fontSize: '0.7rem', padding: '8px 16px' }}>
                {t('nav.logout')}
              </button>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;