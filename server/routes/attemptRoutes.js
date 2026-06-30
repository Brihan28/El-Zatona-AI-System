const express = require("express");
const router = express.Router();

const Attempt = require("../models/Attempt");
const auth = require("../middleware/auth");

// =======================
// GET USER ATTEMPTS
// =======================
router.get("/", auth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user })
      .populate("file", "filename")
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

// =======================
// DELETE ATTEMPT
// =======================
router.delete("/:id", auth, async (req, res) => {
  try {
    const attempt = await Attempt.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    res.json({ message: "Attempt deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;