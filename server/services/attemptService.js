const Attempt = require("../models/Attempt");

const createAttemptService = () => ({
  // =======================
  // GET LAST ATTEMPT
  // =======================
  getLastAttempt: (user, fileId) =>
    Attempt.findOne({ user, file: fileId }).sort({ createdAt: -1 }),

  // =======================
  // EVALUATE QUIZ
  // =======================
  evaluate: async ({ user, fileId, answers, questions, type }) => {
    const userId = user; // ✅ ALWAYS STRING

    let correct = 0;
    let weakTopics = [];

    questions.forEach((q, i) => {
      const userAns = (answers[i] || "").toLowerCase().trim();
      const real = q.answer.toLowerCase().trim();

      if (userAns === real) correct++;
      else if (q.topic) weakTopics.push(q.topic);
    });

    const total = questions.length;
    const percentage = (correct / total) * 100;

    weakTopics = [...new Set(weakTopics)];

    await Attempt.create({
      user: userId, // ✅ FIXED
      file: fileId,
      quizType: type,
      questions,
      answers,
      score: correct,
      total,
      percentage,
      weakTopics,
    });

    return { correct, total, percentage, weakTopics };
  },
});

module.exports = createAttemptService;