import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ReportDetail = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await reportAPI.getReport(id);
      setReport(response.data);
    } catch (error) {
      toast.error('Failed to load report');
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

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card>
            <p className="text-gray-500">Report not found</p>
            <Link to="/" className="text-primary-600 hover:text-primary-800 mt-4 inline-block">
              Go back
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <Link
          to={role === 'doctor' ? '/doctor/reports' : '/patient/reports'}
          className="text-primary-600 hover:text-primary-800 mb-4 inline-block"
        >
          ← Back
        </Link>
        <Card>
          <h1 className="text-3xl font-bold mb-6">Report Details</h1>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Report Type</label>
              <p className="text-lg">{report.reportType || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <p className="text-lg">
                {report.createdAt
                  ? format(new Date(report.createdAt), 'MMMM dd, yyyy')
                  : 'N/A'}
              </p>
            </div>

            {report.url && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Report File</label>
                <a
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block btn-primary"
                >
                  View/Download Report
                </a>
              </div>
            )}

            {report.description && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Description</label>
                <p className="text-lg">{report.description}</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ReportDetail;

