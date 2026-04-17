const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  specialization: { type: String, required: true, trim: true },
  experience: { type: Number, default: 0 }, // years
  qualifications: [{ type: String }],
  consultationFee: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
