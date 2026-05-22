const { connection } = require("../jobs/queue");

// Only start the worker if Redis is available
if (!connection) {
  console.warn("[Worker] Redis not available — AI analysis worker is disabled.");
  module.exports = null;
} else {
  const { Worker } = require("bullmq");
  const AiService = require("../services/aiService");
  const GithubService = require("../services/githubService");
  const PullRequest = require("../models/PullRequest");
  const Review = require("../models/Review");
  const User = require("../models/User");
  const Repository = require("../models/Repository");
  const { codeReviewPrompt } = require("../prompts/aiPrompts");

  const aiService = new AiService();

  const aiWorker = new Worker(
    "ai-analysis",
    async (job) => {
      const { prId, userId } = job.data;
      console.log(`[Worker] Started processing PR ${prId} for User ${userId}`);

      try {
        const pr = await PullRequest.findById(prId).populate("repository");
        const user = await User.findById(userId);

        if (!pr || !user) {
          throw new Error("PR or User not found");
        }

        pr.analysisStatus = "analyzing";
        await pr.save();

        // Fetch the diff from GitHub
        const githubService = new GithubService(user.githubAccessToken);
        const diffContent = await githubService.getPullRequestDiff(
          pr.repository.owner,
          pr.repository.name,
          pr.number
        );

        // Send to Gemini AI
        console.log(`[Worker] Sending diff to AI for PR ${pr.number}...`);
        const analysisResult = await aiService.analyzeCodeDiff(
          diffContent,
          codeReviewPrompt
        );

        // Save review result
        const review = await Review.create({
          repository: pr.repository._id,
          pullRequest: pr._id,
          summary: analysisResult.summary,
          score: analysisResult.score,
          findings: analysisResult.findings,
        });

        // Update PR status
        pr.analysisStatus = "completed";
        pr.riskScore = 100 - analysisResult.score;
        await pr.save();

        // Update Repository health score
        const repo = await Repository.findById(pr.repository._id);
        repo.healthScore = Math.floor((repo.healthScore + analysisResult.score) / 2);
        await repo.save();

        console.log(`[Worker] Completed analysis for PR ${prId}. Review ID: ${review._id}`);
        return review._id;
      } catch (error) {
        console.error(`[Worker] Error processing PR ${prId}:`, error.message);
        try {
          const pr = await PullRequest.findById(prId);
          if (pr) {
            pr.analysisStatus = "failed";
            await pr.save();
          }
        } catch (e) {
          console.error("Failed to update PR status to failed");
        }
        throw error;
      }
    },
    { connection }
  );

  aiWorker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  aiWorker.on("failed", (job, err) => {
    console.log(`[Worker] Job ${job?.id} failed with error ${err.message}`);
  });

  console.log("[Worker] AI analysis worker started.");
  module.exports = aiWorker;
}
