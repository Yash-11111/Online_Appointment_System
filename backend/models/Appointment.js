const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  type: { type: String, enum: ['normal', 'emergency'], default: 'normal' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'confirmed'
  },
  reason: { type: String, trim: true },
  notes: { type: String }, // admin/doctor notes
  cancelledBy: { type: String, enum: ['patient', 'doctor', 'admin'] },
  cancelReason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
