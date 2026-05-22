const express = require("express");
const { protect } = require("../middleware/auth");
const PullRequest = require("../models/PullRequest");
const Repository = require("../models/Repository");
const GithubService = require("../services/githubService");
const { addAnalysisJob } = require("../jobs/queue");

const router = express.Router();
router.use(protect);

router.post("/analyze/:repoId", async (req, res) => {
  try {
    const { repoId } = req.params;

    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ success: false, message: "Repository not found" });
    }

    // Initialize GithubService to fetch PRs on the fly
    const githubService = new GithubService(req.user.githubAccessToken);
    
    // Sync latest PRs
    const githubPrs = await githubService.getRepositoryPullRequests(repo.owner, repo.name);
    
    // Prefer open PRs, but fall back to the most recent PR of any state
    const latestOpenPr = githubPrs.find(pr => pr.state === "open") || githubPrs[0];

    if (!latestOpenPr) {
      return res.status(404).json({
        success: false,
        message: "No Pull Requests found for this repository. Create a PR on GitHub first.",
      });
    }

    // Save or update this PR in our database
    const pr = await PullRequest.findOneAndUpdate(
      { githubPrId: latestOpenPr.id.toString(), repository: repo._id },
      {
        title: latestOpenPr.title,
        number: latestOpenPr.number,
        author: latestOpenPr.user.login,
        branch: latestOpenPr.head.ref,
        state: latestOpenPr.state,
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Queue for analysis
    pr.analysisStatus = "pending";
    await pr.save();

    try {
      await addAnalysisJob({
        prId: pr._id.toString(),
        userId: req.user.id,
      });
      console.log("Analysis job queued via BullMQ");
    } catch (queueError) {
      console.warn("Queue failed, falling back to local processing:", queueError.message);
      // Run background processing manually if Redis is down
      const AiWorker = require("../workers/aiWorker");
      if (AiWorker && typeof AiWorker.processJob === "function") {
        // Kick off the worker manually in the background without awaiting
        AiWorker.processJob({
          data: {
            prId: pr._id.toString(),
            userId: req.user.id,
          }
        }).catch(err => console.error("Local processing error:", err));
      }
    }

    res.json({
      success: true,
      message: "Analysis job queued for PR #" + pr.number,
    });
  } catch (error) {
    console.error("Analysis route error:", error);
    res.status(500).json({
      success: false,
      message: "Analysis failed: " + error.message,
      stack: error.stack
    });
  }
});

module.exports = router;