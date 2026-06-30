const createSummaryController = (aiService) => ({
  generateSummary: async (req, res) => {
    try {
      const { text, type } = req.body;

      const result = await aiService.summarize(text, type);

      res.send(result); // streaming optional later
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
});

module.exports = createSummaryController;