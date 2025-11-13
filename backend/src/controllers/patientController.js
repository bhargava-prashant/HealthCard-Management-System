const Patient = require('../models/Patient');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');
const Appointment = require('../models/Appointment');

// upload middleware helper
const upload = multer({ dest: 'uploads/' });

exports.getProfile = async (req, res, next) => {
    try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
    } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
    try {
    const updates = req.body;
    if(updates) updates.isApproved="false";
    const patient = await Patient.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
    } catch (err) { next(err); }
};

exports.uploadPhoto = [
    upload.single('photo'),
    async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'patients' });
        fs.unlinkSync(req.file.path);
        const patient = await Patient.findByIdAndUpdate(req.user.id, { profilePhoto: result.secure_url }, { new: true });
        res.json({ message: 'Uploaded', url: result.secure_url, patient });
    } catch (err) { next(err); }
    }
];

exports.getMedicalHistory = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.user.id)
            .select('prescriptions reportHistory')
            .populate({
                path: 'reportHistory',
                select: 'url date status doctorId', // fields you want from Report
                populate: { path: 'doctorId', select: 'name email' } // optional
            });

        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        res.json(patient);
    } catch (err) {
        next(err);
    }
};

exports.getHealthCard = async (req, res, next) => {
    try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({
        patient: {
        id: patient._id,
        name: patient.name,
        aadhaar: patient.aadhaar,
        profilePhoto: patient.profilePhoto
        },
        isApproved: patient.isApproved
    });
    } catch (err) { next(err); }
};
