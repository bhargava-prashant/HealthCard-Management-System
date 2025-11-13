const Patient=require('../models/Patient');
const Doctor=require('../models/Doctor');
const Appointment = require('../models/Appointment');

exports.approveDoctor=async(req, res,next)=>{
    try {
        const {id}=req.params;
        const{approve}=req.body;
        const doctor=await Doctor.findByIdAndUpdate(id,{approved: !!approve},{new:true});
        if(!doctor) return res.status(404).json({message:'doctor not found'});
        res.json({message:`doctor ${approve ? 'approved' : 'disapproved' } successfully`, doctor});
    } catch (error) {
        next(error);
    }
};

exports.approvePatient=async(req, res, next)=>{
    try {
        const {id}=req.params;
        const {approve}=req.body;
        const pat=await Patient.findByIdAndUpdate(id, {isApproved:true},{new:true});
        if(!pat) return res.status(404).json({message:'patient not found'});
        res.json({message:`patient approved successfully`, pat});

    } catch (error) {
        next(error);
    }
};

exports.getDoctors = async (req, res, next) => {
    try {
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (err) { next(err); }
  };
  
  exports.getPatients = async (req, res, next) => {
    try {
      const patients = await Patient.find();
      res.json(patients);
    } catch (err) { next(err); }
  };
  
  exports.getDoctorById = async (req, res, next) => {
    try {
      const doc = await Doctor.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Doctor not found' });
      res.json(doc);
    } catch (err) { next(err); }
  };
  
  exports.getPatientById = async (req, res, next) => {
    try {
      const pat = await Patient.findById(req.params.id);
      if (!pat) return res.status(404).json({ message: 'Patient not found' });
      res.json(pat);
    } catch (err) { next(err); }
  };
  
  exports.editDoctor = async (req, res, next) => {
    try {
      const updates = req.body;
      const doc = await Doctor.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!doc) return res.status(404).json({ message: 'Doctor not found' });
      res.json(doc);
    } catch (err) { next(err); }
  };
  
  exports.editPatient = async (req, res, next) => {
    try {
      const updates = req.body;
      const pat = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!pat) return res.status(404).json({ message: 'Patient not found' });
      res.json(pat);
    } catch (err) { next(err); }
  };
  
  exports.deleteDoctor = async (req, res, next) => {
    try {
      await Doctor.findByIdAndDelete(req.params.id);
      res.json({ message: 'Doctor deleted' });
    } catch (err) { next(err); }
  };
  
  exports.deletePatient = async (req, res, next) => {
    try {
      await Patient.findByIdAndDelete(req.params.id);
      res.json({ message: 'Patient deleted' });
    } catch (err) { next(err); }
  };

  exports.getAppointments = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query; // default: page 1, 10 items per page
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch all appointments
        const appointments = await Appointment.find()
            .populate('patientId', 'name aadhaar')
            .populate('doctorId', 'name specialization') // optional: doctor info
            .sort({ date: -1 }) // latest first
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Appointment.countDocuments();

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            appointments
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserAppointments = async (req, res, next) => {
  try {
      const { page = 1, limit = 10, patientId, doctorId } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Dynamic filter based on role
      const filter = {};

      if (req.user.role === 'admin') {
          // Admin can filter by query params
          if (patientId) filter.patientId = patientId;
          if (doctorId) filter.doctorId = doctorId;
      }

      const appointments = await Appointment.find(filter)
          .populate('patientId', 'name aadhaar')
          .populate('doctorId', 'name specialization')
          .sort({ date: -1 })
          .skip(skip)
          .limit(parseInt(limit));

      const total = await Appointment.countDocuments(filter);

      res.json({
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          appointments
      });
  } catch (error) {
      next(error);
  }
};





