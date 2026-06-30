const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const File = require("../models/File");
const Attempt = require("../models/Attempt");
const StudyPlan = require("../models/StudyPlan");
const passport = require("passport");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// =======================
// 🔐 REGISTER
// =======================
// =======================
// 🔐 REGISTER (SEND OTP)
// =======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    // Existing verified user
    if (user && user.isVerified) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
      user = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });
    } else {
      // Update existing unverified user
      user.name = name;
      user.password = hashedPassword;
    }

    user.registerOTP = otp;
    user.registerOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome!</h2>
        <p>Your verification code is:</p>

        <h1 style="letter-spacing:5px;">
          ${otp}
        </h1>

        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      msg: "OTP sent successfully.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
    });
  }
});

// =======================
// ✅ VERIFY REGISTER OTP
// =======================
router.post("/verify-register-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      registerOTP: otp,
      registerOTPExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired OTP",
      });
    }

    // Verify account
    user.isVerified = true;
    user.registerOTP = null;
    user.registerOTPExpiry = null;

    await user.save();

    // Login user after verification
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Account verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
    });
  }
});

// =======================
// 🔐 LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    if (!user.isVerified) {
  return res.status(403).json({
    msg: "Please verify your email before logging in.",
  });
}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // ✅ include role
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =======================
// 👤 GET CURRENT USER
// =======================
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // ✅ FIX
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
// =======================
// ✏️ UPDATE PROFILE
// =======================
router.put("/profile", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ msg: "Name is required" });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.name = name.trim();

    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// =======================
// 🔒 CHANGE PASSWORD
// =======================
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(400).json({
        msg: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      msg: "Password changed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
    });
  }
});
// =======================
// 🔑 FORGOT PASSWORD (SEND OTP)
// =======================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        msg: "If an account exists, an OTP has been sent.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
    user.otpVerified = false;

    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your verification code is:</p>

        <h1 style="letter-spacing:5px">
          ${otp}
        </h1>

        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    res.json({
      msg: "OTP sent successfully.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
    });
  }
});


// =======================
// VERIFY OTP
// =======================
router.post("/verify-otp", async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired OTP",
      });
    }

    user.otpVerified = true;

    await user.save();

    res.json({
      msg: "OTP verified successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
    });
  }
});


// =======================
// RESET PASSWORD
// =======================
router.post("/reset-password", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user || !user.otpVerified) {
      return res.status(400).json({
        msg: "OTP verification required",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetOTP = null;
    user.resetOTPExpiry = null;
    user.otpVerified = false;

    await user.save();

    res.json({
      msg: "Password updated successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
    });
  }

});
// =======================
// 🗑 DELETE ACCOUNT
// =======================
router.delete("/delete-account", auth, async (req, res) => {
  try {
    const userId = req.user;

    await File.deleteMany({ user: userId });
    await Attempt.deleteMany({ user: userId });
    await StudyPlan.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// =======================
// GOOGLE LOGIN
// =======================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// =======================
// GOOGLE CALLBACK
// =======================
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:8080/login",
  }),
  async (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `http://localhost:8080/google-success?token=${token}`
    );
  }
);
module.exports = router;