import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${color}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/appointments');
        setAppointments(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <Spinner />;

  // حساب الإحصائيات
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  // أقرب 5 مواعيد قادمة
  const upcoming = appointments
    .filter((a) => new Date(a.date) >= new Date() && a.status !== 'cancelled')
    .slice(0, 5);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your appointments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total" value={stats.total} icon="📋" color="border-blue-500" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="border-yellow-500" />
        <StatCard title="Confirmed" value={stats.confirmed} icon="✅" color="border-green-500" />
        <StatCard title="Completed" value={stats.completed} icon="🎉" color="border-purple-500" />
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
          <Link
            to="/appointments/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            + New Appointment
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-5xl mb-3">📭</p>
            <p>No upcoming appointments</p>
            <Link to="/appointments/new" className="text-blue-600 hover:underline text-sm mt-2 block">
              Book your first appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div key={apt._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">
                    {apt.service?.name || 'Service'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(apt.date).toLocaleDateString()} at {apt.startTime}
                    {' · '}Staff: {apt.staff?.name}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;