import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const toggle = () => {
    const newLang = isAr ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  // ضبط الـ RTL تلقائياً
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'en';
  }, [isAr]);

  return (
    <button
      onClick={toggle}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.color = 'var(--gold)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      <span style={{ fontSize: '1rem' }}>{isAr ? '🇬🇧' : '🇸🇦'}</span>
      <span>{isAr ? 'English' : 'عربي'}</span>
    </button>
  );
};

export default LanguageSwitcher;