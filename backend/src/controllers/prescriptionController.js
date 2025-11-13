const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

exports.addPrescription = async (req, res, next) => {
    try {
    const patientId = req.params.patientId;
    const payload = req.body;
    // Create prescription in collection
    const created = await Prescription.create({
        patientId,
        doctorId: req.user.id,
        diseaseDescription: payload.diseaseDescription,
        dateOfPrescription: payload.dateOfPrescription || new Date(),
        reportAssociated: payload.reportAssociated || [],
        medicines: payload.medicines || []
    });
    // push to patient embedded list as well
    await Patient.findByIdAndUpdate(patientId, { $push: { prescriptions: created } });
    res.status(201).json(created);
    } catch (err) { next(err); }
};

exports.currentMedicines = async (req, res, next) => {
    try {
    const patientId = req.params.patientId;
    // find prescriptions and medicines with endDate >= today
    const prescriptions = await Prescription.find({ patientId });
    const now = new Date();
    const active = [];
    for (const p of prescriptions) {
        for (const m of p.medicines) {
        const start = m.startDate ? new Date(m.startDate) : p.dateOfPrescription;
        const end = new Date(start);
        end.setDate(end.getDate() + (m.durationInDays || 0));
        if (end >= now) {
            active.push({ prescriptionId: p.prescriptionId, medicine: m, prescriptionDate: p.dateOfPrescription });
        }
    }
}
    res.json(active);
    } catch (err) { next(err); }
};

exports.getHistory = async (req, res, next) => {
    try {
    const patientId = req.params.patientId;
    const history = await Prescription.find({ patientId });
    res.json(history);
    } catch (err) { next(err); }
};

exports.getPrescriptionById = async (req, res, next) => {
    try {
      const { prescriptionId } = req.params;
      const patient = await require('../models/Patient').findOne(
        { 'prescriptions.prescriptionId': prescriptionId },
        { 'prescriptions.$': 1 }
      );
  
      if (!patient || !patient.prescriptions.length) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
  
      res.json(patient.prescriptions[0]);
    } catch (err) {
      next(err);
    }
  };
  
