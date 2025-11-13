import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { patientAPI, healthCardAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';

const PatientHealthCard = () => {
  const { role, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [healthCard, setHealthCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, healthCardRes] = await Promise.all([
        patientAPI.getProfile(),
        patientAPI.getHealthCard().catch(() => null),
      ]);

      setProfile(profileRes.data);
      setHealthCard(healthCardRes?.data || null);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load health card');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await healthCardAPI.generate(user.id);
      toast.success('Health card generated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to generate health card');
    } finally {
      setGenerating(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Health Card</h1>

          {!healthCard ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You don't have a health card yet.</p>
                <Button variant="primary" onClick={handleGenerate} disabled={generating}>
                  {generating ? <LoadingSpinner size="sm" /> : 'Generate Health Card'}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="max-w-2xl mx-auto">
              <Card>
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="flex-shrink-0">
                    {healthCard.qrId && (
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <QRCodeSVG
                          value={`${window.location.origin}/healthcard/scan/${healthCard.qrId}`}
                          size={200}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-6">Health Card Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-lg font-semibold">{profile?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Aadhaar</label>
                        <p className="text-lg">{profile?.aadhaar || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Medical History Number</label>
                        <p className="text-lg">{healthCard.medicalHistoryNo || profile?.medicalHistoryNo || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">QR Code ID</label>
                        <p className="text-lg font-mono text-sm">{healthCard.qrId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientHealthCard;

