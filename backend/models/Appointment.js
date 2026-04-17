const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      trim: true
    },
    doctorId: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    slot: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      default: "Confirmed",
      trim: true
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt (no effect on logic)
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

