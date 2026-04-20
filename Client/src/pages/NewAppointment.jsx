import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';

const NewAppointment = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    service: '', staff: '', date: '', startTime: '', endTime: '', notes: '',
  });
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, staffRes] = await Promise.all([
          api.get('/services'),
          api.get('/auth/staff'),
        ]);
        setServices(servicesRes.data.data);
        setStaff(staffRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // لو اختار خدمة، احسب الـ endTime تلقائياً
    if (name === 'service') {
      const svc = services.find((s) => s._id === value);
      setSelectedService(svc || null);
    }

    // احسب الـ endTime تلقائياً حسب مدة الخدمة
    if (name === 'startTime' && selectedService) {
      const [hours, minutes] = value.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + selectedService.duration;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMins = totalMinutes % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
      setFormData((prev) => ({ ...prev, startTime: value, endTime }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.startTime >= formData.endTime) {
      return setError('End time must be after start time');
    }

    setLoading(true);
    try {
      await api.post('/appointments', formData);
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <Spinner />;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Book New Appointment</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below to schedule your appointment</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {error && <Alert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} — {s.duration} min — AED {s.price}
                </option>
              ))}
            </select>
            {selectedService && (
              <p className="text-sm text-blue-600 mt-1">
                ⏱ Duration: {selectedService.duration} minutes · 💰 AED {selectedService.price}
              </p>
            )}
          </div>

          {/* Staff */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Member <span className="text-red-500">*</span>
            </label>
            <select
              name="staff"
              value={formData.staff}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select staff</option>
              {staff.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={today}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          {selectedService && formData.startTime && (
            <p className="text-xs text-gray-400 -mt-3">
              💡 End time auto-calculated based on service duration
            </p>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              maxLength={300}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Any special requests or notes..."
            />
            <p className="text-xs text-gray-400 text-right">{formData.notes.length}/300</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Booking...
                </span>
              ) : '📅 Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointment;