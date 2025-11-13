import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'doctor') return '/doctor/dashboard';
    if (role === 'patient') return '/patient/dashboard';
    return '/';
  };

  const getNavLinks = () => {
    if (role === 'admin') {
      return (
        <>
          <Link to="/admin/dashboard" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/admin/doctors" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Doctors
          </Link>
          <Link to="/admin/patients" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Patients
          </Link>
          <Link to="/admin/appointments" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Appointments
          </Link>
        </>
      );
    }
    if (role === 'doctor') {
      return (
        <>
          <Link to="/doctor/dashboard" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/doctor/patients" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Patients
          </Link>
          <Link to="/doctor/appointments" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Appointments
          </Link>
          <Link to="/doctor/reports" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Reports
          </Link>
          <Link to="/doctor/prescriptions" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Prescriptions
          </Link>
        </>
      );
    }
    if (role === 'patient') {
      return (
        <>
          <Link to="/patient/dashboard" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/patient/appointments" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Appointments
          </Link>
          <Link to="/patient/medical-history" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Medical History
          </Link>
          <Link to="/patient/health-card" className="px-4 py-2 hover:text-primary-600 transition-colors">
            Health Card
          </Link>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="text-2xl font-bold text-primary-600">
              HealthCare
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              {getNavLinks()}
            </div>
          </div>

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block font-medium">{user.name || 'User'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to={role === 'admin' ? '#' : role === 'doctor' ? '/doctor/profile' : '/patient/profile'}
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && (
        <div className="md:hidden border-t border-gray-200 px-4 py-2">
          <div className="flex flex-col space-y-1">
            {getNavLinks()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

