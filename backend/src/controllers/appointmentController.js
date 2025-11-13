const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// exports.bookAppointment = async (req, res, next) => {
//     try {
//     const { patientId, doctorId, date, notes, nextAppointment } = req.body;
//     // Check doctor exists and is approved
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor || !doctor.approved) return res.status(400).json({ message: 'Doctor not available' });
//     const patient = await Patient.findById(patientId);
//     if (!patient || !patient.isApproved) return res.status(400).json({ message: 'Patient not approved' });
//     const appt = await Appointment.create({ patientId, doctorId, date, notes, nextAppointment });
//     res.status(201).json(appt);
//     } catch (err) { next(err); }
// };


exports.bookAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, date, time, notes, nextAppointment } = req.body;

    if (!patientId || !doctorId || !date || !time)
      return res.status(400).json({ message: "Missing required fields" });

    // ✅ Find doctor and patient
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.approved)
      return res.status(400).json({ message: "Doctor not available or not approved" });

    const patient = await Patient.findById(patientId);
    if (!patient || !patient.isApproved)
      return res.status(400).json({ message: "Patient not approved" });

    // ✅ Combine date + time into one Date object
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // ✅ Extract weekday
    const day = appointmentDate
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    // ✅ Check if doctor works that day
    if (!doctor.day.includes(day)) {
      return res.status(400).json({ message: `Doctor not available on ${day}` });
    }

    // ✅ Convert "11 AM - 4 PM" to 24-hour format
    const [start, end] = doctor.timings.split('-').map(t => t.trim());
    const to24 = (t) => {
      const [hour, modifier] = t.split(' ');
      let h = parseInt(hour);
      if (modifier.toLowerCase() === 'pm' && h !== 12) h += 12;
      if (modifier.toLowerCase() === 'am' && h === 12) h = 0;
      return h;
    };

    const startHour = to24(start);
    const endHour = to24(end);
    const appointmentHour = appointmentDate.getHours() + appointmentDate.getMinutes() / 60;

    if (appointmentHour < startHour || appointmentHour > endHour) {
      return res.status(400).json({
        message: `Doctor available only between ${doctor.timings}`
      });
    }

    // ✅ Check for overlapping appointment within ±5 min
    const fiveMin = 5 * 60 * 1000;
    const conflict = await Appointment.findOne({
      doctorId,
      date: {
        $gte: new Date(appointmentDate.getTime() - fiveMin),
        $lte: new Date(appointmentDate.getTime() + fiveMin)
      },
      status: "Booked"
    });

    if (conflict) {
      return res.status(400).json({ message: "Doctor already has an appointment near this time" });
    }

    // ✅ Save appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date: appointmentDate,
      day,
      time,
      notes,
      nextAppointment
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment
    });

  } catch (error) {
    console.error("Error booking appointment:", error);
    next(error);
  }
};


exports.cancelAppointment = async (req, res, next) => {
    try {
    await Appointment.findByIdAndUpdate(req.params.appointmentId, { status: 'Cancelled' });
    res.json({ message: 'Cancelled' });
    } catch (err) { next(err); }
};

exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const { date } = req.body;

    if (!date) return res.status(400).json({ message: "New date and time required" });

    // ✅ Fetch appointment
    const appt = await Appointment.findById(req.params.appointmentId);
    if (!appt || appt.status==="Cancelled") return res.status(404).json({ message: "Appointment not found" });

    const doctor = await Doctor.findById(appt.doctorId);
    if (!doctor || !doctor.approved)
      return res.status(400).json({ message: "Doctor not available or not approved" });

    // ✅ Combine date+time (since new date may include time)
    const newDate = new Date(date);

    // ✅ Extract new day & time
    const day = newDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const time = newDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // ✅ Check if doctor works that day
    if (!doctor.day.includes(day)) {
      return res.status(400).json({ message: `Doctor not available on ${day}` });
    }

    // ✅ Convert doctor's timings ("11 AM - 4 PM") to 24-hour numeric
    const [start, end] = doctor.timings.split('-').map(t => t.trim());
    const to24 = (t) => {
      const [hour, modifier] = t.split(' ');
      let h = parseInt(hour);
      if (modifier.toLowerCase() === 'pm' && h !== 12) h += 12;
      if (modifier.toLowerCase() === 'am' && h === 12) h = 0;
      return h;
    };

    const startHour = to24(start);
    const endHour = to24(end);
    const newHour = newDate.getHours() + newDate.getMinutes() / 60;

    if (newHour < startHour || newHour > endHour)
      return res.status(400).json({ message: `Doctor available only between ${doctor.timings}` });

    // ✅ Check for conflicting appointment within ±5 minutes
    const fiveMin = 5 * 60 * 1000;
    const conflict = await Appointment.findOne({
      doctorId: appt.doctorId,
      _id: { $ne: appt._id }, // exclude the current one
      date: {
        $gte: new Date(newDate.getTime() - fiveMin),
        $lte: new Date(newDate.getTime() + fiveMin)
      },
      status: "Booked"
    });

    if (conflict)
      return res.status(400).json({ message: "Doctor already has another appointment near this time" });

    // ✅ Update appointment
    appt.date = newDate;
    appt.day = day;
    appt.time = time;

    await appt.save();

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment: appt
    });

  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    next(error);
  }
};


exports.getPatientAppointments = async (req, res, next) => {
    try {
    const appts = await Appointment.find({ patientId: req.params.patientId }).populate('doctorId', 'name specialization timings');
    res.json(appts);
    } catch (err) { next(err); }
};

exports.getDoctorAppointments = async (req, res, next) => {
    try {
    const appts = await Appointment.find({ doctorId: req.params.doctorId }).populate('patientId', 'name aadhaar');
    res.json(appts);
    } catch (err) { next(err); }
};

exports.getAppointmentById = async (req, res, next) => {
    try {
    const appt = await Appointment.findById(req.params.appointmentId);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
    } catch (err) { next(err); }
};

exports.getEmergencyDoctors = async (req, res, next) => {
    try {
    const docs = await Doctor.find({ approved: true, emergencyAvailable: true });
    res.json(docs);
    } catch (err) { next(err); }
};
