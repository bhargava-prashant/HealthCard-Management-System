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

const AdminPatients = () => {
  const { role } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.aadhaar?.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      const response = await adminAPI.getPatients();
      setPatients(response.data || []);
      setFilteredPatients(response.data || []);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      // Send { approve: true } in body, since backend expects req.body
      await adminAPI.approvePatient(id, { approve: true });
      toast.success('Patient approved successfully');
      fetchPatients(); // refresh list
    } catch (error) {
      toast.error('Failed to approve patient');
    }
  };
  
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await adminAPI.deletePatient(id);
      toast.success('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const handleView = async (id) => {
    try {
      const response = await adminAPI.getPatientById(id);
      setSelectedPatient(response.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load patient details');
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await adminAPI.getPatientById(id);
      setEditForm(response.data);
      setShowEditModal(true);
    } catch (error) {
      toast.error('Failed to load patient details');
    }
  };

  const handleUpdate = async () => {
    try {
      await adminAPI.editPatient(editForm._id, editForm);
      toast.success('Patient updated successfully');
      setShowEditModal(false);
      fetchPatients();
    } catch (error) {
      toast.error('Failed to update patient');
    }
  };

  const headers = ['Name', 'Email', 'Aadhaar', 'Age', 'Phone', 'Status', 'Actions'];

  const renderRow = (patient) => (
    <tr key={patient._id} className="table-row">
      <td className="table-cell">{patient.name}</td>
      <td className="table-cell">{patient.email}</td>
      <td className="table-cell">{patient.aadhaar}</td>
      <td className="table-cell">{patient.age || 'N/A'}</td>
      <td className="table-cell">{patient.phone || 'N/A'}</td>
      <td className="table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            patient.isApproved
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {patient.isApproved ? 'Approved' : 'Pending'}
        </span>
      </td>
      <td className="table-cell">
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleView(patient._id)}>
            View
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleEdit(patient._id)}>
            Edit
          </Button>
          {!patient.isApproved && (
            <Button variant="success" size="sm" onClick={() => handleApprove(patient._id)}>
              Approve
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={() => handleDelete(patient._id)}>
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
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or Aadhaar..."
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

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Patient Details"
          >
            {selectedPatient && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{selectedPatient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedPatient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Aadhaar</label>
                  <p className="text-gray-900">{selectedPatient.aadhaar}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Age</label>
                  <p className="text-gray-900">{selectedPatient.age || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedPatient.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{selectedPatient.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sex</label>
                  <p className="text-gray-900">{selectedPatient.sex || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-gray-900">{selectedPatient.isApproved ? 'Approved' : 'Pending'}</p>
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit Patient"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={editForm.age || ''}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="input-field"
                    rows="3"
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

export default AdminPatients;

