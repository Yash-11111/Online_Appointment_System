const express = require('express');
const {
  getDoctors, getDoctor, createDoctor,
  updateDoctor, deleteDoctor, getMyProfile
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDoctors);
router.get('/profile/me', protect, authorize('doctor'), getMyProfile);
router.get('/:id', getDoctor);
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
