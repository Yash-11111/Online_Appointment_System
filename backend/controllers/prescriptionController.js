const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Create prescription (doctor after consultation)
// @route   POST /api/prescriptions
// @access  Doctor
const createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, diagnosis, notes, medicines, followUpDate } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    if (appointment.doctor.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const existing = await Prescription.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Prescription already exists for this appointment' });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: doctorProfile._id,
      patient: appointment.patient,
      diagnosis, notes, medicines, followUpDate
    });

    // Mark appointment as completed
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });

    res.status(201).json({ success: true, message: 'Prescription created', data: prescription });
  } catch (error) { next(error); }
};

// @desc    Get prescription for an appointment
// @route   GET /api/prescriptions/appointment/:appointmentId
// @access  Patient (own) / Doctor / Admin
const getPrescriptionByAppointment = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({ appointment: req.params.appointmentId })
      .populate('doctor', 'specialization')
      .populate('patient', 'name email')
      .populate('appointment');

    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (error) { next(error); }
};

// @desc    Get all prescriptions for logged-in patient
// @route   GET /api/prescriptions/my-prescriptions
// @access  Patient
const getMyPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) { next(error); }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Doctor
const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, message: 'Prescription updated', data: prescription });
  } catch (error) { next(error); }
};

module.exports = { createPrescription, getPrescriptionByAppointment, getMyPrescriptions, updatePrescription };
