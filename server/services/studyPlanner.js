const createStudyService = (aiService) => {
  const StudyPlan = require("../models/StudyPlan");
  const File = require("../models/File");
  const Attempt = require("../models/Attempt");

  // =======================
  // CREATE PLAN
  // =======================
  const createPlan = async (user, fileId, examDate, hoursPerDay) => {

    if (!fileId) throw new Error("Please select a file");

    const file = await File.findById(fileId);
    if (!file) throw new Error("File not found");
    if (!file.extractedText) throw new Error("File has no extracted content");

    const lastAttempt = await Attempt.findOne({
      user, // ✅ FIX
      file: fileId,
    }).sort({ createdAt: -1 });

    if (!lastAttempt) {
      throw new Error("No quiz attempts found for this file");
    }

    let weakTopics = lastAttempt.weakTopics || [];
    if (weakTopics.length === 0) {
      weakTopics = ["General Revision"];
    }

    const today = new Date();
    const exam = new Date(examDate);

    const diffTime = exam - today;

    const totalDays = Math.max(
      1,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    );

    const prompt = `
Return ONLY valid JSON array.

STRICT RULES:
- ONLY JSON
- Generate EXACTLY ${totalDays} days
- Each day MUST have EXACTLY ${hoursPerDay} tasks
- Each task MUST be 1h
- Focus ONLY on: ${weakTopics.join(", ")}

CONTENT:
${file.extractedText.slice(0, 3000)}
`;

    const aiResponse = await aiService.callAI(prompt);

    const match = aiResponse.match(/\[.*\]/s);
    if (!match) throw new Error("Bad AI response");

    const parsed = JSON.parse(match[0]);

    const formattedPlan = parsed.map((p, i) => ({
      day: p.day || `Day ${i + 1}`,
      tasks:
        Array.isArray(p.tasks) && p.tasks.length > 0
          ? p.tasks
          : [`Study ${weakTopics[0]} (${hoursPerDay}h)`],
    }));

    const progress = formattedPlan.map((d) => ({
      day: d.day,
      completed: false,
    }));

    const saved = await StudyPlan.create({
      user,
      file: fileId,
      weakTopics,
      examDate,
      hoursPerDay,
      plan: formattedPlan,
      progress,
    });

    return saved;
  };

  // =======================
  // GET PLANS
  // =======================
  const getPlans = async (user) => {


    return await StudyPlan.find({ user }) // ✅ FIX
      .populate("file");
  };

  // =======================
  // MARK DAY
  // =======================
  const markDay = async (planId, index) => {
    const plan = await StudyPlan.findOne({
    _id: planId,
    user,
});
    if (!plan) throw new Error("Plan not found");

    plan.progress[index].completed = true;
    await plan.save();

    return plan;
  };

  // =======================
  // DELETE
  // =======================
  const deletePlan = async (planId) => {
    return await StudyPlan.findOne({
    _id: planId,
    user,
});
  };

  return {
    createPlan,
    getPlans,
    markDay,
    deletePlan,
  };
};

module.exports = createStudyService;