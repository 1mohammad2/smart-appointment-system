import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/appointments');
        setAppointments(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner />;

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === filter);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <Link
          to="/appointments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Appointment
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">
          <p className="text-5xl mb-3">📭</p>
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div key={apt._id} className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{apt.service?.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {new Date(apt.date).toLocaleDateString()} · ⏰ {apt.startTime} - {apt.endTime}
                </p>
                <p className="text-sm text-gray-500">
                  👤 Staff: {apt.staff?.name} · 🛎️ Customer: {apt.customer?.name}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                  {apt.status}
                </span>

                {/* الـ admin والـ staff يقدرون يغيّرون الـ status */}
                {(user?.role === 'admin' || user?.role === 'staff') && apt.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Confirm
                  </button>
                )}
                {user?.role === 'admin' && apt.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                    className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;