const axios = require("axios");

const generateAIResponse = async (message) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: `
You are a helpful and professional customer support assistant.

Rules:
- Give clear, concise, and friendly responses.
- Never invent company policies, prices, phone numbers, order information, refunds, guarantees, or contact details.
- If you don't have enough information to answer a customer-specific question, clearly say what information is needed.
- Do not claim that you performed an action unless the system actually performed it.
- Do not make up tracking information or account details.
- For general questions, provide useful general guidance.
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI service error:", error.response?.data || error.message);

    const status = error.response?.status;

    if (status === 401) {
      throw new Error("AI service authentication failed");
    }

    if (status === 429) {
      throw new Error("AI service rate limit reached");
    }

    if (status === 404) {
      throw new Error("AI model is currently unavailable");
    }

    throw new Error("AI service temporarily unavailable");
  }
};

module.exports = {
  generateAIResponse,
};
