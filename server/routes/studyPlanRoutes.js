const express = require("express");

module.exports = (studyController, auth) => {
  const router = express.Router();

  router.post("/:fileId", auth, studyController.createPlan);

  router.get("/", auth, studyController.getPlans);

  router.patch(
    "/:planId/:dayIndex",
    auth,
    studyController.markDay
  );

  router.delete("/:planId", auth, studyController.deletePlan);

  return router;
};