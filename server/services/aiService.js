const createAIService = (axiosInstance, config) => {
  const callAI = async (prompt) => {
    const res = await axiosInstance.post(
      config.baseUrl,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );

    return res.data.choices[0].message.content;
  };

  // ✅ ADD THIS (FIX ERROR)
 const summarize = async (text, type) => {
  let instructions = "";

  switch (type) {
    case "short":
      instructions = `
- Keep the summary between 100 and 150 words.
- Include only the most important concepts.
- Use 4-6 concise bullet points.
- Do NOT include detailed explanations.
`;
      break;

    case "medium":
      instructions = `
- Keep the summary between 250 and 350 words.
- Organize into clear sections with headings.
- Use bullet points for key ideas.
- Add brief explanations where necessary.
`;
      break;

    case "long":
      instructions = `
- Keep the summary between 500 and 700 words.
- Organize into multiple sections with descriptive headings.
- Explain important concepts thoroughly.
- Use bullet points where appropriate.
- Include examples if they are mentioned in the original text.
`;
      break;

    default:
      instructions = `
- Create a clear, well-structured summary.
`;
  }

  const prompt = `
You are an expert academic assistant.

Your task is to create a professional study summary from the following document.

Requirements:
${instructions}

Formatting Rules:
- Start with a title: "# Summary"
- Divide the summary into logical sections using headings (##).
- Use bullet points for lists and important facts.
- Use short paragraphs to explain complex concepts.
- Preserve technical terms and important definitions.
- Do not invent information that is not present in the text.
- Do not repeat the same idea.
- Write in clear academic English suitable for university students.
- Focus only on the essential information.

Document:
"""
${text}
"""
`;

  return await callAI(prompt);
};

  return { callAI, summarize };
};

module.exports = createAIService;