import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const DoctorReports = () => {
  const { role } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [uploadData, setUploadData] = useState({ patientId: '', file: null });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await doctorAPI.getPatients();
      setPatients(response.data || []);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnapprovedReports = async (patientId) => {
    try {
      const response = await doctorAPI.getUnapprovedReports(patientId);
      setReports(response.data || []);
      setSelectedPatient(patientId);
      setShowReportsModal(true);
    } catch (error) {
      toast.error('Failed to load reports');
    }
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, file: e.target.files[0] });
  };

  const handleUpload = async () => {
    if (!uploadData.patientId || !uploadData.file) {
      toast.error('Please select a patient and file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('report', uploadData.file);
      
      await doctorAPI.uploadReport(uploadData.patientId, formData);
      toast.success('Report uploaded successfully');
      setShowUploadModal(false);
      setUploadData({ patientId: '', file: null });
    } catch (error) {
      toast.error('Failed to upload report');
    }
  };

  const handleApprove = async (reportId) => {
    try {
      await doctorAPI.approveReport(reportId,{approve:true});
      toast.success('Report approved successfully');
      if (selectedPatient) {
        fetchUnapprovedReports(selectedPatient);
      }
    } catch (error) {
      toast.error('Failed to approve report');
    }
  };

  const headers = ['Name', 'Email', 'Actions'];

  const renderRow = (patient) => (
    <tr key={patient._id} className="table-row">
      <td className="table-cell">{patient.name}</td>
      <td className="table-cell">{patient.email}</td>
      <td className="table-cell">
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchUnapprovedReports(patient._id)}
          >
            View Reports
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
            <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
            <Button variant="primary" onClick={() => setShowUploadModal(true)}>
              Upload Report
            </Button>
          </div>

          <Table
            headers={headers}
            data={patients}
            renderRow={renderRow}
            emptyMessage="No patients found"
          />

          <Modal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            title="Upload Report"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Patient
                </label>
                <select
                  value={uploadData.patientId}
                  onChange={(e) => setUploadData({ ...uploadData, patientId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report File
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={showReportsModal}
            onClose={() => setShowReportsModal(false)}
            title="Unapproved Reports"
            size="lg"
          >
            <div className="space-y-4">
              {reports.length === 0 ? (
                <p className="text-gray-500">No unapproved reports</p>
              ) : (
                reports.map((report) => (
                  <div key={report._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{report.reportType || 'Report'}</p>
                        <p className="text-sm text-gray-600">
                          {report.createdAt
                            ? format(new Date(report.createdAt), 'MMM dd, yyyy')
                            : 'N/A'}
                        </p>
                        {report.url && (
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline text-sm"
                          >
                            View Report
                          </a>
                        )}
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(report._id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default DoctorReports;

