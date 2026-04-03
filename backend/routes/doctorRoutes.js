const express = require("express");
const router = express.Router();

// dummy route for now
router.get("/", (req, res) => {
  res.json({ message: "Doctor route working" });
});
const { getDoctors } = require("../controllers/doctorController");

router.get("/", getDoctors);
module.exports = router;