const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String }, // e.g. "twice a day"
  duration: { type: String },  // e.g. "7 days"
  instructions: { type: String },
});

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String },
  notes: { type: String },
  medicines: [medicineSchema],
  followUpDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
