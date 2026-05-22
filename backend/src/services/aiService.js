const { GoogleGenAI } = require("@google/genai");

// Retry helper with exponential backoff for transient API errors (503, 429)
const withRetry = async (fn, retries = 3, delayMs = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err?.status === 503 || err?.status === 429;
      if (!isRetryable || attempt === retries) throw err;
      const wait = delayMs * Math.pow(2, attempt - 1);
      console.warn(`[AI] Attempt ${attempt} failed (${err?.status}). Retrying in ${wait}ms...`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
};

class AiService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async analyzeFile(filename, diffContent, repoContext = "") {
    try {
      const enhancedPrompt = `
You are a senior staff software engineer and repository auditor.
Review the following specific file changes.

File: ${filename}

Repository Context:
${repoContext}

Git Patch (Diff):
${diffContent}

Analyze this file for:
1. JavaScript/React/Node.js best practices
2. Security vulnerabilities
3. Performance bottlenecks
4. Maintainability and duplicate logic
5. Naming conventions and error handling

Return STRICT JSON ONLY.

Required JSON structure:
{
  "issues": [
    {
      "issue": "Description of the issue",
      "severity": "low|medium|high|critical",
      "suggestion": "How to fix it"
    }
  ],
  "suggestions": [
    "General suggestion 1",
    "General suggestion 2"
  ]
}
`;

      const response = await withRetry(() =>
        this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [{ text: enhancedPrompt }],
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
        })
      );

      // .text is a getter property in @google/genai, NOT a method
      const resultText = response.text;

      let parsedResult;
      try {
        parsedResult = JSON.parse(resultText);
      } catch (jsonError) {
        console.error("Invalid JSON returned by Gemini for file " + filename + ":");
        console.error(resultText);
        parsedResult = { issues: [], suggestions: [] };
      }

      return parsedResult;
    } catch (error) {
      console.error("AI File Analysis Failed for " + filename + ":");
      console.error(error);
      return { issues: [], suggestions: [] };
    }
  }

  async generateSummary(fileReviews, repoContext = "") {
    try {
      const enhancedPrompt = `
You are a senior staff software engineer and repository auditor.
You are given a list of file-by-file AI reviews for a Pull Request.

Repository Context:
${repoContext}

File Reviews:
${JSON.stringify(fileReviews)}

Based on these individual file reviews, generate a comprehensive repository review summary.
Calculate appropriate scores (0-100) based on the severity and number of issues found.
If there are critical security issues, securityScore should drop significantly.

Return STRICT JSON ONLY.

Required JSON structure:
{
  "overallScore": 0,
  "securityScore": 0,
  "performanceScore": 0,
  "architectureScore": 0,
  "maintainabilityScore": 0,
  "summary": "A detailed 2-3 paragraph summary of the overall code quality and changes.",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "criticalIssues": [
    {
      "severity": "critical|high|medium|low",
      "issue": "Description",
      "impact": "Impact",
      "fix": "Fix"
    }
  ]
}
`;

      const response = await withRetry(() =>
        this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [{ text: enhancedPrompt }],
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
        })
      );

      // .text is a getter property in @google/genai, NOT a method
      const resultText = response.text;

      let parsedResult;
      try {
        parsedResult = JSON.parse(resultText);
      } catch (jsonError) {
        console.error("Invalid JSON returned by Gemini for summary:");
        console.error(resultText);
        parsedResult = {
          overallScore: 0,
          securityScore: 0,
          performanceScore: 0,
          architectureScore: 0,
          maintainabilityScore: 0,
          summary: "AI returned invalid JSON response for summary",
          strengths: [],
          criticalIssues: [],
          improvements: [],
        };
      }

      return parsedResult;
    } catch (error) {
      console.error("AI Summary Analysis Failed:");
      console.error(error);
      throw new Error("Failed to generate code diff summary using AI");
    }
  }
}

module.exports = AiService;
