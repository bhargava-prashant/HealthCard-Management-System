const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { auth, permit } = require('../middlewares/auth');

router.use(auth, permit('admin'));

router.patch('/approve/doctor/:id', adminCtrl.approveDoctor);
router.patch('/approve/patient/:id', adminCtrl.approvePatient);
router.get('/get/doctors', adminCtrl.getDoctors);
router.get('/get/patients', adminCtrl.getPatients);
router.get('/get/doctor/:id', adminCtrl.getDoctorById);
router.get('/get/patient/:id', adminCtrl.getPatientById);
router.put('/edit/doctor/:id', adminCtrl.editDoctor);
router.put('/edit/patient/:id', adminCtrl.editPatient);
router.delete('/delete/doctor/:id', adminCtrl.deleteDoctor);
router.delete('/delete/patient/:id', adminCtrl.deletePatient);
router.get('/appointments', adminCtrl.getAppointments);
router.get('/appointments/:id', adminCtrl.getUserAppointments);

module.exports = router;
