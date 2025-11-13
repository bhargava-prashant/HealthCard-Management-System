import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { role, user } = useAuth();
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    upcomingAppointments: 0,
    pendingReports: 0,
  });
  const [emergencyDoctors, setEmergencyDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, appointmentsRes, emergencyRes] = await Promise.all([
        doctorAPI.getPatients(),
        doctorAPI.getAppointments(),
        appointmentAPI.getEmergencyDoctors(),
      ]);

      const patients = patientsRes.data || [];
      const appointments = appointmentsRes.data || [];
      const upcoming = appointments.filter(
        (apt) => apt.status === 'Booked' && new Date(apt.date) >= new Date()
      );

      setStats({
        patients: patients.length,
        appointments: appointments.length,
        upcomingAppointments: upcoming.length,
        pendingReports: 0, // This would need to be calculated from reports
      });

      setEmergencyDoctors(emergencyRes.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Patients</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.patients}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.appointments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingAppointments}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingReports}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/doctor/patients"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">View My Patients</span>
                  <p className="text-sm text-gray-600 mt-1">Manage your patient list</p>
                </Link>
                <Link
                  to="/doctor/appointments"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">Manage Appointments</span>
                  <p className="text-sm text-gray-600 mt-1">View and manage appointments</p>
                </Link>
                <Link
                  to="/doctor/reports"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">Review Reports</span>
                  <p className="text-sm text-gray-600 mt-1">Approve or reject patient reports</p>
                </Link>
                <Link
                  to="/doctor/prescriptions"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">Create Prescription</span>
                  <p className="text-sm text-gray-600 mt-1">Prescribe medicines to patients</p>
                </Link>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Emergency Available Doctors</h2>
              {emergencyDoctors.length === 0 ? (
                <p className="text-gray-500">No doctors available for emergency</p>
              ) : (
                <div className="space-y-2">
                  {emergencyDoctors.map((doctor) => (
                    <div key={doctor._id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;

