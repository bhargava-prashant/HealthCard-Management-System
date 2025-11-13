import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const PatientAppointments = () => {
  const { role, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    date: '',
    time: '',
    day: '',
    notes: '',
  });
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentAPI.getPatientAppointments(user.id),
        adminAPI.getDoctors(),
      ]);

      setAppointments(appointmentsRes.data || []);
      setFilteredAppointments(appointmentsRes.data || []);
      setDoctors(doctorsRes.data?.filter(d => d.approved) || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!bookingData.doctorId || !bookingData.date || !bookingData.time) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const dayName = new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      await appointmentAPI.bookAppointment({
        ...bookingData,
        day: dayName,
      });
      toast.success('Appointment booked successfully');
      setShowBookModal(false);
      setBookingData({ doctorId: '', date: '', time: '', day: '', notes: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentAPI.cancelAppointment(id);
      toast.success('Appointment cancelled successfully');
      fetchData();
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
      fetchData();
    } catch (error) {
      toast.error('Failed to reschedule appointment');
    }
  };

  const headers = ['Doctor', 'Date', 'Time', 'Day', 'Status', 'Notes', 'Actions'];

  const renderRow = (appointment) => (
    <tr key={appointment._id} className="table-row">
      <td className="table-cell">{appointment.doctorId?.name || 'N/A'}</td>
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
            <Button variant="primary" onClick={() => setShowBookModal(true)}>
              Book Appointment
            </Button>
          </div>

          <Table
            headers={headers}
            data={filteredAppointments}
            renderRow={renderRow}
            emptyMessage="No appointments found"
          />

          <Modal
            isOpen={showBookModal}
            onClose={() => setShowBookModal(false)}
            title="Book Appointment"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  value={bookingData.doctorId}
                  onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Date"
                name="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                required
              />
              <Input
                label="Time"
                name="time"
                type="time"
                value={bookingData.time}
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowBookModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleBook}>
                  Book Appointment
                </Button>
              </div>
            </div>
          </Modal>

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

export default PatientAppointments;

