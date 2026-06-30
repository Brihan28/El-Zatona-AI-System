const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  quizType: String,
  questions: Array,
  answers: Array,
  score: Number,
  total: Number,
  percentage: Number,
  weakTopics: [String],
}, { timestamps: true });

module.exports = mongoose.model("Attempt", attemptSchema);