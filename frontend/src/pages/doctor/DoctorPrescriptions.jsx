import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { useSearchParams, Link } from 'react-router-dom';

const DoctorPrescriptions = () => {
  const { role } = useAuth();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(patientId || '');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diseaseDescription: '',
    medicines: [{ name: '', dosage: '', timing: '', durationInDays: '' }],
    reportAssociated: [],
  });

  useEffect(() => {
    fetchPatients();
    if (patientId) {
      fetchPrescriptions(patientId);
    }
  }, [patientId]);

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

  const fetchPrescriptions = async (pid) => {
    try {
      const response = await doctorAPI.getPrescriptions(pid);
      setPrescriptions(response.data || []);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    }
  };

  const handlePatientChange = (e) => {
    const pid = e.target.value;
    setSelectedPatient(pid);
    if (pid) {
      fetchPrescriptions(pid);
    } else {
      setPrescriptions([]);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionForm.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMedicines });
  };

  const addMedicine = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { name: '', dosage: '', timing: '', durationInDays: '' }],
    });
  };

  const removeMedicine = (index) => {
    const updatedMedicines = prescriptionForm.medicines.filter((_, i) => i !== index);
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMedicines });
  };

  const handlePrescribe = async () => {
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }

    try {
      await doctorAPI.prescribe(selectedPatient, prescriptionForm);
      toast.success('Prescription created successfully');
      setShowPrescribeModal(false);
      setPrescriptionForm({
        diseaseDescription: '',
        medicines: [{ name: '', dosage: '', timing: '', durationInDays: '' }],
        reportAssociated: [],
      });
      fetchPrescriptions(selectedPatient);
    } catch (error) {
      toast.error('Failed to create prescription');
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
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <Button variant="primary" onClick={() => setShowPrescribeModal(true)}>
              Create Prescription
            </Button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient
            </label>
            <select
              value={selectedPatient}
              onChange={handlePatientChange}
              className="input-field max-w-md"
            >
              <option value="">Choose a patient...</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="card text-center text-gray-500">
                  No prescriptions found for this patient
                </div>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription._id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {prescription.dateOfPrescription
                            ? new Date(prescription.dateOfPrescription).toLocaleDateString()
                            : 'N/A'}
                        </h3>
                        <p className="text-gray-600">{prescription.diseaseDescription}</p>
                      </div>
                      <Link
                        to={`/prescription/${prescription.prescriptionId}`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        View Details
                      </Link>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Medicines:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {prescription.medicines?.map((med, idx) => (
                          <li key={idx} className="text-sm">
                            {med.name} - {med.dosage} ({med.timing}) - {med.durationInDays} days
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <Modal
            isOpen={showPrescribeModal}
            onClose={() => setShowPrescribeModal(false)}
            title="Create Prescription"
            size="lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Patient
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
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
                  Disease Description
                </label>
                <textarea
                  value={prescriptionForm.diseaseDescription}
                  onChange={(e) =>
                    setPrescriptionForm({ ...prescriptionForm, diseaseDescription: e.target.value })
                  }
                  className="input-field"
                  rows="3"
                  placeholder="Describe the disease/condition..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Medicines</label>
                  <Button variant="secondary" size="sm" onClick={addMedicine}>
                    Add Medicine
                  </Button>
                </div>
                {prescriptionForm.medicines.map((medicine, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <Input
                        label="Medicine Name"
                        value={medicine.name}
                        onChange={(e) =>
                          handleMedicineChange(index, 'name', e.target.value)
                        }
                        placeholder="e.g., Paracetamol"
                      />
                      <Input
                        label="Dosage"
                        value={medicine.dosage}
                        onChange={(e) =>
                          handleMedicineChange(index, 'dosage', e.target.value)
                        }
                        placeholder="e.g., 500mg"
                      />
                      <Input
                        label="Timing"
                        value={medicine.timing}
                        onChange={(e) =>
                          handleMedicineChange(index, 'timing', e.target.value)
                        }
                        placeholder="e.g., After meals"
                      />
                      <Input
                        label="Duration (Days)"
                        type="number"
                        value={medicine.durationInDays}
                        onChange={(e) =>
                          handleMedicineChange(index, 'durationInDays', e.target.value)
                        }
                        placeholder="e.g., 7"
                      />
                    </div>
                    {prescriptionForm.medicines.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowPrescribeModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handlePrescribe}>
                  Create Prescription
                </Button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;

