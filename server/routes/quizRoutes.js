const express = require("express");

module.exports = (quizController, auth) => {
  const router = express.Router();

  router.post("/:fileId", auth, quizController.generateQuiz);

  router.post("/submit/:fileId", auth, quizController.submitQuiz);

  return router;
};