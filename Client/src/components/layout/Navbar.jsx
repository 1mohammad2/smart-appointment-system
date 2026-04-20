import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `transition font-medium text-sm ${
      isActive(path)
        ? 'text-white border-b-2 border-white pb-1'
        : 'text-blue-100 hover:text-white'
    }`;

  const mobileLinkClass = (path) =>
    `block px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive(path)
        ? 'bg-blue-700 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-xl font-bold text-white">
            📅 AppointPro
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/appointments" className={linkClass('/appointments')}>
              Appointments
            </Link>
            {user?.role === 'admin' && (
              <Link to="/services" className={linkClass('/services')}>
                Services
              </Link>
            )}
          </div>

          {/* Desktop User */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-blue-200 text-xs capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white rounded-xl shadow-lg mb-3 p-3 space-y-1">
            <div className="px-4 py-3 border-b border-gray-100 mb-2">
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>

            <Link
              to="/dashboard"
              className={mobileLinkClass('/dashboard')}
              onClick={() => setMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/appointments"
              className={mobileLinkClass('/appointments')}
              onClick={() => setMenuOpen(false)}
            >
              📅 Appointments
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/services"
                className={mobileLinkClass('/services')}
                onClick={() => setMenuOpen(false)}
              >
                🛎️ Services
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;