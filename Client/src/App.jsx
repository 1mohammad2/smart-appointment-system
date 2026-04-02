import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import NewAppointment from './pages/NewAppointment';
import Services from './pages/Services';

// Layout مع Navbar للصفحات المحمية
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute><Appointments /></ProtectedRoute>
            } />
            <Route path="/appointments/new" element={
              <ProtectedRoute><NewAppointment /></ProtectedRoute>
            } />
            <Route path="/services" element={
              <ProtectedRoute roles={['admin']}><Services /></ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
