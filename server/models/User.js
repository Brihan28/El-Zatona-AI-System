const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
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
    default: null,   // instead of required: true
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

  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);