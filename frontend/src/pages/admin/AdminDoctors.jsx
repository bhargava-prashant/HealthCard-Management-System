import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDoctors = () => {
  const { role } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getDoctors();
      setDoctors(response.data || []);
      setFilteredDoctors(response.data || []);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveDoctor(id, {approve:true});
      toast.success('Doctor approved successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to approve doctor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await adminAPI.deleteDoctor(id);
      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleView = async (id) => {
    try {
      const response = await adminAPI.getDoctorById(id);
      setSelectedDoctor(response.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load doctor details');
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await adminAPI.getDoctorById(id);
      setEditForm(response.data);
      setShowEditModal(true);
    } catch (error) {
      toast.error('Failed to load doctor details');
    }
  };

  const handleUpdate = async () => {
    try {
      await adminAPI.editDoctor(editForm._id, editForm);
      toast.success('Doctor updated successfully');
      setShowEditModal(false);
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to update doctor');
    }
  };

  const headers = ['Name', 'Email', 'Specialization', 'Phone', 'Status', 'Actions'];

  const renderRow = (doctor) => (
    <tr key={doctor._id} className="table-row">
      <td className="table-cell">{doctor.name}</td>
      <td className="table-cell">{doctor.email}</td>
      <td className="table-cell">{doctor.specialization || 'N/A'}</td>
      <td className="table-cell">{doctor.phone || 'N/A'}</td>
      <td className="table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            doctor.approved
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {doctor.approved ? 'Approved' : 'Pending'}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleView(doctor._id)}>
            View
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleEdit(doctor._id)}>
            Edit
          </Button>
          {!doctor.approved && (
            <Button variant="success" size="sm" onClick={() => handleApprove(doctor._id)}>
              Approve
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={() => handleDelete(doctor._id)}>
            Delete
          </Button>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field max-w-md"
            />
          </div>

          <Table
            headers={headers}
            data={filteredDoctors}
            renderRow={renderRow}
            emptyMessage="No doctors found"
          />

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Doctor Details"
          >
            {selectedDoctor && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{selectedDoctor.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedDoctor.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Specialization</label>
                  <p className="text-gray-900">{selectedDoctor.specialization || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedDoctor.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Timings</label>
                  <p className="text-gray-900">{selectedDoctor.timings || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Working Days</label>
                  <p className="text-gray-900">
                    {selectedDoctor.day?.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Emergency Available</label>
                  <p className="text-gray-900">{selectedDoctor.emergencyAvailable ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-gray-900">{selectedDoctor.approved ? 'Approved' : 'Pending'}</p>
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit Doctor"
            size="lg"
          >
            {editForm._id && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    value={editForm.specialization || ''}
                    onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timings</label>
                  <input
                    type="text"
                    value={editForm.timings || ''}
                    onChange={(e) => setEditForm({ ...editForm, timings: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpdate}>
                    Update
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default AdminDoctors;

