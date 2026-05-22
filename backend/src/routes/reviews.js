const express = require("express");
const { getReviewByPR, getReviewsByRepo } = require("../controllers/reviews");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// IMPORTANT: specific routes must come BEFORE wildcard routes
router.get("/repo/:repoId", getReviewsByRepo);
router.get("/:prId", getReviewByPR);

module.exports = router;
