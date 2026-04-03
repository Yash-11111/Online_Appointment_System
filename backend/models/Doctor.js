const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  department: String,
  specialization: String,
  fee: Number,
  available: Boolean
});

module.exports = mongoose.model("Doctor", doctorSchema);