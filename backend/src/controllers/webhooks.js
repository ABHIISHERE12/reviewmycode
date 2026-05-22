const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const Repository = require("../models/Repository");
const PullRequest = require("../models/PullRequest");
const { addAnalysisJob } = require("../jobs/queue");

// @desc    Handle GitHub webhooks
// @route   POST /api/webhooks/github
// @access  Public
exports.handleGithubWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers["x-hub-signature-256"];
  const event = req.headers["x-github-event"];
  
  // 1. Verify webhook signature (Assuming process.env.WEBHOOK_SECRET is set in GitHub)
  if (process.env.WEBHOOK_SECRET && signature) {
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    const digest = "sha256=" + hmac.update(payload).digest("hex");
    
    if (signature !== digest) {
      return res.status(401).send("Invalid signature");
    }
  }

  // 2. Handle Pull Request events
  if (event === "pull_request") {
    const { action, pull_request, repository } = req.body;

    // We only want to analyze newly opened or synchronized (new commits) PRs
    if (action === "opened" || action === "synchronize") {
      
      // Find the connected repository in our DB
      const repo = await Repository.findOne({ githubRepoId: repository.id.toString() });
      
      if (repo) {
        // Upsert PR in our DB
        const pr = await PullRequest.findOneAndUpdate(
          { githubPrId: pull_request.id.toString(), repository: repo._id },
          {
            title: pull_request.title,
            number: pull_request.number,
            author: pull_request.user.login,
            branch: pull_request.head.ref,
            state: pull_request.state,
            commits: pull_request.commits,
            changedFiles: pull_request.changed_files,
            additions: pull_request.additions,
            deletions: pull_request.deletions,
            analysisStatus: "pending"
          },
          { new: true, upsert: true }
        );

        // Auto-trigger AI analysis queue job
        await addAnalysisJob({
          prId: pr._id.toString(),
          userId: repo.user.toString(),
        });
      }
    }
  }

  res.status(200).send("Webhook received");
});
