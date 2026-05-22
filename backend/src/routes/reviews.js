const express = require("express");
const { getReviewByPR, getReviewsByRepo } = require("../controllers/reviews");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/:prId", getReviewByPR);
router.get("/repo/:repoId", getReviewsByRepo);

module.exports = router;
