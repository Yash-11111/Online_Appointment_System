const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors (optionally filter by department)
// @route   GET /api/doctors?department=id
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.department) filter.department = req.query.department;

    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone gender')
      .populate('department', 'name');

    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) { next(error); }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone gender')
      .populate('department', 'name description');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) { next(error); }
};

// @desc    Create doctor profile (admin creates user + doctor profile)
// @route   POST /api/doctors
// @access  Admin
const createDoctor = async (req, res, next) => {
  try {
    const {
      name, email, password, phone, gender,
      department, specialization, experience,
      qualifications, consultationFee, bio
    } = req.body;

    // Create user account with role doctor
    const user = await User.create({ name, email, password, role: 'doctor', phone, gender });

    // Create doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      department, specialization, experience,
      qualifications, consultationFee, bio
    });

    const populated = await Doctor.findById(doctor._id)
      .populate('user', 'name email phone gender')
      .populate('department', 'name');

    res.status(201).json({ success: true, message: 'Doctor created successfully', data: populated });
  } catch (error) { next(error); }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Admin
const updateDoctor = async (req, res, next) => {
  try {
    const { name, phone, gender, ...doctorFields } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Update user fields if provided
    if (name || phone || gender) {
      await User.findByIdAndUpdate(doctor.user, { name, phone, gender });
    }

    // Update doctor profile
    const updated = await Doctor.findByIdAndUpdate(req.params.id, doctorFields, { new: true, runValidators: true })
      .populate('user', 'name email phone gender')
      .populate('department', 'name');

    res.json({ success: true, message: 'Doctor updated', data: updated });
  } catch (error) { next(error); }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Admin
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isAvailable: false }, { new: true });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor removed from availability' });
  } catch (error) { next(error); }
};

// @desc    Get doctor's own profile
// @route   GET /api/doctors/profile/me
// @access  Doctor
const getMyProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'name email phone gender')
      .populate('department', 'name');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, data: doctor });
  } catch (error) { next(error); }
};

module.exports = { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor, getMyProfile };
