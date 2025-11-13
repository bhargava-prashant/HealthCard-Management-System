const express = require('express');
const router = express.Router();
const apptCtrl = require('../controllers/appointmentController');
const { auth, permit } = require('../middlewares/auth');

router.post('/book', auth, permit('patient'), apptCtrl.bookAppointment);
router.delete('/cancel/:appointmentId', auth, permit('patient','doctor','admin'), apptCtrl.cancelAppointment);
router.patch('/reschedule/:appointmentId', auth, permit('patient','doctor','admin'), apptCtrl.rescheduleAppointment);
router.get('/get/patient/:patientId', auth, permit('patient','doctor','admin'), apptCtrl.getPatientAppointments);
router.get('/get/doctor/:doctorId', auth, permit('doctor','admin'), apptCtrl.getDoctorAppointments);
router.get('/emergency', apptCtrl.getEmergencyDoctors);
router.get('/:appointmentId', auth, permit('patient','doctor','admin'), apptCtrl.getAppointmentById);

module.exports = router;
