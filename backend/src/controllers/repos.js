const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../utils/asyncHandler");
const Repository = require("../models/Repository");
const GithubService = require("../services/githubService");

// @desc    Get all connected repositories for user
// @route   GET /api/repos
// @access  Private
exports.getRepositories = asyncHandler(async (req, res, next) => {
  const repos = await Repository.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: repos.length,
    data: repos,
  });
});

// @desc    Sync repositories from GitHub
// @route   POST /api/repos/sync
// @access  Private
exports.syncRepositories = asyncHandler(async (req, res, next) => {
  if (!req.user.githubAccessToken) {
    return next(new ErrorResponse("GitHub is not connected", 400));
  }

  const githubService = new GithubService(req.user.githubAccessToken);
  const githubRepos = await githubService.getUserRepositories();

  // Save or update repos in DB
  const syncedRepos = await Promise.all(
    githubRepos.map(async (repo) => {
      return await Repository.findOneAndUpdate(
        { githubRepoId: repo.id.toString() },
        {
          name: repo.name,
          owner: repo.owner.login,
          user: req.user.id,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          openPRs: repo.open_issues_count, // GitHub groups PRs and issues here, but for simplicity
        },
        { new: true, upsert: true, runValidators: true }
      );
    })
  );

  res.status(200).json({
    success: true,
    count: syncedRepos.length,
    data: syncedRepos,
  });
});

// @desc    Delete repository connection
// @route   DELETE /api/repos/:id
// @access  Private
exports.deleteRepository = asyncHandler(async (req, res, next) => {
  const repo = await Repository.findById(req.params.id);

  if (!repo) {
    return next(new ErrorResponse(`Repository not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns repo
  if (repo.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to delete this repository`, 401));
  }

  await repo.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
