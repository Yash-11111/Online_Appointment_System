const express = require("express");

const router = express.Router();

const doctorController = require("../controllers/doctorController");

const fetchDoctors = doctorController.getDoctors;

router.get("/", (req, res, next) => {
    return fetchDoctors(req, res, next);
});

module.exports = router;