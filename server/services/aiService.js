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
    const prompt = `
Summarize the following text into a ${type} summary.

TEXT:
${text}
`;

    return await callAI(prompt);
  };

  return { callAI, summarize };
};

module.exports = createAIService;