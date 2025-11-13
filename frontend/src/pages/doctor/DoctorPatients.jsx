import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const DoctorPatients = () => {
  const { role } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      const response = await doctorAPI.getPatients();
      setPatients(response.data || []);
      setFilteredPatients(response.data || []);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const headers = ['Name', 'Email', 'Age', 'Phone', 'Actions'];

  const renderRow = (patient) => (
    <tr key={patient._id} className="table-row">
      <td className="table-cell">{patient.name}</td>
      <td className="table-cell">{patient.email}</td>
      <td className="table-cell">{patient.age || 'N/A'}</td>
      <td className="table-cell">{patient.phone || 'N/A'}</td>
      <td className="table-cell">
        <Link
          to={`/doctor/prescriptions?patientId=${patient._id}`}
          className="text-primary-600 hover:text-primary-800 font-medium"
        >
          View History
        </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field max-w-md"
            />
          </div>

          <Table
            headers={headers}
            data={filteredPatients}
            renderRow={renderRow}
            emptyMessage="No patients found"
          />
        </main>
      </div>
    </div>
  );
};

export default DoctorPatients;

