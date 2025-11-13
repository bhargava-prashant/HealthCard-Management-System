import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const DoctorAppointments = () => {
  const { role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patientId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments();
      setAppointments(response.data || []);
      setFilteredAppointments(response.data || []);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentAPI.cancelAppointment(id);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: appointment.date ? format(new Date(appointment.date), 'yyyy-MM-dd') : '',
      time: appointment.time || '',
    });
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async () => {
    try {
      await appointmentAPI.rescheduleAppointment(selectedAppointment._id, rescheduleData);
      toast.success('Appointment rescheduled successfully');
      setShowRescheduleModal(false);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to reschedule appointment');
    }
  };

  const headers = ['Patient', 'Date', 'Time', 'Day', 'Status', 'Notes', 'Actions'];

  const renderRow = (appointment) => (
    <tr key={appointment._id} className="table-row">
      <td className="table-cell">{appointment.patientId?.name || 'N/A'}</td>
      <td className="table-cell">
        {appointment.date ? format(new Date(appointment.date), 'MMM dd, yyyy') : 'N/A'}
      </td>
      <td className="table-cell">{appointment.time || 'N/A'}</td>
      <td className="table-cell">{appointment.day || 'N/A'}</td>
      <td className="table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            appointment.status === 'Booked'
              ? 'bg-blue-100 text-blue-800'
              : appointment.status === 'Completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {appointment.status}
        </span>
      </td>
      <td className="table-cell">{appointment.notes || 'N/A'}</td>
      <td className="table-cell">
        {appointment.status === 'Booked' && (
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={() => handleReschedule(appointment)}>
              Reschedule
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleCancel(appointment._id)}>
              Cancel
            </Button>
          </div>
        )}
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field max-w-md"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="all">All Status</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <Table
            headers={headers}
            data={filteredAppointments}
            renderRow={renderRow}
            emptyMessage="No appointments found"
          />

          <Modal
            isOpen={showRescheduleModal}
            onClose={() => setShowRescheduleModal(false)}
            title="Reschedule Appointment"
          >
            <div className="space-y-4">
              <Input
                label="New Date"
                name="date"
                type="date"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                required
              />
              <Input
                label="New Time"
                name="time"
                type="time"
                value={rescheduleData.time}
                onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                required
              />
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleRescheduleSubmit}>
                  Reschedule
                </Button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default DoctorAppointments;

