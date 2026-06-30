const express = require("express");

module.exports = (summaryController) => {
  const router = express.Router();

  router.post("/generate", summaryController.generateSummary);

  return router;
};