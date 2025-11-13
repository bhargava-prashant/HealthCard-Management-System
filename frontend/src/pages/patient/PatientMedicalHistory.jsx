import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { patientAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const PatientMedicalHistory = () => {
  const { role } = useAuth();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const response = await patientAPI.getMedicalHistory();
      setHistory(response.data);
    } catch (error) {
      toast.error('Failed to load medical history');
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

  const prescriptions = history?.prescriptions || [];
  const reports = history?.reports || [];
  const currentMedicines = prescriptions
    .flatMap((p) => p.medicines || [])
    .filter((med) => {
      if (!med.startDate) return false;
      const start = new Date(med.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + (med.durationInDays || 0));
      return new Date() >= start && new Date() <= end;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Medical History</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Current Medicines</h2>
            {currentMedicines.length === 0 ? (
              <Card>
                <p className="text-gray-500">No current medicines</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMedicines.map((med, idx) => (
                  <Card key={idx}>
                    <h3 className="font-semibold text-lg">{med.name}</h3>
                    <p className="text-gray-600 mt-2">
                      <strong>Dosage:</strong> {med.dosage}
                    </p>
                    <p className="text-gray-600">
                      <strong>Timing:</strong> {med.timing}
                    </p>
                    <p className="text-gray-600">
                      <strong>Duration:</strong> {med.durationInDays} days
                    </p>
                    {med.startDate && (
                      <p className="text-gray-600">
                        <strong>Started:</strong>{' '}
                        {format(new Date(med.startDate), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prescription History</h2>
            {prescriptions.length === 0 ? (
              <Card>
                <p className="text-gray-500">No prescriptions found</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <Card key={prescription._id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {prescription.dateOfPrescription
                            ? format(new Date(prescription.dateOfPrescription), 'MMM dd, yyyy')
                            : 'N/A'}
                        </h3>
                        <p className="text-gray-600 mt-2">{prescription.diseaseDescription}</p>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Medicines:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {prescription.medicines?.map((med, idx) => (
                              <li key={idx} className="text-sm">
                                {med.name} - {med.dosage} ({med.timing})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Link
                        to={`/prescription/${prescription._id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Report History</h2>
            {reports.length === 0 ? (
              <Card>
                <p className="text-gray-500">No reports found</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <Card key={report._id}>
                    <h3 className="font-semibold text-lg">{report.reportType || 'Report'}</h3>
                    <p className="text-gray-600 mt-2">
                      {report.createdAt
                        ? format(new Date(report.createdAt), 'MMM dd, yyyy')
                        : 'N/A'}
                    </p>
                    <p className="mt-2">
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
                    {report.url && (
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-primary-600 hover:text-primary-800"
                      >
                        View Report →
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;

