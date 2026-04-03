const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const loginUser = authController.login;
const registerUser = authController.register;

router.post("/login", (req, res, next) => {
    return loginUser(req, res, next);
});

router.post("/register", (req, res, next) => {
    return registerUser(req, res, next);
});

module.exports = router;