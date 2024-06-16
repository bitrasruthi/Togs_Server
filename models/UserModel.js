const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: {
    type: String,
    default: "N/A",
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  emailId: {
    type: String,
    unique: true,
    default: "N/A",
  },
  gender: { type: String, default: "N/A" },
  otp: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: "N/A",
  },
  created_At: {
    type: Date,
    default: Date.now,
  },
});

const Login = mongoose.model("Login", userModel);

module.exports = { Login };
