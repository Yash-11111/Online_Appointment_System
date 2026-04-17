const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const Doctor = require('../models/Doctor');

// @desc    Book an appointment (atomic, no replica set required)
// @route   POST /api/appointments
// @access  Patient
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, slotId, departmentId, type, reason } = req.body;

    // Atomically mark slot as booked — prevents double booking without a transaction
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, isBooked: false, isActive: true },
      { isBooked: true },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({ success: false, message: 'Slot is no longer available' });
    }

    let appointment;
    try {
      appointment = await Appointment.create([{
        patient: req.user._id,
        doctor: doctorId,
        slot: slotId,
        department: departmentId,
        type: type || 'normal',
        reason,
      }]);
    } catch (createError) {
      // If appointment creation fails, free the slot back
      await Slot.findByIdAndUpdate(slotId, { isBooked: false });
      throw createError;
    }

    const populated = await Appointment.findById(appointment[0]._id)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('slot')
      .populate('department', 'name');

    res.status(201).json({ success: true, message: 'Appointment booked successfully', data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my-appointments
// @access  Patient
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('slot')
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) { next(error); }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Doctor
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const { date, status } = req.query;
    const filter = { doctor: doctorProfile._id };
    if (status) filter.status = status;

    let appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone age gender')
      .populate('slot')
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    // Filter by slot date if needed
    if (date) {
      appointments = appointments.filter(a => a.slot && a.slot.date === date);
    }

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) { next(error); }
};

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
// @access  Admin
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('slot')
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    if (date) {
      appointments = appointments.filter(a => a.slot && a.slot.date === date);
    }

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) { next(error); }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Patient / Doctor / Admin
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled' });
    }

    // Authorization check
    const isPatient = req.user.role === 'patient' && appointment.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor';
    if (!isPatient && !isAdmin && !isDoctor) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    // Free the slot atomically
    await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user.role;
    appointment.cancelReason = req.body.reason || '';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Patient
const rescheduleAppointment = async (req, res, next) => {
  try {
    const { newSlotId } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not your appointment' });
    }

    // Try to book new slot atomically
    const newSlot = await Slot.findOneAndUpdate(
      { _id: newSlotId, isBooked: false, isActive: true },
      { isBooked: true },
      { new: true }
    );

    if (!newSlot) {
      return res.status(409).json({ success: false, message: 'New slot is not available' });
    }

    // Free old slot
    await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });

    appointment.slot = newSlotId;
    appointment.status = 'rescheduled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment rescheduled', data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Doctor/Admin)
// @route   PUT /api/appointments/:id/status
// @access  Doctor / Admin
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Status updated', data: appointment });
  } catch (error) { next(error); }
};

module.exports = {
  bookAppointment, getMyAppointments, getDoctorAppointments,
  getAllAppointments, cancelAppointment, rescheduleAppointment, updateStatus
};
