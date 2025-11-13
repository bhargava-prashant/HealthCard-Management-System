import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { healthCardAPI } from '../../services/api';
import { toast } from 'react-toastify';

const HealthCardScan = () => {
  const { qrId } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthCardData();
  }, [qrId]);

  const fetchHealthCardData = async () => {
    try {
      const response = await healthCardAPI.scan(qrId);
      setPatientData(response.data);
    } catch (error) {
      toast.error('Failed to load health card data');
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

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card>
            <p className="text-gray-500">Health card not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <Card>
          <h1 className="text-3xl font-bold mb-6">Health Card Information</h1>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Patient Name</label>
              <p className="text-lg font-semibold">{patientData.name || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Aadhaar Number</label>
              <p className="text-lg">{patientData.aadhaar || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Medical History Number</label>
              <p className="text-lg">{patientData.medicalHistoryNo || 'N/A'}</p>
            </div>

            {patientData.age && (
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-lg">{patientData.age}</p>
              </div>
            )}

            {patientData.phone && (
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg">{patientData.phone}</p>
              </div>
            )}

            {patientData.address && (
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-lg">{patientData.address}</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default HealthCardScan;

