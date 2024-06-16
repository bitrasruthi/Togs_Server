const { Router } = require("express");

const {
  sendOtp,
  verifyOtp,
  registerUser,
  verifyRegistrationCode,
} = require("../controllers/AccountController.");

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);


module.exports = router;
