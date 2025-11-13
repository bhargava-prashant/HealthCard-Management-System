const express = require('express');
const router = express.Router();
const hcCtrl = require('../controllers/healthcardController');
const { auth, permit } = require('../middlewares/auth');

router.post('/generate/:patientId', auth, permit('admin','patient'), hcCtrl.generate);
router.get('/scan/:qrId', hcCtrl.scan);
router.patch('/update/:patientId', auth, permit('admin'), hcCtrl.update);

module.exports = router;
