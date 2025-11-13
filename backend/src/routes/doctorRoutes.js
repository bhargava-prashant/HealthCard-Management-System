const express = require('express');
const router = express.Router();
const doctorCtrl = require('../controllers/doctorController');
const { auth, permit } = require('../middlewares/auth');

router.get('/profile/:id', auth, permit('doctor','admin'), doctorCtrl.getProfile);
router.put('/profile/:id', auth, permit('doctor','admin'), doctorCtrl.updateProfile);
router.get('/patients', auth, permit('doctor','admin'), doctorCtrl.getPatients);
router.get('/appointments', auth, permit('doctor','admin'), doctorCtrl.getAppointments);
router.post('/upload-report/:patientId', auth, permit('doctor'), doctorCtrl.uploadReport);
router.get('/unapporved-reports/:patientId', auth, permit('doctor', "patient", "admin"), doctorCtrl.getUnapporvedReports);
router.post('/prescribe/:patientId', auth, permit('doctor'), doctorCtrl.prescribe);
router.patch('/approve-report/:reportId', auth, permit('doctor'), doctorCtrl.approveReport);
router.get('/get-prescription/:patientId', auth, permit('patient','doctor','admin'), doctorCtrl.getPrescriptions)

module.exports = router;
