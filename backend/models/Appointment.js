const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: String,
  doctorId: String,
  date: String,
  slot: String,
  status: { type: String, default: "Confirmed" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);