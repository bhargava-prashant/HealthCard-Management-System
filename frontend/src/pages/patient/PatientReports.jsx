import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const PatientReports = () => {
  const { role, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.viewReports(user.id);
      setReports(response.data || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('report', uploadFile);
      
      await reportAPI.uploadReport(formData);
      toast.success('Report uploaded successfully');
      setShowUploadModal(false);
      setUploadFile(null);
      fetchReports();
    } catch (error) {
      toast.error('Failed to upload report');
    } finally {
      setUploading(false);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
            <Button variant="primary" onClick={() => setShowUploadModal(true)}>
              Upload Report
            </Button>
          </div>

          {reports.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-8">No reports found</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <Card key={report._id}>
                  <h3 className="font-semibold text-lg mb-2">{report.reportType || 'Report'}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {report.createdAt
                      ? format(new Date(report.createdAt), 'MMM dd, yyyy')
                      : 'N/A'}
                  </p>
                  <p className="mb-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {report.status || 'Pending'}
                    </span>
                  </p>
                  <div className="flex space-x-2">
                    {report.url && (
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View →
                      </a>
                    )}
                    <Link
                      to={`/report/${report._id}`}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Details →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {showUploadModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowUploadModal(false)}></div>
                <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4">Upload Report</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report File (PDF/Image)
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
                      <Button variant="primary" onClick={handleUpload} disabled={uploading}>
                        {uploading ? <LoadingSpinner size="sm" /> : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientReports;

