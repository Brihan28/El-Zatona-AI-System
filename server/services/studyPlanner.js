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
You are an expert academic study planner.

Your task is to create a realistic and balanced study schedule based ONLY on the provided lecture content and the student's weak topics.

IMPORTANT RULES:
- Return ONLY a valid JSON array.
- Do NOT include markdown.
- Do NOT include explanations.
- Do NOT wrap the JSON inside \`\`\`.
- Generate EXACTLY ${totalDays} study days.
- Each day MUST contain EXACTLY ${hoursPerDay} study tasks.
- Assume each task represents approximately one hour of study.
- Focus primarily on these weak topics:
${weakTopics.join(", ")}
- If there is remaining time, include revision of important concepts from the lecture.
- Distribute the workload evenly across all days.
- Avoid repeating the exact same task unless necessary.
- Begin with foundational concepts before advanced ones.
- Reserve the final day for comprehensive revision and self-testing.
- Use concise, actionable task descriptions.

Return the JSON in this exact format:

[
  {
    "day": "Day 1",
    "tasks": [
      "Study Topic A",
      "Practice Topic A",
      "Review Topic B"
    ]
  }
]

LECTURE CONTENT:
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
const markDay = async (userId, planId, index) => {
  const plan = await StudyPlan.findOne({
    _id: planId,
    user: userId,
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  if (index < 0 || index >= plan.progress.length) {
    throw new Error("Invalid day index");
  }

plan.progress[index].completed = !plan.progress[index].completed;

plan.markModified("progress");

await plan.save();

return await StudyPlan.findById(planId);

  return plan;
};

  // =======================
  // DELETE
  // =======================
const deletePlan = async (userId, planId) => {
  const deleted = await StudyPlan.findOneAndDelete({
    _id: planId,
    user: userId,
  });

  if (!deleted) {
    throw new Error("Study plan not found");
  }

  return deleted;
};

  return {
    createPlan,
    getPlans,
    markDay,
    deletePlan,
  };
};

module.exports = createStudyService;