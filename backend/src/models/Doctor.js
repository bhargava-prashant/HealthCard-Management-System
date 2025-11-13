const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DoctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  specialization: String,
  timings: String,
  day: {
    type: [String], // ✅ allows multiple days
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ],
    required: true
  },
  approved: { type: Boolean, default: false },
  emergencyAvailable: { type: Boolean, default: false },
  phone: String,
  password: { type: String, required: true }
}, { timestamps: true });

// Password match method
DoctorSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Doctor', DoctorSchema);
