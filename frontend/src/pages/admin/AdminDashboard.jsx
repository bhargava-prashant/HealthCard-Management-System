import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { role } = useAuth();
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        adminAPI.getDoctors(),
        adminAPI.getPatients(),
        adminAPI.getAppointments(),
      ]);

      const doctors = doctorsRes.data || [];
      const patients = patientsRes.data || [];
      const appointments = appointmentsRes.data || [];

      const pendingDoctors = doctors.filter(d => !d.approved).length;
      const pendingPatients = patients.filter(p => !p.isApproved).length;

      setStats({
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointments.length,
        pendingApprovals: pendingDoctors + pendingPatients,
      });
    } catch (error) {
      toast.error('Failed to load statistics');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.doctors}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.patients}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
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
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApprovals}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/admin/doctors"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">Manage Doctors</span>
                  <p className="text-sm text-gray-600 mt-1">View and approve doctor registrations</p>
                </a>
                <a
                  href="/admin/patients"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">Manage Patients</span>
                  <p className="text-sm text-gray-600 mt-1">View and approve patient registrations</p>
                </a>
                <a
                  href="/admin/appointments"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">View Appointments</span>
                  <p className="text-sm text-gray-600 mt-1">Monitor all appointments</p>
                </a>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">System Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Doctors</span>
                  <span className="font-semibold">{stats.doctors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Patients</span>
                  <span className="font-semibold">{stats.patients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Appointments</span>
                  <span className="font-semibold">{stats.appointments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Approvals</span>
                  <span className="font-semibold text-yellow-600">{stats.pendingApprovals}</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

