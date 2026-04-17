const express = require('express');
const { getSlots, createSlots, deleteSlot, getMySlots } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSlots);
router.get('/my-slots', protect, authorize('doctor'), getMySlots);
router.post('/', protect, authorize('doctor'), createSlots);
router.delete('/:id', protect, authorize('doctor', 'admin'), deleteSlot);

module.exports = router;
