const express = require('express');
const {
  bookAppointment, getMyAppointments, getDoctorAppointments,
  getAllAppointments, cancelAppointment, rescheduleAppointment, updateStatus
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my-appointments', protect, authorize('patient'), getMyAppointments);
router.get('/doctor-appointments', protect, authorize('doctor'), getDoctorAppointments);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/reschedule', protect, authorize('patient'), rescheduleAppointment);
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateStatus);

module.exports = router;
