const express= require('express');
const router=express.Router();
const authCtrl= require('../controllers/authController');
const {auth} = require('../middlewares/auth');

router.post('/patient/signup', authCtrl.patientSignup);
router.post('/patient/login', authCtrl.patientLogin);
router.post('/doctor/signup', authCtrl.doctorSignup);
router.post('/doctor/login', authCtrl.doctorLogin);
router.post('/admin/login', authCtrl.adminLogin);
router.post('/logout', auth, authCtrl.logout);
router.get('/verify-token', auth, authCtrl.verifyToken);

module.exports = router;