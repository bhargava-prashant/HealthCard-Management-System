const HealthCard = require('../models/HealthCard');
const Patient = require('../models/Patient');
const { v4: uuidv4 } = require('uuid');

exports.generate = async (req, res, next) => {
    try {
        const patientId = req.params.patientId;
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        // ensure no duplicate aadhaar healthcard
        const existing = await HealthCard.findOne({ patientId });
        if (existing) return res.json(existing);
        const qrId = uuidv4();
        const hc = await HealthCard.create({
            patientId,
            aadhaar: patient.aadhaar,
            qrId,
            generatedAt: new Date()
    });
    res.status(201).json(hc);
    } catch (err) { next(err); }
};

exports.scan = async (req, res, next) => {
    try {
        const qrId = req.params.qrId;
        const hc = await HealthCard.findOne({ qrId }).populate('patientId', 'name aadhaar profilePhoto');
        if (!hc) return res.status(404).json({ message: 'Health card not found' });
        res.json(hc);
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const patientId = req.params.patientId;
        const updates = req.body;
        const hc = await HealthCard.findOneAndUpdate({ patientId }, updates, { new: true });
        res.json(hc);
    } catch (err) { next(err); }
};
