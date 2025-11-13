import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, prescriptionAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const fetchPrescription = async () => {
    try {
      const response = await prescriptionAPI.getPrescriptionById(id);
      setPrescription(response.data);
    } catch (error) {
      toast.error('Failed to load prescription');
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

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card>
            <p className="text-gray-500">Prescription not found</p>
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
          to={role === 'doctor' ? '/doctor/prescriptions' : '/patient/medical-history'}
          className="text-primary-600 hover:text-primary-800 mb-4 inline-block"
        >
          ← Back
        </Link>
        <Card>
          <h1 className="text-3xl font-bold mb-6">Prescription Details</h1>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <p className="text-lg">
                {prescription.dateOfPrescription
                  ? format(new Date(prescription.dateOfPrescription), 'MMMM dd, yyyy')
                  : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Disease Description</label>
              <p className="text-lg">{prescription.diseaseDescription || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Medicines</label>
              <div className="space-y-4">
                {prescription.medicines?.map((medicine, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{medicine.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Dosage:</span>{' '}
                        <span className="font-medium">{medicine.dosage}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Timing:</span>{' '}
                        <span className="font-medium">{medicine.timing}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>{' '}
                        <span className="font-medium">{medicine.durationInDays} days</span>
                      </div>
                      {medicine.startDate && (
                        <div>
                          <span className="text-gray-600">Start Date:</span>{' '}
                          <span className="font-medium">
                            {format(new Date(medicine.startDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {prescription.reportAssociated && prescription.reportAssociated.length > 0 && (
  <div>
    <label className="text-sm font-medium text-gray-600 mb-2 block">
      Associated Reports
    </label>
    <ul className="list-disc list-inside space-y-1">
      {prescription.reportAssociated.map((reportId, index) => (
        <li key={index} className="text-gray-800 font-medium">
          Report {index + 1} – {reportId}
        </li>
      ))}
    </ul>
  </div>
)}

          </div>
        </Card>
      </main>
    </div>
  );
};

export default PrescriptionDetail;

