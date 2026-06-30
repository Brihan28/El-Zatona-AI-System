const createStudyController = (studyService) => ({
  createPlan: async (req, res) => {
    try {
      const { examDate, hoursPerDay } = req.body;

      const plan = await studyService.createPlan(
        req.user,
        req.params.fileId,
        examDate,
        hoursPerDay
      );

      res.json(plan);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  getPlans: async (req, res) => {
    try {
      const plans = await studyService.getPlans(req.user);
      res.json(plans);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  markDay: async (req, res) => {
    try {
      const updated = await studyService.markDay(
  req.user,
  req.params.planId,
  req.params.dayIndex
);

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletePlan: async (req, res) => {
    try {
await studyService.deletePlan(req.user, req.params.planId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
});

module.exports = createStudyController;