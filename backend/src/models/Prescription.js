const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const MedicineSchema = new mongoose.Schema({
    name: String,
    dosage: String,
    timing: String,
    durationInDays: Number,
    startDate: Date
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
    prescriptionId: { type: String, default: () => uuidv4(), unique: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    diseaseDescription: String,
    dateOfPrescription: Date,
    reportAssociated: [String],
    medicines: [MedicineSchema]
    }, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
