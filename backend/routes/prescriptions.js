const express = require('express');
const {
  createPrescription, getPrescriptionByAppointment,
  getMyPrescriptions, updatePrescription
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/appointment/:appointmentId', protect, getPrescriptionByAppointment);
router.get('/my-prescriptions', protect, authorize('patient'), getMyPrescriptions);
router.put('/:id', protect, authorize('doctor'), updatePrescription);

module.exports = router;
