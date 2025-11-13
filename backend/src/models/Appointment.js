const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Booked", "Cancelled", "Completed"], default: "Booked" },
    notes: String,
    nextAppointment: Date
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
