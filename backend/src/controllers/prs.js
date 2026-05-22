const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../utils/asyncHandler");
const PullRequest = require("../models/PullRequest");
const Repository = require("../models/Repository");
const GithubService = require("../services/githubService");

// @desc    Get all pull requests for a repository
// @route   GET /api/prs/repo/:repoId
// @access  Private
exports.getRepoPullRequests = asyncHandler(async (req, res, next) => {
  const repo = await Repository.findById(req.params.repoId);

  if (!repo) {
    return next(new ErrorResponse("Repository not found", 404));
  }

  // Ensure user has access to repo
  if (repo.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized", 401));
  }

  const prs = await PullRequest.find({ repository: repo._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: prs.length,
    data: prs,
  });
});

// @desc    Sync PRs from GitHub for a specific repo
// @route   POST /api/prs/repo/:repoId/sync
// @access  Private
exports.syncPullRequests = asyncHandler(async (req, res, next) => {
  const repo = await Repository.findById(req.params.repoId);

  if (!repo) {
    return next(new ErrorResponse("Repository not found", 404));
  }

  if (!req.user.githubAccessToken) {
    return next(new ErrorResponse("GitHub not connected", 400));
  }

  const githubService = new GithubService(req.user.githubAccessToken);
  const githubPrs = await githubService.getRepositoryPullRequests(
    repo.owner,
    repo.name
  );

  const syncedPrs = await Promise.all(
    githubPrs.map(async (pr) => {
      return await PullRequest.findOneAndUpdate(
        { githubPrId: pr.id.toString(), repository: repo._id },
        {
          title: pr.title,
          number: pr.number,
          author: pr.user.login,
          branch: pr.head.ref,
          state: pr.state,
          // Commits/additions typically require fetching individual PR details
        },
        { new: true, upsert: true, runValidators: true }
      );
    })
  );

  res.status(200).json({
    success: true,
    count: syncedPrs.length,
    data: syncedPrs,
  });
});

// @desc    Trigger AI Analysis for PR
// @route   POST /api/prs/:id/analyze
// @access  Private
exports.analyzePullRequest = asyncHandler(async (req, res, next) => {
  const pr = await PullRequest.findById(req.params.id).populate("repository");

  if (!pr) {
    return next(new ErrorResponse("Pull Request not found", 404));
  }

  // Ensure user has access to repo
  if (pr.repository.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized", 401));
  }

  pr.analysisStatus = "pending";
  await pr.save();

  // Add job to BullMQ queue
  const { addAnalysisJob } = require("../jobs/queue");
  await addAnalysisJob({
    prId: pr._id.toString(),
    userId: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "Analysis job queued",
    data: pr,
  });
});
