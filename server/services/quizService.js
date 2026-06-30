const createQuizService = (aiService) => {
  const generateQuiz = async (text, type = "mcq") => {
    try {
      const cleaned = text
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 3000);

      const prompt = `
Generate 5 quiz questions.

STRICT RULES:
- Return ONLY JSON array
- No explanation
- No text outside JSON

FORMAT:
[
{
"question":"string",
"options":["string","string","string","string"],
"answer":"string",
"topic":"string"
}
]

TYPE: ${type}

${type === "mcq" ? `
- MUST include exactly 4 options
- Answer MUST match one option
` : ""}

${type === "tf" ? `
- options MUST be ["True","False"]
- answer MUST be "True" or "False"
` : ""}

${type === "short" ? `
- DO NOT include options
- Answer must be 1–5 words
` : ""}

TEXT:
${cleaned}
`;

      const result = await aiService.callAI(prompt);

      const match = result.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Bad AI response");

      let parsed = JSON.parse(match[0]);

      // ✅ FIX missing options
      if (type === "mcq") {
        parsed = parsed.map((q) => ({
          ...q,
          options:
            Array.isArray(q.options) && q.options.length === 4
              ? q.options
              : ["A", "B", "C", "D"],
        }));
      }

      if (type === "tf") {
        parsed = parsed.map((q) => ({
          ...q,
          options: ["True", "False"],
        }));
      }

      return parsed;

    } catch (err) {
      console.error("QUIZ SERVICE ERROR:", err.message);
      throw err;
    }
  };

  return { generateQuiz };
};

module.exports = createQuizService;