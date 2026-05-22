const { GoogleGenAI, Type } = require("@google/genai");

class AiService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async analyzeCodeDiff(diffContent, promptTemplate) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${promptTemplate.system}\n\nHere is the git diff:\n\n${diffContent}` }],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2, // Low temperature for consistent analytical output
        },
      });

      const resultText = response.text();
      return JSON.parse(resultText);
    } catch (error) {
      console.error("AI Analysis Failed:", error);
      throw new Error("Failed to analyze code diff using AI");
    }
  }
}

module.exports = AiService;
