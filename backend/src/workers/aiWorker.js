const { connection } = require("../jobs/queue");
const AiService = require("../services/aiService");
const GithubService = require("../services/githubService");
const PullRequest = require("../models/PullRequest");
const Review = require("../models/Review");
const User = require("../models/User");
const Repository = require("../models/Repository");
const buildRepoContext = require("../utils/buildRepoContext");

const aiService = new AiService();

const processJob = async (job) => {
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

    const githubService = new GithubService(user.githubAccessToken);
    const files = await githubService.getPullRequestFiles(pr.repository.owner, pr.repository.name, pr.number);

    const repoContext = buildRepoContext({
      frontend: "React",
      backend: "Express",
      database: "MongoDB",
      framework: "MERN",
      dependencies: ["react", "express", "mongoose", "jsonwebtoken"],
      changedFiles: files.map(f => f.filename),
    });

    console.log(`[Worker] Found ${files.length} changed files for PR ${pr.number}`);
    const fileReviews = [];

    for (const file of files) {
      if (file.patch && file.status !== "removed") {
        console.log(`[Worker] Analyzing file: ${file.filename}`);
        const review = await aiService.analyzeFile(file.filename, file.patch, repoContext);
        fileReviews.push({
          file: file.filename,
          issues: review.issues || [],
          suggestions: review.suggestions || []
        });
      }
    }

    console.log(`[Worker] Generating summary for PR ${pr.number}...`);
    const analysisResult = await aiService.generateSummary(fileReviews, repoContext);

    console.log("===== ANALYSIS RESULT =====");
    console.log(JSON.stringify(analysisResult, null, 2));
    console.log("===========================");

    const review = await Review.create({
      repository: pr.repository._id,
      pullRequest: pr._id,
      summary: analysisResult.summary || "No summary available",
      score: analysisResult.overallScore || 0,
      architectureScore: analysisResult.architectureScore || 0,
      securityScore: analysisResult.securityScore || 0,
      performanceScore: analysisResult.performanceScore || 0,
      maintainabilityScore: analysisResult.maintainabilityScore || 0,
      strengths: analysisResult.strengths || [],
      improvements: analysisResult.improvements || [],
      findings: analysisResult.criticalIssues || [],
      fileReviews: fileReviews,
    });

    pr.analysisStatus = "completed";
    pr.riskScore = 100 - (analysisResult.overallScore || 0);
    await pr.save();

    const repo = await Repository.findById(pr.repository._id);
    repo.healthScore = Math.floor((repo.healthScore + (analysisResult.overallScore || 0)) / 2);
    await repo.save();

    console.log(`[Worker] Completed analysis for PR ${prId}.Review ID: ${review._id}`);
    return review._id;
  } catch (error) {
    console.error(`[Worker] Error processing PR ${prId}: `, error.message);
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
};

let worker = null;

if (!connection) {
  console.warn("[Worker] Redis not available — AI analysis worker is disabled.");
} else {
  const { Worker } = require("bullmq");
  worker = new Worker("ai-analysis", processJob, { connection });

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.log(`[Worker] Job ${job?.id} failed with error ${err.message}`);
  });

  console.log("[Worker] AI analysis worker started.");
}

module.exports = {
  worker,
  processJob
};
