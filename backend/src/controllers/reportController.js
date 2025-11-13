const Report = require('../models/Report');
const Patient = require('../models/Patient');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

exports.uploadReport = [
    upload.single('report'),
    async (req, res, next) => {
    try {
        const patientId = req.user.id;
        if (!req.file) return res.status(400).json({ message: 'No file' });
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'reports' });
        fs.unlinkSync(req.file.path);
        const newReport = await Report.create({
        patientId,
        url: result.secure_url,
        publicId: result.public_id,
        date: new Date(),
        status: 'Pending'
    });
        await Patient.findByIdAndUpdate(patientId, { $push: { reportsHistory: newReport._id } });
        res.status(201).json(newReport);
        } catch (err) { next(err); }
    }
];

exports.viewReports = async (req, res, next) => {
    try {
    const patientId = req.params.patientId;
    const reports = await Report.find({ patientId });
    res.json(reports);
    } catch (err) { next(err); }
};

exports.getReport = async (req, res, next) => {
    try {
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
    } catch (err) { next(err); }
};

exports.approveReport = async (req, res, next) => {
    try {
    const { reportId } = req.params;
    const { approve } = req.body;
    const report = await Report.findByIdAndUpdate(reportId, { status: approve ? 'Approved' : 'Rejected' }, { new: true });
    res.json(report);
    } catch (err) { next(err); }
};
