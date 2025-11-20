import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { path: '/admin/patients', label: 'Patients', icon: '👤' },
    { path: '/admin/appointments', label: 'Appointments', icon: '📅' },
  ];

  const doctorLinks = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/doctor/profile', label: 'Profile', icon: '👤' },
    { path: '/doctor/patients', label: 'Patients', icon: '👥' },
    { path: '/doctor/appointments', label: 'Appointments', icon: '📅' },
    { path: '/doctor/reports', label: 'Reports', icon: '📄' },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: '💊' },
  ];

  const patientLinks = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/patient/profile', label: 'Profile', icon: '👤' },
    { path: '/patient/appointments', label: 'Appointments', icon: '📅' },
    { path: '/patient/medical-history', label: 'Medical History', icon: '📋' },
    { path: '/patient/reports', label: 'Reports', icon: '📄' },
    { path: '/patient/health-card', label: 'Health Card', icon: '🆔' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(link.path)
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


