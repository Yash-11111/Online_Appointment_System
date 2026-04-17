const Slot = require('../models/Slot');
const Doctor = require('../models/Doctor');

// @desc    Get available slots for a doctor on a date
// @route   GET /api/slots?doctor=id&date=YYYY-MM-DD
// @access  Public
const getSlots = async (req, res, next) => {
  try {
    const { doctor, date } = req.query;
    if (!doctor || !date) {
      return res.status(400).json({ success: false, message: 'doctor and date query params are required' });
    }

    const slots = await Slot.find({ doctor, date, isActive: true }).sort('startTime');
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) { next(error); }
};

// @desc    Create slots for a day (doctor sets availability)
// @route   POST /api/slots
// @access  Doctor
const createSlots = async (req, res, next) => {
  try {
    const { date, slots: slotTimes } = req.body;
    // slotTimes: [{ startTime: "09:00", endTime: "09:30" }, ...]

    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const toInsert = slotTimes.map(s => ({
      doctor: doctorProfile._id,
      date,
      startTime: s.startTime,
      endTime: s.endTime,
    }));

    // Insert many — ignore duplicates
    const results = await Slot.insertMany(toInsert, { ordered: false }).catch(err => {
      if (err.code === 11000) return err.insertedDocs || [];
      throw err;
    });

    res.status(201).json({
      success: true,
      message: `${Array.isArray(results) ? results.length : 0} slot(s) created`,
      data: results
    });
  } catch (error) { next(error); }
};

// @desc    Delete (deactivate) a slot
// @route   DELETE /api/slots/:id
// @access  Doctor / Admin
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

    if (slot.isBooked) {
      return res.status(400).json({ success: false, message: 'Cannot delete a booked slot' });
    }

    slot.isActive = false;
    await slot.save();
    res.json({ success: true, message: 'Slot removed' });
  } catch (error) { next(error); }
};

// @desc    Get all slots for a doctor (doctor dashboard)
// @route   GET /api/slots/my-slots
// @access  Doctor
const getMySlots = async (req, res, next) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const { date } = req.query;
    const filter = { doctor: doctorProfile._id, isActive: true };
    if (date) filter.date = date;

    const slots = await Slot.find(filter).sort({ date: 1, startTime: 1 });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) { next(error); }
};

module.exports = { getSlots, createSlots, deleteSlot, getMySlots };
