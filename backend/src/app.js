const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const healthcardRoutes = require('./routes/healthcardRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/healthcard', healthcardRoutes);

app.get('/', (req, res) => res.json({ message: 'Healthcare Backend Running' }));

// error handler
app.use(errorHandler);

module.exports = app;
