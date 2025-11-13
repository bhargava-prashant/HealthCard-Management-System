import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { patientAPI, appointmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const { role, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, appointmentsRes] = await Promise.all([
        patientAPI.getProfile(),
        appointmentAPI.getPatientAppointments(user.id),
      ]);

      setProfile(profileRes.data);
      const allAppointments = appointmentsRes.data || [];
      setAppointments(allAppointments);
      
      const upcoming = allAppointments.filter(
        (apt) => apt.status === 'Booked' && new Date(apt.date) >= new Date()
      );
      setUpcomingAppointments(upcoming);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {profile?.name || 'Patient'}!</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingAppointments.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{appointments.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Status</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">Active</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500">No upcoming appointments</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment._id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">{appointment.doctorId?.name || 'Doctor'}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.date
                          ? format(new Date(appointment.date), 'MMM dd, yyyy')
                          : 'N/A'}{' '}
                        at {appointment.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/patient/appointments"
                className="mt-4 inline-block text-primary-600 hover:text-primary-800 font-medium"
              >
                View All →
              </Link>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/patient/appointments"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">Book Appointment</span>
                  <p className="text-sm text-gray-600 mt-1">Schedule a new appointment</p>
                </Link>
                <Link
                  to="/patient/medical-history"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">View Medical History</span>
                  <p className="text-sm text-gray-600 mt-1">Check your prescriptions and reports</p>
                </Link>
                <Link
                  to="/patient/health-card"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">View Health Card</span>
                  <p className="text-sm text-gray-600 mt-1">Access your digital health card</p>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;

