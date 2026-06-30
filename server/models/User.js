const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =======================
    // Registration OTP
    // =======================
    registerOTP: {
      type: String,
      default: null,
    },

    registerOTPExpiry: {
      type: Date,
      default: null,
    },

    // =======================
    // Password Reset OTP
    // =======================
    resetOTP: {
      type: String,
      default: null,
    },

    resetOTPExpiry: {
      type: Date,
      default: null,
    },

    // =======================
    // Email Verification
    // =======================
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpVerified: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);