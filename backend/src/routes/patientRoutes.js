const express = require('express');
const router = express.Router();
const patientCtrl = require('../controllers/patientController');
const { auth, permit } = require('../middlewares/auth');

router.get('/profile', auth, permit('patient'), patientCtrl.getProfile);
router.put('/profile', auth, permit('patient'), patientCtrl.updateProfile);
router.post('/upload-photo', auth, permit('patient'), patientCtrl.uploadPhoto);
router.get('/medical-history', auth, permit('patient'), patientCtrl.getMedicalHistory);
router.get('/health-card', auth, permit('patient'), patientCtrl.getHealthCard);

module.exports = router;
