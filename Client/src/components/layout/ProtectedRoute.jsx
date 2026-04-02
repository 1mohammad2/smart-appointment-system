import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

// لو المستخدم مش مسجّل دخول، رجّعه لصفحة الـ login
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" replace />;

  // لو في roles محددة، تحقق من صلاحية المستخدم
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;