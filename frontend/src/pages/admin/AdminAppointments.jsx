import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const AdminAppointments = () => {
  const { role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments whenever searchTerm, statusFilter, or appointments change
  useEffect(() => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    let filtered = safeAppointments;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patientId?.name?.toLowerCase().includes(lowerSearch) ||
          apt.doctorId?.name?.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await adminAPI.getAppointments();

      // Ensure we always get an array
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.appointments)
        ? response.data.appointments
        : [];

      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const headers = ['Patient', 'Doctor', 'Date', 'Time', 'Day', 'Status', 'Notes'];

  const renderRow = (appointment) => (
    <tr key={appointment._id} className="table-row">
      <td className="table-cell">{appointment.patientId?.name || 'N/A'}</td>
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
          {appointment.status || 'N/A'}
        </span>
      </td>
      <td className="table-cell">{appointment.notes || 'N/A'}</td>
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
            <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
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
            data={Array.isArray(filteredAppointments) ? filteredAppointments : []}
            renderRow={renderRow}
            emptyMessage="No appointments found"
          />
        </main>
      </div>
    </div>
  );
};

export default AdminAppointments;
