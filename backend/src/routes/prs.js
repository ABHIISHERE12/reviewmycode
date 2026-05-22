const express = require("express");
const {
  getRepoPullRequests,
  syncPullRequests,
  analyzePullRequest,
} = require("../controllers/prs");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/repo/:repoId", getRepoPullRequests);
router.post("/repo/:repoId/sync", syncPullRequests);
router.post("/:id/analyze", analyzePullRequest);

module.exports = router;
