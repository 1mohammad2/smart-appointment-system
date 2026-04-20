import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast, { useToast } from '../components/ui/Toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false, id: null, action: null,
  });
  const { user } = useAuth();
  const { toasts, success, error: toastError } = useToast();
  const LIMIT = 10;

  const fetchAppointments = async (page = 1, status = 'all', searchTerm = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(status !== 'all' && { status }),
        ...(searchTerm && { search: searchTerm }),
      });
      const { data } = await api.get(`/appointments?${params}`);
      setAppointments(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      toastError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage, filter, search);
  }, [currentPage, filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchAppointments(1, filter, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusUpdate = async () => {
    const { id, action } = confirmDialog;
    setConfirmDialog({ isOpen: false, id: null, action: null });
    try {
      await api.put(`/appointments/${id}/status`, { status: action });
      success(`Appointment ${action} successfully`);
      fetchAppointments(currentPage, filter, search);
    } catch (err) {
      toastError('Failed to update appointment');
    }
  };

  const openConfirm = (id, action) => {
    setConfirmDialog({ isOpen: true, id, action });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toast toasts={toasts} />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action === 'cancelled' ? 'Cancel Appointment?' : 'Confirm Appointment?'}
        message={
          confirmDialog.action === 'cancelled'
            ? 'Are you sure you want to cancel this appointment? This cannot be undone.'
            : 'Are you sure you want to confirm this appointment?'
        }
        confirmText={confirmDialog.action === 'cancelled' ? 'Yes, Cancel' : 'Yes, Confirm'}
        confirmColor={
          confirmDialog.action === 'cancelled'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }
        onConfirm={handleStatusUpdate}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null, action: null })}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total</p>
        </div>
        <Link
          to="/appointments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
        >
          + New
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by customer, service, or staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              filter === s
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <Spinner />
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-medium">No appointments found</p>
          <Link to="/appointments/new" className="text-blue-600 hover:underline text-sm mt-2 block">
            Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">{apt.service?.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  📅 {new Date(apt.date).toLocaleDateString('en-US', {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                  })}
                  {' · '}⏰ {apt.startTime} - {apt.endTime}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  👤 {apt.customer?.name}
                  {' · '}🧑‍⚕️ {apt.staff?.name}
                  {apt.service?.price && ` · 💰 AED ${apt.service.price}`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(user?.role === 'admin' || user?.role === 'staff') &&
                  apt.status === 'pending' && (
                    <button
                      onClick={() => openConfirm(apt._id, 'confirmed')}
                      className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition font-medium"
                    >
                      ✅ Confirm
                    </button>
                  )}

                {user?.role === 'admin' &&
                  apt.status !== 'cancelled' &&
                  apt.status !== 'completed' && (
                    <button
                      onClick={() => openConfirm(apt._id, 'cancelled')}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition font-medium"
                    >
                      ❌ Cancel
                    </button>
                  )}

                {user?.role === 'admin' && apt.status === 'confirmed' && (
                  <button
                    onClick={() => openConfirm(apt._id, 'completed')}
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    🎉 Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>
          <span className="text-gray-600 text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Appointments;