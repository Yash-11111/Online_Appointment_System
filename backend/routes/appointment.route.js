const express = require("express");

const router = express.Router();

const appointmentController = require("../controllers/appointmentController");
const bookAppointment = appointmentController.bookAppointment;

router.post("/", (req, res, next) => {
    return bookAppointment(req, res, next);
});

module.exports = router;