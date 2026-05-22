const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const Review = require("../models/Review");
const PullRequest = require("../models/PullRequest");
const Repository = require("../models/Repository");

// @desc    Get review for a specific pull request
// @route   GET /api/reviews/:prId
// @access  Private
exports.getReviewByPR = asyncHandler(async (req, res, next) => {
  const pr = await PullRequest.findById(req.params.prId).populate("repository");

  if (!pr) {
    return next(new ErrorResponse("Pull request not found", 404));
  }

  // Verify ownership
  if (
    pr.repository.user.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  const review = await Review.findOne({ pullRequest: req.params.prId }).sort({
    createdAt: -1,
  });

  if (!review) {
    return next(new ErrorResponse("No review found for this PR", 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Get all reviews for a repository
// @route   GET /api/reviews/repo/:repoId
// @access  Private
exports.getReviewsByRepo = asyncHandler(async (req, res, next) => {
  const repo = await Repository.findById(req.params.repoId);

  if (!repo) {
    return next(new ErrorResponse("Repository not found", 404));
  }

  if (repo.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized", 401));
  }

  const reviews = await Review.find({ repository: req.params.repoId })
    .populate("pullRequest", "title number branch author state riskScore")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});
