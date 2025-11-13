const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/reportController');
const { auth, permit } = require('../middlewares/auth');

router.post('/upload', auth, permit('patient'), reportCtrl.uploadReport);
router.get('/view/:patientId', auth, permit('patient','doctor','admin'), reportCtrl.viewReports);
router.get('/:reportId', auth, permit('patient','doctor','admin'), reportCtrl.getReport);


module.exports = router;
