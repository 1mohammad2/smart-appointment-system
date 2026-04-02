import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold">
          📅 AppointPro
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>
          <Link to="/appointments" className="hover:text-blue-200 transition">
            Appointments
          </Link>
          {user?.role === 'admin' && (
            <Link to="/services" className="hover:text-blue-200 transition">
              Services
            </Link>
          )}

          {/* User info + Logout */}
          <div className="flex items-center gap-3 ml-4">
            <span className="text-blue-200 text-sm">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;