const Appointment = require("../models/Appointment");

// BOOK APPOINTMENT
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, slot } = req.body;

    // 🔥 CHECK: prevent double booking
    const exists = await Appointment.findOne({ doctorId, date, slot });

    if (exists) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    // ✅ Create appointment
    const appointment = new Appointment(req.body);
    await appointment.save();

    res.status(201).json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  const data = await Appointment.find();
  res.json(data);
};

exports.cancelAppointment = async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, {
    status: "Cancelled"
  });

  res.json({ message: "Cancelled" });
};