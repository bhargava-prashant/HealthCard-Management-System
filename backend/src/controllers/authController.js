const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const Patient=require('../models/Patient')
const Doctor=require('../models/Doctor');
const Admin=require('../models/Admin');

const generateToken=(payload)=>jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

exports.patientSignup=async(req, res, next)=>{
    try {
        const {aadhaar, email, name, password}=req.body;
        if(!aadhaar || !password|| !email) return res.status(400).json({message:"adhaar and password required"});

        const existing=await Patient.findOne({aadhaar});
        if(existing) return res.status(400).json({message:'patient  already registered'});

        const hashed=await bcrypt.hash(password, 10);
        const p=await Patient.create({aadhaar, name , email, password: hashed});
        res.status(201).json({message:'patient registered successfully'});

        } catch (error) {
        next(error);
    }
};

exports.patientLogin=async (req, res, next)=>{
    try {
        const {email, password}=req.body;
        const patient=await Patient.findOne({email});
        if(!patient) return res.status(400).json({message:'invalid email or password'});

        const match=await bcrypt.compare(password, patient.password);
        if(!match) return req.status(401).json({message:"invalid credentials"});
        if(!patient.isApproved) return res.status(403).json({message:"patient not approved"});
        const token = generateToken({id:patient._id, role:'patient'});
        res.json({token, user: {id: patient._id, name:patient.name}});

    } catch (error) {
        next(error);
    }
};


exports.doctorSignup = async (req, res, next) => {
    try {
      let { name, email, password, specialization, timings, emergencyAvailable, phone, day } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
  
      // Normalize and validate the day
      if (typeof day === "string") {
        day = day.toLowerCase().trim();
      } else if (Array.isArray(day)) {
        // If user accidentally sends multiple days like ["Monday","Tuesday"]
        day = day.map(d => d.toLowerCase().trim());
      } else {
        return res.status(400).json({ message: "Invalid day format — send a string or array of days." });
      }
  
      const exists = await Doctor.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Doctor already registered" });
      }
  
      const hashed = await bcrypt.hash(password, 10);
  
      const doctor = await Doctor.create({
        name,
        email,
        password: hashed,
        specialization,
        timings,
        emergencyAvailable,
        phone,
        day
      });
  
      res.status(201).json({
        message: "Doctor registered successfully",
        doctor
      });
    } catch (error) {
      next(error);
    }
  };
  

exports.doctorLogin=async(req, res,next)=>{
    try {
        const {email, password}=req.body;
        const doctor=await Doctor.findOne({email});
        if(!doctor) return res.status(401).json({message:'doctor not found'});
        const match=await bcrypt.compare(password, doctor.password);
        if(!match) return res.status(401).json({message:'invalid credentials'});
        if(!doctor.approved) return res.status(403).json({message:'doctor not approved'});
        const token=generateToken({id:doctor._id, role:'doctor'});
        res.json({token, user:{id:doctor._id, name:doctor.name}});
    } catch (error) {
        next(error);
    }
};

exports.adminLogin = async (req, res, next) => {
        try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await admin.matchPassword(password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken({ id: admin._id, role: 'admin' });
        res.json({ token });
        } catch (err) { next(err); }
    };

exports.logout = (req, res) => {
    // If using JWT stateless, client simply discards token.
    res.json({ message: 'Logged out (client should discard token)' });
};

exports.verifyToken = (req, res) => {
    res.json({ ok: true, user: req.user });
};

