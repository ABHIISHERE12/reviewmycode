const { OpenAI } = require("openai");

class AiService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeCodeDiff(diffContent, promptTemplate) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: promptTemplate.system },
          { role: "user", content: `Here is the git diff:\n\n${diffContent}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2, // Low temperature for consistent analytical output
      });

      const resultText = completion.choices[0].message.content;
      return JSON.parse(resultText);
    } catch (error) {
      console.error("AI Analysis Failed:", error);
      throw new Error("Failed to analyze code diff using AI");
    }
  }
}

module.exports = AiService;
