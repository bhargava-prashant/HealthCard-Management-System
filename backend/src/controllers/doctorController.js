const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Report = require('../models/Report');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');
const Prescription = require('../models/Prescription');
const { v4: uuidv4 } = require('uuid');
const { report } = require('process');

const upload = multer({ dest: 'uploads/' });

exports.getProfile = async (req, res, next) => {
    try {
    const doc = await Doctor.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doc);
    } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
    try {
    const updates = req.body;
    if(updates) updates.approved="false";
    const doc = await Doctor.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json(doc);
    } catch (err) { next(err); }
};

exports.getPatients = async (req, res, next) => {
    try {
      const doctorId = req.user.id;
  
      const patients = await Patient.find({
        'prescriptions.doctorId': doctorId,
      });
  
      res.json(patients);
    } catch (err) {
      next(err);
    }
  };
  

exports.getAppointments = async (req, res, next) => {
    try {
    const Appointment = require('../models/Appointment');
    const appts = await Appointment.find({ doctorId: req.user.id }).populate('patientId', 'name aadhaar');
    res.json(appts);
    } catch (err) { next(err); }
};

exports.uploadReport = [
    upload.single('report'),
    async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'reports' });
        fs.unlinkSync(req.file.path);
        const newReport = await Report.create({
        patientId: req.params.patientId,
        doctorId: req.user.id,
        url: result.secure_url,
        publicId: result.public_id,
        date: new Date(),
        status: 'Pending'
        });
        await Patient.findByIdAndUpdate(req.params.patientId, { $push: { reportHistory: newReport._id } });
        res.status(201).json(newReport);
    } catch (err) { next(err); }
    }
];

exports.prescribe = async (req, res, next) => {
    try {
    const patientId = req.params.patientId;
    const { diseaseDescription, medicines, reportAssociated, dateOfPrescription } = req.body;
    // medicines should be array with {name, dosage, timing, durationInDays, startDate}
    const prescriptionId = uuidv4();
    const pres = {
        prescriptionId,
        doctorId: req.user.id,
        diseaseDescription,
        dateOfPrescription: dateOfPrescription || new Date(),
        reportAssociated: reportAssociated || [],
        medicines: medicines || []
    };
    // Persist to prescriptions collection and also to patient.prescriptions
    const created = await require('../models/Prescription').create({
        patientId,
        doctorId: req.user.id,
        prescriptionId,
        diseaseDescription,
        dateOfPrescription: pres.dateOfPrescription,
        reportAssociated: pres.reportAssociated,
        medicines: pres.medicines
    });
    await Patient.findByIdAndUpdate(patientId, { $push: { prescriptions: created } });
    res.status(201).json(created);
    } catch (err) { next(err); }
};

exports.getUnapporvedReports = async(req, res, next)=>{
    try {
        const patientId=req.params.patientId;
        const reports=await Report.find({patientId, status:"Pending"});
        res.json(reports);
    } catch (error) {
        next(error);
    }
}

exports.approveReport = async (req, res, next) => {
    try {
    const reportId=req.params.reportId;
    const { approve } = req.body;
    const report = await Report.findByIdAndUpdate(reportId, { status: approve ? 'Approved' : 'Rejected' }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
    } catch (err) { next(err); }
};

exports.getPrescriptions = async (req, res, next) => {
    try {
    const prescriptions = await require('../models/Prescription').find({ patientId: req.params.patientId });
    res.json(prescriptions);
    } catch (err) { next(err); }
};
