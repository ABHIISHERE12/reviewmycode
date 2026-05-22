const asyncHandler = require("../utils/asyncHandler");
const Repository = require("../models/Repository");
const PullRequest = require("../models/PullRequest");
const Review = require("../models/Review");

// @desc    Get dashboard analytics overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = asyncHandler(async (req, res, next) => {
  // 1. Get total connected repos
  const totalRepos = await Repository.countDocuments({ user: req.user.id });

  // 2. Get repos to fetch their IDs
  const repos = await Repository.find({ user: req.user.id }).select("_id");
  const repoIds = repos.map((repo) => repo._id);

  // 3. Get total PRs analyzed
  const totalPRs = await PullRequest.countDocuments({
    repository: { $in: repoIds },
  });

  // 4. Get total Reviews
  const totalReviews = await Review.countDocuments({
    repository: { $in: repoIds },
  });

  // 5. Calculate average health score
  const reposWithScores = await Repository.find({ user: req.user.id }).select("healthScore");
  const avgHealthScore = reposWithScores.length > 0 
    ? Math.round(reposWithScores.reduce((acc, curr) => acc + curr.healthScore, 0) / reposWithScores.length)
    : 100;

  // 6. Aggregate security issues across all reviews
  const reviews = await Review.find({ repository: { $in: repoIds } }).select("findings");
  let criticalIssues = 0;
  let totalIssues = 0;

  reviews.forEach(review => {
    review.findings.forEach(finding => {
      totalIssues++;
      if (finding.severity === "critical" || finding.severity === "high") {
        criticalIssues++;
      }
    });
  });

  res.status(200).json({
    success: true,
    data: {
      totalRepos,
      totalPRs,
      totalReviews,
      avgHealthScore,
      totalIssuesFound: totalIssues,
      criticalSecurityIssues: criticalIssues,
    },
  });
});
