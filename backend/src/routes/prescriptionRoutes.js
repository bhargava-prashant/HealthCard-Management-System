const express = require('express');
const router = express.Router();
const presCtrl = require('../controllers/prescriptionController');
const { auth, permit } = require('../middlewares/auth');

// Order matters — most specific routes first
router.get('/current/:patientId', auth, permit('patient','doctor','admin'), presCtrl.currentMedicines);
router.get('/history/:patientId', auth, permit('patient','doctor','admin'), presCtrl.getHistory);
router.get('/:prescriptionId', auth, permit('patient','doctor','admin'), presCtrl.getPrescriptionById);

module.exports = router;
