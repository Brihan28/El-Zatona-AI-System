const createQuizController = (quizService, attemptService, fileService) => ({
  generateQuiz: async (req, res) => {
    try {
      const file = await fileService.getFileById(req.params.fileId);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      const { type } = req.body;

      const quiz = await quizService.generateQuiz(
        file.extractedText,
        type
      );

      // ✅ IMPORTANT (frontend fix)
      res.json({
        questions: quiz,
        type,
      });

    } catch (err) {
      console.error("QUIZ GENERATE ERROR:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  submitQuiz: async (req, res) => {
    try {
      const { fileId } = req.params;
      const { answers, questions, type } = req.body;

      const result = await attemptService.evaluate({
        user: req.user,
        fileId,
        answers,
        questions,
        type,
      });

      res.json(result);
    } catch (err) {
      console.error("QUIZ SUBMIT ERROR:", err.message);
      res.status(500).json({ error: err.message });
    }
  },
});

module.exports = createQuizController;