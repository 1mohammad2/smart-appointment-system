import { useState, useEffect } from 'react';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast, { useToast } from '../components/ui/Toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    name: '', description: '', duration: '', price: '',
  });
  const { toasts, success, error: toastError } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data.data);
    } catch (err) {
      toastError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/services', formData);
      setFormData({ name: '', description: '', duration: '', price: '' });
      setShowForm(false);
      success('Service created successfully');
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/services/${deleteDialog.id}`);
      setDeleteDialog({ isOpen: false, id: null });
      success('Service deactivated successfully');
      fetchServices();
    } catch (err) {
      toastError('Failed to delete service');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toast toasts={toasts} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Deactivate Service?"
        message="This service will no longer be available for booking. Are you sure?"
        confirmText="Yes, Deactivate"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null })}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} active services</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            showForm
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {/* Add Service Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold mb-4">New Service</h2>
          {error && <Alert message={error} />}
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Haircut"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  min="5"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (AED) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Create Service
            </button>
          </form>
        </div>
      )}

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">
          <p className="text-5xl mb-3">🛎️</p>
          <p>No services yet. Add your first service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-lg">{service.name}</h3>
                <button
                  onClick={() => setDeleteDialog({ isOpen: true, id: service._id })}
                  className="text-gray-400 hover:text-red-500 transition text-sm"
                >
                  🗑️
                </button>
              </div>

              {service.description && (
                <p className="text-gray-500 text-sm mb-3">{service.description}</p>
              )}

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <span className="text-blue-600 font-bold text-lg">
                  AED {service.price}
                </span>
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                  ⏱ {service.duration} min
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;